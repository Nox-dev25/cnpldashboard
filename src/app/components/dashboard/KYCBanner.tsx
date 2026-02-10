"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

interface KYCBannerProps {
  userName?: string;
}

type User = {
  firstName: string;
  lastName: string;
};

export function KYCBanner({ userName = "User" }: KYCBannerProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(true);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data);
      } catch {
        // silently fail — middleware will redirect if needed
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch onboarding status
  useEffect(() => {
    const fetchOnboarding = async () => {
      try {
        const res = await fetch("/api/onboarding/client");
        if (!res.ok) {
          setOnboardingStatus(null);
          return;
        }

        const data = await res.json();
        setOnboardingStatus(data.onboarding?.status ?? null);
      } catch (err) {
        console.error(err);
        setOnboardingStatus(null);
      } finally {
        setIsLoadingOnboarding(false);
      }
    };

    fetchOnboarding();
  }, []);

  const handleCompleteKYC = async () => {
    try {
      toast.info("Starting KYC process...");

      const res = await fetch("/api/onboarding/start", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Unable to start onboarding");
        return;
      }

      if (res.ok) {
        window.location.href = `/onboarding?id=${data.onboardingUuid}`;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // Show loading skeleton while fetching
  if (isLoadingUser || isLoadingOnboarding) {
    return (
      <div className="space-y-4">
        <div>
          <div className="h-7 w-48 bg-muted animate-pulse rounded" />
          <div className="h-5 w-64 bg-muted animate-pulse rounded mt-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Welcome Header - Always visible */}
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Hello {user ? `${user.firstName} ${user.lastName}` : "Guest"},
        </h1>
        <p className="text-muted-foreground mt-1">Welcome to Cantech Networks!</p>
      </div>

      {/* KYC Alert - Only show if status is NOT "completed" */}
      {onboardingStatus !== "completed" && (
        <div className="rounded-lg border border-border bg-muted/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Complete your KYC</p>
              <p className="text-sm text-muted-foreground">
                Start your cloud journey by completing your KYC
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleCompleteKYC}
            className="shrink-0"
          >
            Complete KYC
          </Button>
        </div>
      )}
    </div>
  );
}