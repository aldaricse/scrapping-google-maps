"use client"

import { useState, type ReactNode } from "react"

interface ModalConfig {
  title?: string
  content: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
  onClose?: () => void
}

export function useCustomModal() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    config: ModalConfig
  }>({
    isOpen: false,
    config: {
      content: null,
      size: "md",
      showCloseButton: true,
      closeOnOverlayClick: true,
    },
  })

  const openModal = (config: ModalConfig) => {
    setModalState({
      isOpen: true,
      config: {
        size: "md",
        showCloseButton: true,
        closeOnOverlayClick: true,
        ...config,
      },
    })
  }

  const closeModal = () => {
    if (modalState.config.onClose) {
      modalState.config.onClose()
    }
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  return {
    isOpen: modalState.isOpen,
    config: modalState.config,
    openModal,
    closeModal,
  }
}
