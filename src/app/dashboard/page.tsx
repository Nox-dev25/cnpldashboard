"use client";
import { DashboardLayout } from "@/app/components/dashboard/DashboardLayout";
import { ServiceCard } from "@/app/components/dashboard/ServiceCard";
import { ActivityFeed } from "@/app/components/dashboard/ActivityFeed";
import { QuickActions } from "@/app/components/dashboard/QuickActions";
import { KYCBanner } from "@/app/components/dashboard/KYCBanner";
import { KYCPopup } from "@/app/components/dashboard/KYCPopup";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [onboardingStatus, setOnboardingStatus] = useState<{
    status: string | null;
    uuid: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user onboarding status
    const fetchOnboardingStatus = async () => {
      try {
        const response = await fetch("/api/user/onboarding-status");
        if (response.ok) {
          const data = await response.json();
          setOnboardingStatus(data);
        }
      } catch (error) {
        console.error("Failed to fetch onboarding status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingStatus();
  }, []);

  const services = [
    {
      name: "Shared Hosting",
      status: "active" as const,
      type: "Hosting",
      details: "Premium Plan - 50GB SSD",
      expiryDate: "2024-12-31",
    },
    {
      name: "VPS Server",
      status: "active" as const,
      type: "VPS",
      details: "4 vCPU, 8GB RAM, 160GB SSD",
      expiryDate: "2024-11-15",
    },
    {
      name: "Domain - example.com",
      status: "active" as const,
      type: "Domain",
      details: ".com TLD",
      expiryDate: "2025-03-20",
    },
  ];

  // Check if validation is pending
  const isValidationPending = onboardingStatus?.status !== "completed";

  return (
    <DashboardLayout>
      {!loading && isValidationPending && onboardingStatus?.uuid && (
        <KYCPopup onboardingId={onboardingStatus.uuid} />
      )}
      <div className="space-y-6">
        <KYCBanner userName="" />
        <QuickActions disabled={isValidationPending} />

        <div className="grid lg:grid-cols-1 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Services</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <ActivityFeed
            title="Recent Support Tickets"
            items={[
              { id: "#12345", description: "Email configuration issue", date: "2 hours ago" },
              { id: "#12344", description: "Domain transfer request", date: "1 day ago" },
              { id: "#12343", description: "Billing inquiry", date: "3 days ago" },
            ]}
          />

          <ActivityFeed
            title="Recent Invoices"
            items={[
              { id: "INV-1023", description: "VPS Server Renewal", date: "Nov 15, 2024", amount: "$29.99" },
              { id: "INV-1022", description: "Shared Hosting", date: "Nov 1, 2024", amount: "$12.99" },
              { id: "INV-1021", description: "Domain Registration", date: "Oct 20, 2024", amount: "$14.99" },
            ]}
          />

          <ActivityFeed
            title="Recent Orders"
            items={[
              { id: "ORD-5678", description: "SSL Certificate", date: "Nov 10, 2024" },
              { id: "ORD-5677", description: "Email Hosting", date: "Oct 28, 2024" },
              { id: "ORD-5676", description: "Backup Service", date: "Oct 15, 2024" },
            ]}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
