import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, email, status } = body;

        const numericId = parseInt(id.replace("USR", ""), 10);

        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        const isEmailVerified = status === "active" ? 1 : null;

        const updatedUser = await db.user.update({
            where: { id: numericId },
            data: {
                firstName,
                lastName,
                email,
                isEmailVerified,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                countryCode: true,
                isEmailVerified: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                id: `USR${String(updatedUser.id).padStart(3, "0")}`,
                name: `${updatedUser.firstName} ${updatedUser.lastName}`,
                email: updatedUser.email,
                phone: `${updatedUser.countryCode} ${updatedUser.phone}`,
                status: updatedUser.isEmailVerified ? "active" : "inactive",
                kycStatus: "pending",
                createdAt: updatedUser.createdAt.toISOString().split("T")[0],
                avatar: `${updatedUser.firstName[0]}${updatedUser.lastName[0]}`.toUpperCase(),
            },
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update user" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                countryCode: true,
                isEmailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Transform data for frontend
        const formattedUsers = users.map((user) => ({
            id: `USR${String(user.id).padStart(3, "0")}`,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: `${user.countryCode} ${user.phone}`,
            status: user.isEmailVerified ? "active" : "inactive",
            kycStatus: "pending", // You can add KYC status to your schema later
            createdAt: user.createdAt.toISOString().replace("T", " ").slice(0, 16),
            updatedAt: user.updatedAt.toISOString().replace("T", " ").slice(0, 16),
            avatar: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase(),
        }));

        return NextResponse.json({
            success: true,
            data: formattedUsers,
            total: formattedUsers.length,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
