"use client";

import { Button } from "@/app/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface IndividualVerificationProps {
    isVerified: boolean;
    onVerify: () => void;
}

export const IndividualVerification = ({
    isVerified,
    onVerify,
}: IndividualVerificationProps) => {
    return (
        <div className="pt-2">
            <Button
                onClick={onVerify}
                className="w-full md:w-auto"
                disabled={isVerified}
            >
                {isVerified ? (
                    <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Verified Your Aadhar
                    </>
                ) : (
                    "VERIFY WITH DIGILOCKER"
                )}
            </Button>
        </div>
    );
};
