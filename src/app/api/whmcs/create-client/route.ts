import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { createWhmcsClient } from "@/lib/whmcs";
import { decrypt } from "@/lib/securePassword";
import { countryNameToISO } from "@/lib/countryCode";

export async function POST() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (!sessionId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await db.session.findUnique({
        where: { id: sessionId },
        include: {
            user: {
                include: {
                    onboarding: true,
                    kycProfile: true,
                },
            },
        },
    });

    if (!session || session.expiresAt < new Date()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { onboarding, kycProfile, isEmailVerified, lockStatus } = session.user;

    if (!onboarding || onboarding.status === "completed") {
        return NextResponse.json({ error: "Invalid onboarding state" }, { status: 400 });
    }

    if (!isEmailVerified) {
        return NextResponse.json({ error: "Email not verified" }, { status: 400 });
    }

    if (!kycProfile || !kycProfile.aadharVerified) {
        return NextResponse.json({ error: "KYC incomplete" }, { status: 400 });
    }

    // decrypt temporary password
    const plainPassword = decrypt(lockStatus);

    let whmcsClientId: number;

    // Create WHMCS client
    try {
        whmcsClientId = await createWhmcsClient({
            firstName: kycProfile.firstName,
            lastName: kycProfile.lastName,
            email: kycProfile.email,
            phone: kycProfile.phone,
            country: countryNameToISO[kycProfile.country] || "IN",
            state: kycProfile.state ?? undefined,
            city: kycProfile.city ?? undefined,
            postcode: kycProfile.postalCode ?? undefined,
            address1: kycProfile.streetAddress ?? undefined,
            companyName: kycProfile.companyName ?? undefined,
            password: plainPassword,
        });
    } catch (err: any) {
        console.error("WHMCS ERROR:", err.message);

        // Handle duplicate email cleanly
        if (err.message?.includes("already exists")) {
            return NextResponse.json(
                { error: "A client with this email already exists." },
                { status: 400 }
            );
        }

        // generic WHMCS failure
        return NextResponse.json(
            { error: "Failed to create account. Please try again." },
            { status: 500 }
        );
    }

    await db.onboarding.update({
        where: { id: onboarding.id },
        data: {
            whmcsClientId,
            status: "completed",
        },
    });

    // remove encrypted password
    await db.user.update({
        where: { id: session.user.id },
        data: { lockStatus: "active" },
    });

    return NextResponse.json({
        success: true,
        whmcsClientId,
    });
}