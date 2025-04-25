"use client";

import { useState, useEffect } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const renderThemeIcon = () => {
    if (!isMounted) {
      return <div className="h-4 w-4" />;
    }
    return theme === "dark" ? (
      <Sun className="h-4 w-4" />
    ) : (
      <Moon className="h-4 w-4" />
    );
  };

  return (
    <header className="flex items-center justify-between py-2 px-4 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 text-gray-800 dark:text-white backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <h1 className="text-xl font-bold tracking-wider">SEER AI</h1>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={toggleTheme}
          disabled={!isMounted}
        >
          {renderThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
        {/* <Button variant="outline" size="sm" className="h-8 hidden md:flex">
          <span className="text-sm">Connect API</span>
        </Button> */}
      </div>
    </header>
  );
}
