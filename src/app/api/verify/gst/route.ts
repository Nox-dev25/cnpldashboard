import { NextResponse } from "next/server";
import { cashfreeHeaders } from "@/lib/cashfree";

export async function POST(req: Request) {
    const { gst } = await req.json();

    const res = await fetch(
        `${process.env.CASHFREE_BASE_URL}/verification/gstin`,
        {
            method: "POST",
            headers: cashfreeHeaders(),
            body: JSON.stringify({ gstin: gst }),
        }
    );

    const data = await res.json();

    return NextResponse.json({
        success: true,
        legal_name: data.legal_name,
        state: data.state,
    });
}