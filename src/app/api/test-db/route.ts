import { callWhmcs } from "@/lib/whmcsProxy";

export async function GET() {
    try {
        // simple safe WHMCS call
        const data = await callWhmcs("GetClients", {
            limitnum: 1,
        });

        return Response.json({
            success: true,
            whmcs: data,
        });
    } catch (error: any) {
        return Response.json(
            {
                success: false,
                error: error.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}