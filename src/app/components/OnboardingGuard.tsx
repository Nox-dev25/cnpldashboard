"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface OnboardingGuardProps {
    children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                // Skip check for dashboard and onboarding pages
                if (pathname === "/dashboard" || pathname.startsWith("/onboarding")) {
                    setIsAllowed(true);
                    setIsChecking(false);
                    return;
                }

                const response = await fetch("/api/user/onboarding-status");
                if (response.ok) {
                    const data = await response.json();

                    // If onboarding is not completed, redirect to dashboard with popup
                    if (!data.status || data.status !== "completed") {
                        router.push("/dashboard?showKycPopup=true");
                        return;
                    }

                    setIsAllowed(true);
                } else {
                    // If API fails, allow access (fail open)
                    setIsAllowed(true);
                }
            } catch (error) {
                console.error("Failed to check onboarding status:", error);
                // On error, allow access
                setIsAllowed(true);
            } finally {
                setIsChecking(false);
            }
        };

        checkOnboardingStatus();
    }, [pathname, router]);

    // Show loading state while checking
    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Only render children if allowed
    return isAllowed ? <>{children}</> : null;
}
