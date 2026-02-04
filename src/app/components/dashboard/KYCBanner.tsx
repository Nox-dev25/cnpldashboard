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
  const [user, setUser] = useState<User | null>(null);

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
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="space-y-4">
      {/* Welcome Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Hello {user ? `${user.firstName} ${user.lastName}` : ""},</h1>
        <p className="text-muted-foreground mt-1">Welcome to Cantech Networks!</p>
      </div>

      {/* KYC Alert */}
      <div className="rounded-lg border border-border bg-muted/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Complete your KYC</p>
            <p className="text-sm text-muted-foreground">Start your cloud journey by completing your KYC</p>
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
    </div>
  );
}