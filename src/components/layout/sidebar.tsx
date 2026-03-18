"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Map,
  FolderKanban,
  GitBranch,
  RotateCcw,
  PenSquare,
  BarChart3,
  Lightbulb,
  Settings,
  Bot,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/curriculum", label: "Curriculum", icon: Map },
  { href: "/skills", label: "Skill Graph", icon: GitBranch },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/review", label: "Review", icon: RotateCcw },
  { href: "/journal", label: "Journal", icon: PenSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/founder", label: "Founder", icon: Lightbulb },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-800 bg-zinc-950">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-50">RoboLearn</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Robotics Academy</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-800 text-emerald-400"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-800 p-4">
          <div className="text-xs text-zinc-600">
            v0.1.0 — Local-first learning OS
          </div>
        </div>
      </div>
    </aside>
  )
}
