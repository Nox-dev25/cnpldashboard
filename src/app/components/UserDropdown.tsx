"use client";

import { User, Lock, Shield, LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/app/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserDropdown() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      toast.info("Logging out...");

      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      toast.success("Logged out successfully");

      // Redirect to login page
      setTimeout(() => {
        window.location.href = "/login";
      }, 800);

    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              UD
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-popover border-border z-50"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Umang Detruja</p>
            <p className="text-xs leading-none text-muted-foreground">
              umang.cantech@gmail.com
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Your Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/users")}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>User Management</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/change-password")}
          className="cursor-pointer"
        >
          <Lock className="mr-2 h-4 w-4" />
          <span>Change Password</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/security")}
          className="cursor-pointer"
        >
          <Shield className="mr-2 h-4 w-4" />
          <span>Security Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}