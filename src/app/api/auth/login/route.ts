import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { validateWhmcsLogin } from "@/lib/whmcs";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // =========================================================
        // ALWAYS TRY WHMCS LOGIN FIRST (source of truth)
        // =========================================================
        console.log("Trying WHMCS login...");
        const whmcsUser = await validateWhmcsLogin(email, password);

        if (whmcsUser) {
            console.log("WHMCS login successful:", whmcsUser);

            // =========================================================
            // Check if user exists locally
            // =========================================================
            let user = await db.user.findUnique({ where: { email } });

            if (!user) {
                // =========================================================
                // JIT CREATE LOCAL USER
                // =========================================================
                console.log("Creating new local user from WHMCS...");
                user = await db.user.create({
                    data: {
                        firstName: whmcsUser.firstName,
                        lastName: whmcsUser.lastName,
                        email: whmcsUser.email,
                        phone: whmcsUser.phone ?? "",
                        countryCode: "",
                        passwordHash: await bcrypt.hash(password, 12),
                        isEmailVerified: 1,
                        isPhoneVerified: 1,
                        whmcsClientId: whmcsUser.clientId,
                        lockStatus: "active",
                    },
                });

                // Create completed onboarding automatically
                await db.onboarding.create({
                    data: {
                        userId: user.id,
                        uuid: uuidv4(),
                        whmcsClientId: whmcsUser.clientId,
                        status: "completed",
                    },
                });
            } else {
                // =========================================================
                // UPDATE LOCAL PASSWORD HASH (sync with WHMCS)
                // =========================================================
                console.log("Updating local user password hash...");
                await db.user.update({
                    where: { id: user.id },
                    data: {
                        passwordHash: await bcrypt.hash(password, 12),
                        // Optional: sync other fields too
                        firstName: whmcsUser.firstName,
                        lastName: whmcsUser.lastName,
                        phone: whmcsUser.phone ?? user.phone,
                    },
                });
            }

            // =========================================================
            // CREATE SESSION
            // =========================================================
            const sessionId = uuidv4();
            const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

            await db.session.create({
                data: {
                    id: sessionId,
                    userId: user.id,
                    expiresAt: expires,
                },
            });

            const response = NextResponse.json({ success: true });

            response.cookies.set("session_id", sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                expires,
            });

            return response;
        }

        // =========================================================
        // FALLBACK: Try local-only user (optional)
        // =========================================================
        // This section is only for users who exist ONLY in DB
        console.log("WHMCS login failed, trying local user...");
        const localUser = await db.user.findUnique({ where: { email } });

        if (localUser && !localUser.whmcsClientId) {
            // Only allow local login if user is NOT a WHMCS user
            const valid = await bcrypt.compare(password, localUser.passwordHash);
            if (valid) {
                const sessionId = uuidv4();
                const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

                await db.session.create({
                    data: {
                        id: sessionId,
                        userId: localUser.id,
                        expiresAt: expires,
                    },
                });

                const response = NextResponse.json({ success: true });

                response.cookies.set("session_id", sessionId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    expires,
                });

                return response;
            }
        }

        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}