"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Brain,
    Map,
    Cpu,
    ListChecks,
    Bell,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

const navItems = [{
    href: "/",
    label: "数据看板",
    icon: LayoutDashboard
}, {
    href: "/devices",
    label: "设备管理",
    icon: Cpu
}, {
    href: "/maps",
    label: "地图管理",
    icon: Map
}, {
    href: "/tasks",
    label: "任务管理",
    icon: ListChecks
}, {
    href: "/algorithms",
    label: "算法管理",
    icon: Brain
}, {
    href: "/alerts",
    label: "告警管理",
    icon: Bell
}];

export function AppSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <TooltipProvider delayDuration={0}>
            <aside
                className={cn(
                    "flex flex-col border-r bg-slate-900 text-slate-300 transition-all duration-200 h-full",
                    collapsed ? "w-16" : "w-56"
                )}>
                {}
                <div
                    className={cn(
                        "flex items-center h-14 border-b border-slate-700 px-4",
                        collapsed ? "justify-center" : "gap-3"
                    )}>
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shrink-0">LX
                                  </div>
                    {!collapsed && <div className="overflow-hidden">
                        <h1 className="text-sm font-semibold text-white truncate">LXJM</h1>
                        <p className="text-[10px] text-slate-400 truncate">具身智能机器狗巡检平台</p>
                    </div>}
                </div>
                {}
                <nav className="flex-1 py-3 space-y-1 px-2 overflow-y-auto">
                    {navItems.map(item => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                                            isActive ? "bg-blue-600/20 text-blue-400 font-medium" : "hover:bg-slate-800 hover:text-white",
                                            collapsed && "justify-center px-0"
                                        )}>
                                        <Icon
                                            className={cn("h-5 w-5 shrink-0", isActive ? "text-blue-400" : "text-slate-400")} />
                                        {!collapsed && <span className="truncate">{item.label}</span>}
                                    </Link>
                                </TooltipTrigger>
                                {collapsed && <TooltipContent side="right" className="font-normal">
                                    {item.label}
                                </TooltipContent>}
                            </Tooltip>
                        );
                    })}
                </nav>
                {}
                <div className="border-t border-slate-700 p-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>
            </aside>
        </TooltipProvider>
    );
}