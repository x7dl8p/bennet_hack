"use client";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Upload,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  collapsed?: boolean;
}

export default function Sidebar({
  activeView,
  onViewChange,
  collapsed = false,
}: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "returns", label: "Returns", icon: TrendingUp },
    { id: "risk", label: "Risk Analysis", icon: AlertTriangle },
    { id: "insights", label: "AI Insights", icon: Lightbulb },
    { id: "upload", label: "Upload Data", icon: Upload },
  ];

  return (
    <div className="h-full border-r border-gray-200 dark:border-zinc-800 flex flex-col bg-gray-50 dark:bg-black">
      {/* Reduced vertical padding from py-6 to py-4 */}
      <div className="flex-1 py-4 flex flex-col gap-2">
        <TooltipProvider delayDuration={100}>
          {menuItems.map((item) =>
            collapsed ? (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "justify-start py-2 w-full text-left rounded-none",
                      // Reduced horizontal padding from px-4 to px-2 when collapsed
                      activeView === item.id
                        ? "bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-zinc-900",
                      collapsed && "px-2 justify-center" // Keep px-2 for collapsed
                    )}
                    onClick={() => onViewChange(item.id)}
                  >
                    <item.icon
                      className={cn("h-5 w-5", !collapsed && "mr-2")}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-xs"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  // Reduced horizontal padding from px-4 to px-3 when not collapsed
                  "justify-start px-3 py-2 w-full text-left rounded-none",
                  activeView === item.id
                    ? "bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-zinc-900",
                  collapsed && "px-2 justify-center" // Keep px-2 for collapsed
                )}
                onClick={() => onViewChange(item.id)}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("h-5 w-5", !collapsed && "mr-2")} />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            )
          )}
        </TooltipProvider>
      </div>
      <div
        className={cn(
          // Reduced padding from p-4 to p-3 when not collapsed
          "p-3 border-t border-gray-200 dark:border-zinc-800",
          // Keep p-2 for collapsed
          collapsed && "p-2"
        )}
      >
        <div
          className={cn(
            "flex items-center",
            // Reduced space from space-x-3 to space-x-2 when not collapsed
            collapsed ? "justify-center" : "space-x-2"
          )}
        >
          {collapsed ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* Adjusted size slightly for collapsed view if needed */}
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-xs"
                >
                  Guest User (Free Plan)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            // Adjusted size slightly for consistency if needed
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
              <User className="h-5 w-4" />
            </div>
          )}

          {!collapsed && (
            <>
              <div>
                <p className="text-sm font-medium">Guest User</p>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Free Plan
                </p>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Settings className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
