"use client";

import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { CheckCircle2 } from "lucide-react";

interface VerificationStatus {
    email: boolean;
    phone: boolean;
}

interface AccountVerificationProps {
    email: string;
    phone: string;
    verification: VerificationStatus;
}

export const AccountVerification = ({
    email,
    phone,
    verification,
}: AccountVerificationProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Account Verification</h3>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>
                        Email {verification.email ? "(Verified)" : "(Not Verified)"}{" "}
                        <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            type="email"
                            value={email}
                            readOnly
                            disabled={verification.email}
                            className={`pr-24 ${verification.email ? "bg-muted cursor-not-allowed" : ""}`}
                        />
                        {verification.email && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>
                        Phone <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            type="tel"
                            value={phone}
                            readOnly
                            disabled={verification.phone}
                            className={`pr-10 ${verification.phone ? "bg-muted cursor-not-allowed" : ""}`}
                        />
                        {verification.phone && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
