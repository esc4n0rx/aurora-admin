"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, Shield, Ban } from "lucide-react"
import { api, ApiError } from "@/lib/api"
import { toast } from "sonner"
import type { AdminUser, BlockUserRequest } from "@/types/auth"

interface BlockUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUser | null
  onSuccess?: (updatedUser: AdminUser) => void
}

export function BlockUserModal({ open, onOpenChange, user, onSuccess }: BlockUserModalProps) {
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const commonReasons = [
    "Violação dos termos de uso",
    "Comportamento inadequado",
    "Spam ou conteúdo indevido",
    "Tentativa de fraude",
    "Múltiplas violações das regras",
    "Atividade suspeita",
  ]

  const handleBlock = async () => {
    if (!user || !reason.trim()) {
      toast.error("Por favor, informe o motivo do bloqueio")
      return
    }

    setIsLoading(true)

    try {
      const blockData: BlockUserRequest = {
        reason: reason.trim()
      }

      const response = await api.blockUser(user.id, blockData)
      
      if (response.success) {
        toast.success("Usuário bloqueado com sucesso!")
        onSuccess?.(response.data)
        onOpenChange(false)
        setReason("")
      }
    } catch (error) {
      console.error('Erro ao bloquear usuário:', error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro inesperado ao bloquear usuário")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleReasonSelect = (selectedReason: string) => {
    setReason(selectedReason)
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-destructive">
            <Ban className="h-5 w-5" />
            <span>Bloquear Usuário</span>
          </DialogTitle>
          <DialogDescription>
            Esta ação impedirá o usuário de acessar a plataforma. O bloqueio pode ser revertido posteriormente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do usuário */}
          <div className="flex items-center space-x-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-user.jpg" alt={user.nome} />
              <AvatarFallback className="bg-destructive text-destructive-foreground">
                {getUserInitials(user.nome)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium">{user.nome}</h4>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                {user.profiles_count} perfis • {user.actions_count} ações
              </p>
            </div>
          </div>

          {/* Motivos predefinidos */}
          <div className="space-y-2">
            <Label>Motivos comuns:</Label>
            <div className="grid grid-cols-1 gap-2">
              {commonReasons.map((commonReason) => (
                <Button
                  key={commonReason}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto p-2"
                  onClick={() => handleReasonSelect(commonReason)}
                  type="button"
                >
                  {commonReason}
                </Button>
              ))}
            </div>
          </div>

          {/* Campo de motivo */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo do bloqueio *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo do bloqueio..."
              rows={3}
              required
            />
          </div>

          {/* Aviso */}
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Atenção</p>
              <p className="text-yellow-700">
                O usuário será imediatamente impedido de acessar a plataforma, mas poderá ser desbloqueado posteriormente.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleBlock} 
            disabled={isLoading || !reason.trim()}
            className="bg-destructive hover:bg-destructive/90"
          >
            <Ban className="mr-2 h-4 w-4" />
            {isLoading ? "Bloqueando..." : "Bloquear Usuário"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}