import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Create session
        const sessionId = uuidv4();
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

        await db.session.create({
            data: {
                id: sessionId,
                userId: user.id,
                expiresAt: expires,
            },
        });

        // Create response
        const response = NextResponse.json({ success: true });

        // Set cookie on response
        response.cookies.set("session_id", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires,
        });

        return response;

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}