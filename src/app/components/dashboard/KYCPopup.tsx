"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface KYCPopupProps {
    onboardingId?: string;
}

export function KYCPopup({ onboardingId }: KYCPopupProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Check if we should show the popup from URL params
        const showPopup = searchParams.get("showKycPopup");
        if (showPopup === "true") {
            setOpen(true);
            // Clean up the URL
            const url = new URL(window.location.href);
            url.searchParams.delete("showKycPopup");
            window.history.replaceState({}, "", url.toString());
        }
    }, [searchParams]);

    const handleCompleteKYC = () => {
        if (onboardingId) {
            router.push(`/onboarding?id=${onboardingId}`);
        } else {
            // If no onboarding ID, you might want to create one or show an error
            console.error("No onboarding ID available");
        }
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 backdrop-blur-xl dark:bg-white/10">
                            <AlertCircle className="h-5 w-5 text-dark dark:text-white" />
                        </div>
                        <DialogTitle className="text-xl">KYC Required</DialogTitle>
                    </div>
                    <DialogDescription className="pt-4 text-base">
                        You need to complete your Know Your Customer (KYC) verification to access all features and pages.
                        Please complete the verification process.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="w-full sm:w-auto"
                    >
                        Later
                    </Button>
                    <Button
                        onClick={handleCompleteKYC}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                    >
                        Complete KYC Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
