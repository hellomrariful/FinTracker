"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Banknote, 
  CreditCard, 
  Folder, 
  LayoutDashboard, 
  PieChart, 
  Settings, 
  Tags,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Income", href: "/income", icon: Banknote },
  { name: "Expenses", href: "/expenses", icon: CreditCard },
  { name: "Categories", href: "/categories", icon: Folder },
  { name: "Budget", href: "/budget", icon: Tags },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className={cn(
        "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
        collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
      )} onClick={() => setCollapsed(true)} />
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-card shadow-lg transition-transform duration-300 ease-in-out transform md:sticky md:translate-x-0 w-64 md:w-64 lg:w-72",
        collapsed ? "-translate-x-full" : "translate-x-0"
      )}>
        <div className="flex h-16 items-center justify-between px-4 py-4 border-b">
          <Link href="/" className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Finance Tracker</span>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCollapsed(true)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col gap-1 p-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setCollapsed(true)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed bottom-4 left-4 z-40 md:hidden shadow-lg"
        onClick={() => setCollapsed(false)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
}