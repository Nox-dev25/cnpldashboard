import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const session = req.cookies.get("session_id");
    const { pathname } = req.nextUrl;

    // Protected app routes
    const protectedPaths = [
        "/dashboard",
        "/account",
        "/billing",
        "/orders",
        "/onboarding",
    ];

    const isProtected = protectedPaths.some(path =>
        pathname.startsWith(path)
    );

    // Not logged in redirect to login
    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/account/:path*",
        "/billing/:path*",
        "/orders/:path*",
        "/onboarding",
    ],
};