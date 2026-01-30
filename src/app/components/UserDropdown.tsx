"use client";

import { useEffect, useState } from "react";
import { CircleUser, Users, Lock, Shield, LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/app/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type User = {
  firstName: string;
  lastName: string;
  email: string;
};

export function UserDropdown() {
  const router = useRouter();
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

  const handleLogout = async () => {
    try {
      toast.info("Logging out...");

      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();

      toast.success("Logged out");

      setTimeout(() => {
        window.location.href = "/login";
      }, 800);
    } catch {
      toast.error("Logout failed");
    }
  };

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {initials.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email ?? ""}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
          <CircleUser className="mr-2 h-4 w-4" />
          Your Profile
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/users")}>
          <Users className="mr-2 h-4 w-4" />
          User Management
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/change-password")}>
          <Lock className="mr-2 h-4 w-4" />
          Change Password
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/security")}>
          <Shield className="mr-2 h-4 w-4" />
          Security Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive cursor-pointer focus:text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}