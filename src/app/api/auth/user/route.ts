import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function GET() {
    const sessionId = (await cookies()).get("session_id")?.value;
    if (!sessionId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await db.session.findUnique({
        where: { id: sessionId },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    countryCode: true,
                    phone: true,
                    email: true,
                    isPhoneVerified: true,
                    isEmailVerified: true,
                    whmcsClientId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });

    if (!session || session.expiresAt < new Date()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(session.user);
}