import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
    try {
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
                    },
                },
            },
        });

        if (!session || session.expiresAt < new Date()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Already completed
        if (session.user.onboarding?.status === "completed") {
            return NextResponse.json(
                { error: "Onboarding already completed" },
                { status: 400 }
            );
        }

        // Resume onboarding
        if (session.user.onboarding) {
            return NextResponse.json({
                onboardingUuid: session.user.onboarding.uuid,
            });
        }

        // Create onboarding
        const onboardingUuid = uuidv4();

        const onboarding = await db.onboarding.create({
            data: {
                uuid: onboardingUuid,
                userId: session.user.id,
                whmcsClientId: null,
                status: "pending",
            },
        });

        return NextResponse.json({
            onboardingUuid: onboarding.uuid,
        });
    } catch (err) {
        console.error("Onboarding start error:", err);
        return NextResponse.json(
            { error: "Failed to start onboarding" },
            { status: 500 }
        );
    }
}