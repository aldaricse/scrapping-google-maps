"use client"

import { useState } from "react"

interface DialogState {
  isOpen: boolean
  title: string
  message: string
  type?: "info" | "success" | "error" | "warning"
  onConfirm?: () => void
  onCancel?: () => void
}

export function useDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  })

  const showDialog = (config: Omit<DialogState, "isOpen">) => {
    setDialogState({
      ...config,
      isOpen: true,
    })
  }

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }))
  }

  const confirm = (title: string, message: string, onConfirm: () => void) => {
    showDialog({
      title,
      message,
      type: "warning",
      onConfirm: () => {
        onConfirm()
        closeDialog()
      },
    })
  }

  const alert = (title: string, message: string, type: "info" | "success" | "error" = "info") => {
    showDialog({
      title,
      message,
      type,
    })
  }

  return {
    dialogState,
    showDialog,
    closeDialog,
    confirm,
    alert,
  }
}