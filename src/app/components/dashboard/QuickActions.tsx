import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Cloud, Layers, Server, HardDrive, Globe } from "lucide-react";
import { toast } from "sonner";

interface QuickActionsProps {
  disabled?: boolean;
}

export function QuickActions({ disabled = false }: QuickActionsProps) {
  const handleAction = (action: string) => {
    if (disabled) {
      toast.error("Please complete your validation to proceed with orders");
      return;
    }
    toast.info(`${action} activation initiated`);
  };

  const actions = [
    { label: "Cantech Cloud IaaS", icon: Cloud, color: "text-chart-1" },
    { label: "Cantech Cloud PaaS", icon: Layers, color: "text-chart-2" },
    { label: "Dedicated Server", icon: Server, color: "text-chart-3" },
    { label: "Standard VPS", icon: HardDrive, color: "text-chart-4" },
    { label: "Domain Registration", icon: Globe, color: "text-chart-5" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto flex flex-col items-center gap-2 py-4"
              onClick={() => handleAction(action.label)}
              disabled={disabled}
            >
              <action.icon className={`h-6 w-6 ${action.color}`} />
              <span className="text-xs text-center">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}