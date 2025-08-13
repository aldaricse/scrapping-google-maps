"use client"

import type React from "react"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
}: CustomModalProps) {
  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-md"
      case "md":
        return "max-w-2xl"
      case "lg":
        return "max-w-4xl"
      case "xl":
        return "max-w-6xl"
      case "full":
        return "max-w-[95vw] max-h-[95vh]"
      default:
        return "max-w-2xl"
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleOverlayClick} />

      {/* Modal */}
      <div
        className={`
          relative bg-white dark:bg-gray-800 rounded-lg shadow-xl
          w-full mx-4 max-h-[90vh] overflow-hidden
          animate-in fade-in-0 zoom-in-95 duration-200
          ${getSizeClasses()}
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            {title && <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>}
            {showCloseButton && (
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">{children}</div>
      </div>
    </div>
  )
}
