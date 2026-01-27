"use client";
import { useState } from "react";
import { Home, Server, CreditCard, MessageSquare, Settings, LogOut, PanelLeftClose, PanelLeft, ChevronRight } from "lucide-react";
import { NavLink } from "@/app/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/app/components/ui/sidebar";
import { Button } from "@/app/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SidebarMode = "full" | "icons" | "hover";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "My Services", url: "/services", icon: Server },
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Support", url: "/support", icon: MessageSquare },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [mode, setMode] = useState<SidebarMode>("full");
  const [isHovered, setIsHovered] = useState(false);

  const handleModeToggle = () => {
    if (mode === "full") {
      setMode("icons");
    } else if (mode === "icons") {
      setMode("hover");
    } else {
      setMode("full");
    }
  };

  const isCollapsed = mode === "icons" || (mode === "hover" && !isHovered);
  const showLabels = mode === "full" || (mode === "hover" && isHovered);

  const getModeIcon = () => {
    switch (mode) {
      case "full":
        return <PanelLeftClose className="h-4 w-4" />;
      case "icons":
        return <PanelLeft className="h-4 w-4" />;
      case "hover":
        return <ChevronRight className="h-4 w-4" />;
    }
  };

  const getModeTooltip = () => {
    switch (mode) {
      case "full":
        return "Click: Icons only";
      case "icons":
        return "Click: Hover to expand";
      case "hover":
        return "Click: Full sidebar";
    }
  };

  return (
    <Sidebar 
      className={cn(
        "border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
      onMouseEnter={() => mode === "hover" && setIsHovered(true)}
      onMouseLeave={() => mode === "hover" && setIsHovered(false)}
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm">CN</span>
            </div>
            {showLabels && (
              <span className="font-semibold text-sidebar-foreground whitespace-nowrap animate-fade-in">
                Cantech Networks
              </span>
            )}
          </div>
          {showLabels && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleModeToggle}
                  className="h-8 w-8 shrink-0 hover:bg-sidebar-accent"
                >
                  {getModeIcon()}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-popover text-popover-foreground">
                {getModeTooltip()}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {isCollapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleModeToggle}
                className="h-8 w-8 mt-2 mx-auto hover:bg-sidebar-accent"
              >
                {getModeIcon()}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-popover text-popover-foreground">
              {getModeTooltip()}
            </TooltipContent>
          </Tooltip>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {showLabels && (
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider mb-2">
              Main Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          href={item.url} 
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                            "hover:bg-sidebar-accent group",
                            isCollapsed && "justify-center px-2"
                          )}
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                        >
                          <item.icon className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                          {showLabels && (
                            <span className="whitespace-nowrap">{item.title}</span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="bg-popover text-popover-foreground">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton asChild>
                  <button 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-left",
                      "hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground group",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    <LogOut className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                    {showLabels && <span className="whitespace-nowrap">Sign Out</span>}
                  </button>
                </SidebarMenuButton>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-popover text-popover-foreground">
                  Sign Out
                </TooltipContent>
              )}
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}