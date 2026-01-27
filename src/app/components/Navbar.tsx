import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { UserDropdown } from "./UserDropdown";
import { CommandSearch } from "./dashboard/CommandSearch";
import { NotificationDropdown } from "./NotificationDropdown";

export function Navbar() {
  const [commandOpen, setCommandOpen] = useState(false);

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground h-9 px-3 bg-muted/50 border-border hover:bg-muted"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline-flex">Search</span>
              <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <NotificationDropdown />
            <ThemeSwitcher />
            <UserDropdown />
          </div>
        </div>
      </header>

      <CommandSearch open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}