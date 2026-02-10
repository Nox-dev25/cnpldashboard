import { NextResponse } from "next/server";
import { cashfreeHeaders } from "@/lib/cashfree";

export async function POST(req: Request) {
    const { aadhaar } = await req.json();

    if (!aadhaar) {
        return NextResponse.json({ error: "Aadhaar required" }, { status: 400 });
    }

    const res = await fetch(
        `${process.env.CASHFREE_BASE_URL}/verification/aadhaar`,
        {
            method: "POST",
            headers: cashfreeHeaders(),
            body: JSON.stringify({
                aadhaar_number: aadhaar,
            }),
        }
    );

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json(data, { status: 400 });
    }

    return NextResponse.json({
        success: true,
        reference_id: data.reference_id,
    });
}