"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)
  let isDark = theme === "dark"

  const handleChangeTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if(!isLoaded)  return null;

  return (
    <Button variant="outline" size="icon" onClick={handleChangeTheme} className="w-9 h-9">
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
