import { NextResponse } from "next/server";
import { cashfreeHeaders } from "@/lib/cashfree";

export async function POST(req: Request) {
    const { cin } = await req.json();

    if (!cin) {
        return NextResponse.json({ error: "CIN required" }, { status: 400 });
    }

    const res = await fetch(
        `${process.env.CASHFREE_BASE_URL}/verification/cin`,
        {
            method: "POST",
            headers: cashfreeHeaders(),
            body: JSON.stringify({ cin }),
        }
    );

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json(data, { status: 400 });
    }

    return NextResponse.json({
        success: true,
        company_name: data.company_name,
        status: data.status,
    });
}