"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DigiLockerCallback() {
    const router = useRouter();

    useEffect(() => {
        fetch("/api/verify/digilocker/verify", { method: "POST" })
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    toast.error("DigiLocker verification failed");
                    router.push("/onboarding");
                    return;
                }

                toast.success("Identity verified successfully");
                router.push("/onboarding");
            });
    }, [router]);

    return <p className="text-center mt-10">Verifying your identity…</p>;
}