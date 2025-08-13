"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react"

interface ReusableDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: "info" | "success" | "error" | "warning"
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
}

export function ReusableDialog({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  onConfirm,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
}: ReusableDialogProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <X className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {onConfirm ? (
            <>
              <Button variant="outline" onClick={onClose}>
                {cancelText}
              </Button>
              <Button
                variant={type === "error" || type === "warning" ? "destructive" : "default"}
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
              >
                {confirmText}
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>{confirmText}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
