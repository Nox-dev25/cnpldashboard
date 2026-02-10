import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { cashfreeHeaders } from "@/lib/cashfree";

export async function POST() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;
    if (!sessionId) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

    const session = await db.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
    });

    if (!session) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

    const kyc = await db.kycProfile.findUnique({
        where: { userId: session.userId },
    });

    if (!kyc?.digilockerRef) {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    const res = await fetch(
        `${process.env.CASHFREE_BASE_URL}/verification/digilocker/${kyc.digilockerRef}`,
        { headers: cashfreeHeaders() }
    );

    const data = await res.json();

    if (data.status !== "VERIFIED") {
        return NextResponse.json({ success: false });
    }

    await db.kycProfile.update({
        where: { userId: session.userId },
        data: {
            aadharVerified: true,
        },
    });

    return NextResponse.json({ success: true });
}