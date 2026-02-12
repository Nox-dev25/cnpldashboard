"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function DigiLockerCallbackInner() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const verificationId = searchParams.get("verification_id");

        if (!verificationId) return;

        // send message to opener tab
        if (window.opener) {
            window.opener.postMessage(
                {
                    type: "DIGILOCKER_SUCCESS",
                    verificationId,
                },
                window.location.origin
            );

            // close popup tab
            window.close();
        }
    }, [searchParams]);

    return <p className="text-center mt-10">Verification successful. Closing…</p>;
}