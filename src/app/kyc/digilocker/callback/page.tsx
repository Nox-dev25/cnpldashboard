"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function DigiLockerCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const verificationId = searchParams.get("verification_id");

        if (!verificationId) {
            toast.error("Missing verification reference");
            router.push("/onboarding");
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
                    toast("Verification still pending. Please wait...");
                }
            } catch (err) {
                toast.error("Failed to verify identity");
            } finally {
                router.push("/onboarding");
            }
        };

        checkStatus();
    }, [router, searchParams]);

    return <p className="text-center mt-10">Verifying your identity…</p>;
}