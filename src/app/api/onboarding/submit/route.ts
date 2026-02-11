import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
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

        const body = await req.json();

        const {
            accountType,
            country,
            state,
            city,
            postalCode,
            streetAddress,
            companyName,
            businessType,
            gstVerified,
            cinVerified,
            aadharVerified,
            digilockerRef,
        } = body;

        // Basic validation
        if (!accountType || !country) {
            return NextResponse.json(
                { error: "Missing required KYC fields" },
                { status: 400 }
            );
        }

        // Create or update KYC profile
        const kycProfile = await db.kycProfile.upsert({
            where: { userId: session.user.id },
            update: {
                accountType,
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                email: session.user.email,
                phone: session.user.phone,
                country,
                state,
                city,
                postalCode,
                streetAddress,
                companyName,
                businessType,
                gstVerified: !!gstVerified,
                cinVerified: !!cinVerified,
                aadharVerified: !!aadharVerified,
                digilockerRef,
            },
            create: {
                userId: session.user.id,
                accountType,
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                email: session.user.email,
                phone: session.user.phone,
                country,
                state,
                city,
                postalCode,
                streetAddress,
                companyName,
                businessType,
                gstVerified: !!gstVerified,
                cinVerified: !!cinVerified,
                aadharVerified: !!aadharVerified,
                digilockerRef,
            },
        });

        // LINK previous verification documents to this KYC
        await db.verificationDocument.updateMany({
            where: {
                userId: session.user.id,
                kycProfileId: null, // only unlinked docs
            },
            data: {
                kycProfileId: kycProfile.id,
            },
        });

        return NextResponse.json({
            success: true,
            kycProfileId: kycProfile.id,
        });

    } catch (error) {
        console.error("Save KYC error:", error);
        return NextResponse.json(
            { error: "Failed to save KYC" },
            { status: 500 }
        );
    }
}