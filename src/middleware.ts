import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const session = req.cookies.get("session_id");
    const { pathname } = req.nextUrl;

    // Protected routes
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

    // Check if user is authenticated
    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Special handling for onboarding page
    if (pathname.startsWith("/onboarding")) {
        const onboardingId = req.nextUrl.searchParams.get("id");

        if (!onboardingId) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    // For all other protected routes (except dashboard and onboarding),
    // we'll let the client-side check handle the onboarding status
    // and redirect if needed. This is because Edge Runtime doesn't support Prisma.

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/account/:path*",
        "/billing/:path*",
        "/orders/:path*",
        "/onboarding/:path*",
    ],
};