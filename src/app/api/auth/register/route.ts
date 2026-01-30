import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            firstName,
            lastName,
            phone,
            countryCode,
            email,
            password
        } = body;

        // Check if user exists
        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Insert user
        const user = await db.user.create({
            data: {
                firstName,
                lastName,
                phone,
                countryCode,
                email,
                passwordHash,
                otpVerified: true
            }
        });

        return NextResponse.json({ success: true, userId: user.id });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Registration failed" },
            { status: 500 }
        );
    }
}