"use client"
import { BarChart3, TrendingUp, AlertTriangle, Lightbulb, Upload, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  collapsed?: boolean
}

export default function Sidebar({ activeView, onViewChange, collapsed = false }: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "returns", label: "Returns", icon: TrendingUp },
    { id: "risk", label: "Risk Analysis", icon: AlertTriangle },
    { id: "insights", label: "AI Insights", icon: Lightbulb },
    { id: "upload", label: "Upload Data", icon: Upload },
  ]

  return (
    // test tag
    <div className="h-full border-r border-zinc-800 flex flex-col">
      <div className="flex-1 py-6 flex flex-col gap-2">
        {menuItems.map((item) => ( 
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "justify-start px-4 py-2 w-full text-left rounded-none",
              activeView === item.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900",
              collapsed && "px-2 justify-center",
            )}
            onClick={() => onViewChange(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={cn("h-5 w-5", !collapsed && "mr-2")} />
            {!collapsed && <span>{item.label}</span>}
          </Button>
        ))}
      </div>
      <div className={cn("p-4 border-t border-zinc-800", collapsed && "p-2")}>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-3")}>
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          {!collapsed && (
            <>
              <div>
                <p className="text-sm font-medium">Guest User</p>
                <p className="text-xs text-zinc-400">Free Plan</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Settings className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
