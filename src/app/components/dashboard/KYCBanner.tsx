import { Shield } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

interface KYCBannerProps {
  userName?: string;
}

export function KYCBanner({ userName = "User" }: KYCBannerProps) {
  const handleCompleteKYC = () => {
    toast.info("KYC validation process will be initiated");
  };

  return (
    <div className="space-y-4">
      {/* Welcome Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Hello {userName},</h1>
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