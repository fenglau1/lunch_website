"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/",
            color: "text-sky-500",
        },
        {
            label: "Menu",
            icon: UtensilsCrossed,
            href: "/menu",
            color: "text-violet-500",
        },
        {
            label: "My Orders",
            icon: ClipboardList,
            href: "/orders",
            color: "text-pink-700",
        },
    ];

    const adminRoutes = [
        {
            label: "Manage Menu",
            icon: UtensilsCrossed,
            href: "/admin/menu",
            color: "text-orange-700",
        },
        {
            label: "Manage Orders",
            icon: ClipboardList,
            href: "/admin/orders",
            color: "text-emerald-500",
        },
    ];

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold">Lunchie</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}

                    {user?.role === 'admin' && (
                        <>
                            <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase">
                                Admin
                            </div>
                            {adminRoutes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={cn(
                                        "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                        pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                                    )}
                                >
                                    <div className="flex items-center flex-1">
                                        <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                        {route.label}
                                    </div>
                                </Link>
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className="px-3 py-2">
                <button
                    onClick={logout}
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400"
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 text-red-500" />
                        Logout
                    </div>
                </button>
            </div>
        </div>
    );
}
