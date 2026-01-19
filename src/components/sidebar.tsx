'use client';

import { cn } from "@/lib/utils";
import { Search, LayoutDashboard, Database, BookOpen, Settings, ListPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/ideas", label: "Ideas", icon: BookOpen },
    { href: "/saved", label: "Saved Collections", icon: ListPlus },
    { href: "/sources", label: "Sources", icon: Database },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-card md:block w-64 h-screen sticky top-0">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <span className="text-xl tracking-tight text-primary">IdeaPulse</span>
                </Link>
            </div>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                                ? "bg-muted text-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
