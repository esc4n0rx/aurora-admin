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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, Trash2 } from "lucide-react"
import { api, ApiError } from "@/lib/api"
import { toast } from "sonner"
import type { AdminUser } from "@/types/auth"

interface DeleteUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUser | null
  onSuccess?: (updatedUser: AdminUser) => void
}

export function DeleteUserModal({ open, onOpenChange, user, onSuccess }: DeleteUserModalProps) {
  const [confirmation, setConfirmation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!user) return

    if (confirmation !== user.nome) {
      toast.error("Por favor, digite o nome completo do usuário para confirmar")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.deleteUser(user.id)
      
      if (response.success) {
        toast.success("Usuário removido com sucesso!")
        onSuccess?.(response.data)
        onOpenChange(false)
        setConfirmation("")
      }
    } catch (error) {
      console.error('Erro ao remover usuário:', error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro inesperado ao remover usuário")
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

  const isConfirmationValid = confirmation === user?.nome

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            <span>Remover Usuário</span>
          </DialogTitle>
          <DialogDescription>
            Esta ação removerá o usuário da plataforma. Esta operação pode ser revertida posteriormente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do usuário */}
          <div className="flex items-center space-x-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <Avatar className="h-12 w-12">
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

          {/* Consequências */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">O que acontecerá:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• O usuário não poderá mais acessar a plataforma</li>
              <li>• Todos os perfis serão desativados</li>
              <li>• O histórico será preservado</li>
              <li>• A conta pode ser restaurada posteriormente</li>
            </ul>
          </div>

          {/* Confirmação */}
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Para confirmar, digite o nome completo do usuário: <strong>{user.nome}</strong>
            </Label>
            <Input
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Digite o nome completo..."
              className={!isConfirmationValid && confirmation ? "border-destructive" : ""}
            />
          </div>

          {/* Aviso crítico */}
          <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-800">Ação Crítica</p>
              <p className="text-red-700">
                Esta ação removerá permanentemente o acesso do usuário à plataforma.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false)
              setConfirmation("")
            }} 
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isLoading || !isConfirmationValid}
            className="bg-destructive hover:bg-destructive/90"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isLoading ? "Removendo..." : "Remover Usuário"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}