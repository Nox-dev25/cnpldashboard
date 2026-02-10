import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const sessionId = (await cookies()).get("session_id")?.value;

    if (!sessionId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await db.session.findUnique({
        where: { id: sessionId },
        include: {
            user: {
                include: {
                    onboarding: true,
                },
            },
        },
    });

    if (!session || session.expiresAt < new Date()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
        user: {
            id: session.user.id,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            email: session.user.email,
            phone: session.user.phone,
            countryCode: session.user.countryCode,
            isEmailVerified: session.user.isEmailVerified === 1,
            isPhoneVerified: session.user.isPhoneVerified === 1,
        },
        onboarding: {
            uuid: session.user.onboarding?.uuid,
            status: session.user.onboarding?.status,
        },
    });
}