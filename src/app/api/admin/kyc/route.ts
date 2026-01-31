import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status"); // pending, approved, rejected, or null for all

        const whereClause = status ? { status } : {};

        const kycRecords = await db.kycVerification.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        countryCode: true,
                    },
                },
            },
            orderBy: {
                submittedAt: "desc",
            },
        });

        // Transform data for frontend
        const formattedRecords = kycRecords.map((record) => ({
            id: `KYC${String(record.id).padStart(3, "0")}`,
            name: `${record.user.firstName} ${record.user.lastName}`,
            email: record.user.email,
            phone: `${record.user.countryCode} ${record.user.phone}`,
            documentType: record.documentType,
            status: record.status,
            submittedAt: record.submittedAt.toISOString().replace("T", " ").substring(0, 16),
            approvedAt: record.approvedAt?.toISOString().replace("T", " ").substring(0, 16) || null,
            approvedBy: record.approvedBy || null,
            rejectedAt: record.rejectedAt?.toISOString().replace("T", " ").substring(0, 16) || null,
            rejectedBy: record.rejectedBy || null,
            rejectReason: record.rejectReason || null,
            avatar: `${record.user.firstName.charAt(0)}${record.user.lastName.charAt(0)}`.toUpperCase(),
            userId: record.userId,
        }));

        return NextResponse.json({
            success: true,
            data: formattedRecords,
            total: formattedRecords.length,
        });
    } catch (error) {
        console.error("Error fetching KYC records:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch KYC records" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, action, reason, adminName } = body;

        // Extract numeric ID from formatted ID (e.g., KYC001 -> 1)
        const numericId = parseInt(id.replace("KYC", ""), 10);

        if (action === "approve") {
            await db.kycVerification.update({
                where: { id: numericId },
                data: {
                    status: "approved",
                    approvedBy: adminName || "Admin",
                    approvedAt: new Date(),
                },
            });
        } else if (action === "reject") {
            await db.kycVerification.update({
                where: { id: numericId },
                data: {
                    status: "rejected",
                    rejectedBy: adminName || "Admin",
                    rejectedAt: new Date(),
                    rejectReason: reason || "No reason provided",
                },
            });
        } else {
            return NextResponse.json(
                { success: false, error: "Invalid action" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `KYC ${action === "approve" ? "approved" : "rejected"} successfully`,
        });
    } catch (error) {
        console.error("Error updating KYC record:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update KYC record" },
            { status: 500 }
        );
    }
}
