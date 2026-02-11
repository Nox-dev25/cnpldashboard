import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { cashfreeClient } from '@/lib/cashfree';

export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: currentUser.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Call Cashfree
        const verificationResult = await cashfreeClient.verifyDigiLocker({
            document_requested: ["AADHAAR"],
        });

        // Store ONLY verification document (no kycProfile)
        await db.verificationDocument.create({
            data: {
                userId: user.id,
                verificationType: "digilocker",
                cashfreeRefId: verificationResult.verification_id,
                verificationStatus: "pending",
                rawResponse: verificationResult,
            },
        });

        return NextResponse.json({
            success: true,
            url: verificationResult.url,
            verificationId: verificationResult.verification_id,
            status: verificationResult.status,
        });

    } catch (error: any) {
        console.error("DigiLocker API error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to start verification" },
            { status: 500 }
        );
    }
}