import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const sessionId =
        req.headers
            .get("cookie")
            ?.match(/session_id=([^;]+)/)?.[1];

    if (sessionId) {
        await db.session.deleteMany({ where: { id: sessionId } });
    }

    const response = NextResponse.json({ success: true });

    // Delete cookie via response
    response.cookies.set("session_id", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0),
    });

    return response;
}