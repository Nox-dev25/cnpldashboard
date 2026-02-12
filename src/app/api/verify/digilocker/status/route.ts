import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cashfreeClient } from "@/lib/cashfree";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        const verificationId = req.nextUrl.searchParams.get("id");
        if (!verificationId) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        // Get logged-in user
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session_id")?.value;

        if (!sessionId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const session = await db.session.findUnique({
            where: { id: sessionId },
            include: { user: true },
        });

        if (!session || session.expiresAt < new Date()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = session.user;

        // SANDBOX: try fetching document directly
        let docResult: any;
        try {
            docResult = await cashfreeClient.getDigiLockerDocument(verificationId);
        } catch {
            return NextResponse.json({
                success: true,
                status: "PENDING",
            });
        }

        if (docResult?.status !== "SUCCESS") {
            return NextResponse.json({
                success: true,
                status: docResult?.status || "PENDING",
            });
        }

        // Ensure KYC profile exists
        const kycProfile = await db.kycProfile.findUnique({
            where: { userId: user.id },
        });

        if (!kycProfile) {
            return NextResponse.json(
                { error: "KYC profile not found" },
                { status: 400 }
            );
        }

        // Upsert verification document
        await db.verificationDocument.upsert({
            where: { cashfreeRefId: verificationId },
            update: {
                verificationStatus: "success",
                extractedData: docResult,
                verifiedAt: new Date(),
            },
            create: {
                verificationType: "digilocker",
                cashfreeRefId: verificationId,
                verificationStatus: "success",
                extractedData: docResult,
                verifiedAt: new Date(),

                // REQUIRED RELATIONS
                user: { connect: { id: user.id } },
                kycProfile: { connect: { id: kycProfile.id } },
            },
        });

        // Mark Aadhaar verified
        await db.kycProfile.update({
            where: { id: kycProfile.id },
            data: { aadharVerified: true },
        });

        // Return Aadhaar address
        return NextResponse.json({
            success: true,
            status: "SUCCESS",
            address: docResult.split_address || null,
        });

    } catch (error: any) {
        console.error("DIGILOCKER STATUS ERROR:", error);

        return NextResponse.json(
            { error: error.message || "Status fetch failed" },
            { status: 500 }
        );
    }
}