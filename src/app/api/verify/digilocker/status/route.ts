import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cashfreeClient } from "@/lib/cashfree";

export async function GET(req: NextRequest) {
    try {
        const verificationId = req.nextUrl.searchParams.get("id");
        if (!verificationId) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const statusResult = await cashfreeClient.getDigiLockerStatus(verificationId);

        if (statusResult.status === "VALID") {
            await db.verificationDocument.updateMany({
                where: { cashfreeRefId: verificationId },
                data: {
                    verificationStatus: "success",
                    extractedData: statusResult.data,
                    verifiedAt: new Date(),
                },
            });
        }

        return NextResponse.json({ success: true, status: statusResult.status });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Status fetch failed" },
            { status: 500 }
        );
    }
}