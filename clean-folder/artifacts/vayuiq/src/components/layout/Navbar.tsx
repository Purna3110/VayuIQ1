import { Link, useLocation } from "wouter";
import { Wind, LogOut, User as UserIcon, Map, LayoutDashboard, Leaf, FileWarning, ClipboardList } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const isCitizen = user.role === "citizen";

  const navItems = isCitizen ? [
    { href: "/hero", label: "3D Globe", icon: Map },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/carbon-tracker", label: "Carbon Tracker", icon: Leaf },
    { href: "/report", label: "Report", icon: FileWarning },
  ] : [
    { href: "/authority", label: "Tasks & Heatmap", icon: ClipboardList },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel-darker border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href={isCitizen ? "/hero" : "/authority"} className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
            <Wind className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            Vayu<span className="text-primary">IQ</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-black/20 p-1 rounded-2xl border border-white/5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer",
              location === item.href 
                ? "bg-white/10 text-white shadow-sm" 
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            )}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <UserIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">{user.name}</span>
              <span className="text-xs text-muted-foreground leading-tight capitalize">{user.role}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-red-500/10 hover:text-red-400">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
