"use client"

import { Menu, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface HeaderProps {
  toggleSidebar: () => void
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="flex items-center justify-between p-4 border-b border-zinc-800 dark:border-zinc-800 bg-black dark:bg-black text-white dark:text-white">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <h1 className="text-2xl font-bold tracking-wider">SEER AI</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button variant="outline" size="sm" className="hidden md:flex">
          <span>Connect API</span>
        </Button>
      </div>
    </header>
  )
}
