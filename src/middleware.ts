import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const session = req.cookies.get("session_id");

    const protectedPaths = ["/", "/dashboard", "/account", "/billing", "/orders"];

    const isProtected = protectedPaths.some(path =>
        req.nextUrl.pathname.startsWith(path)
    );

    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/account/:path*", "/billing/:path*", "/orders/:path*"],
};