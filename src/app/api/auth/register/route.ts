import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const {
            firstName,
            lastName,
            phone,
            countryCode,
            email,
            password,
            phoneVerified,
            emailVerified,
        } = await req.json();

        if (!phoneVerified || !emailVerified) {
            return NextResponse.json(
                { error: "Phone and Email must be verified" },
                { status: 400 }
            );
        }

        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const result = await db.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    firstName,
                    lastName,
                    phone,
                    countryCode,
                    email,
                    passwordHash,
                    isPhoneVerified: 1,
                    isEmailVerified: 1,
                },
            });

            const onboarding = await tx.onboarding.create({
                data: {
                    uuid: uuidv4(),
                    userId: user.id,
                    whmcsClientId: null,
                },
            });

            return { user, onboarding };
        });

        return NextResponse.json({
            success: true,
            onboardingUuid: result.onboarding.uuid,
        });

    } catch (err) {
        console.error("Register error:", err);
        return NextResponse.json(
            { error: "Registration failed" },
            { status: 500 }
        );
    }
}