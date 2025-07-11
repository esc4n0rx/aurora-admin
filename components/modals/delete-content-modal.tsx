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
import { AlertTriangle, Trash2 } from "lucide-react"
import { api, ApiError } from "@/lib/api"
import { toast } from "sonner"
import type { Content } from "@/types/content"

interface DeleteContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: Content | null
  onSuccess?: () => void
}

export function DeleteContentModal({ open, onOpenChange, content, onSuccess }: DeleteContentModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!content) return

    setIsLoading(true)

    try {
      await api.deleteContent(content.id)
      
      toast.success("Conteúdo excluído com sucesso!")
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao excluir conteúdo:', error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro inesperado ao excluir conteúdo")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!content) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Confirmar Exclusão</span>
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O conteúdo será permanentemente removido da plataforma.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center space-x-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="w-12 h-16 bg-secondary rounded flex items-center justify-center overflow-hidden">
              {content.poster ? (
                <img src={content.poster} alt={content.nome} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-center">{content.nome.substring(0, 2)}</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{content.nome}</h4>
              <p className="text-sm text-muted-foreground">
                {content.categoria} • {content.subcategoria}
              </p>
              <p className="text-sm text-muted-foreground">
                {content.view_count.toLocaleString()} visualizações
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isLoading ? "Excluindo..." : "Excluir Conteúdo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}