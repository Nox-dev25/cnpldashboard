import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cashfreeHeaders } from "@/lib/cashfree";
import { db } from "@/lib/db";

export async function POST() {
    try {
        const res = await fetch(
            `${process.env.CASHFREE_BASE_URL}/verification/v1/identity/digilocker/initiate`,
            {
                method: "POST",
                headers: cashfreeHeaders(),
                body: JSON.stringify({
                    redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/kyc/digilocker/callback`,
                }),
            }
        );

        const data = await res.json();

        if (!res.ok || !data.redirect_url || !data.reference_id) {
            console.error("Cashfree error:", data);
            return NextResponse.json(
                { error: "Failed to initiate DigiLocker" },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session_id")?.value;

        if (sessionId) {
            const session = await db.session.findUnique({
                where: { id: sessionId },
            });

            if (session) {
                await db.kycProfile.update({
                    where: { userId: session.userId },
                    data: { digilockerRef: data.reference_id },
                });
            }
        }

        return NextResponse.json({ redirectUrl: data.redirect_url });
    } catch (err) {
        console.error("DigiLocker initiate error:", err);
        return NextResponse.json(
            { error: "DigiLocker initiation failed" },
            { status: 500 }
        );
    }
}