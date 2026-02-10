import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session_id")?.value;

        if (!sessionId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get user session
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                user: {
                    include: {
                        onboarding: true,
                    },
                },
            },
        });

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Return onboarding status
        return NextResponse.json({
            status: session.user.onboarding?.status || null,
            uuid: session.user.onboarding?.uuid || null,
        });
    } catch (error) {
        console.error("Error fetching onboarding status:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}