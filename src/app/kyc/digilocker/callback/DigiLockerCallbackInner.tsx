"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

function DigiLockerCallbackInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const verificationId = searchParams.get("verification_id");
        const onboardingId = localStorage.getItem("onboardingId");

        if (!verificationId || !onboardingId) {
            toast.error("Verification session expired");
            router.replace("/dashboard");
            return;
        }

        const checkStatus = async () => {
            try {
                const res = await fetch(
                    `/api/verify/digilocker/status?id=${verificationId}`
                );
                const data = await res.json();

                if (data.status === "VALID") {
                    toast.success("Identity verified successfully");
                } else if (data.status === "FAILED") {
                    toast.error("DigiLocker verification failed");
                } else {
                    toast("Verification still pending...");
                }
            } catch {
                toast.error("Failed to verify identity");
            } finally {
                router.replace(
                    `/onboarding?id=${onboardingId}&verification_id=${verificationId}`
                );
            }
        };

        checkStatus();
    }, [router, searchParams]);

    return <p className="text-center mt-10">Verifying your identity…</p>;
}

export default DigiLockerCallbackInner;