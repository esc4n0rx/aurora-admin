"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Users, Ban, Trash2, Shield, RefreshCw } from "lucide-react"
import { api, ApiError } from "@/lib/api"
import { toast } from "sonner"
import type { AdminUser } from "@/types/auth"

interface UserActionsProps {
  selectedUsers: string[]
  onSelectionChange: (userIds: string[]) => void
  users: AdminUser[]
  onUsersUpdate: () => void
}

export function UserActions({ selectedUsers, onSelectionChange, users, onUsersUpdate }: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const selectedCount = selectedUsers.length
  const totalUsers = users.length
  const allSelected = selectedCount === totalUsers && totalUsers > 0
  const someSelected = selectedCount > 0 && selectedCount < totalUsers

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(users.map(user => user.id))
    }
  }

  const getSelectedUsersInfo = () => {
    const selected = users.filter(user => selectedUsers.includes(user.id))
    const activeCount = selected.filter(user => !user.is_blocked && !user.is_deleted).length
    const blockedCount = selected.filter(user => user.is_blocked).length
    const deletedCount = selected.filter(user => user.is_deleted).length

    return { selected, activeCount, blockedCount, deletedCount }
  }

  const handleBulkAction = async (action: 'block' | 'unblock' | 'delete' | 'restore', reason?: string) => {
    if (selectedUsers.length === 0) {
      toast.error("Nenhum usuário selecionado")
      return
    }

    setIsLoading(true)
    let successCount = 0
    let errorCount = 0

    try {
      for (const userId of selectedUsers) {
        try {
          switch (action) {
            case 'block':
              await api.blockUser(userId, { reason: reason || "Ação em massa" })
              break
            case 'unblock':
              await api.unblockUser(userId)
              break
            case 'delete':
              await api.deleteUser(userId)
              break
            case 'restore':
              await api.restoreUser(userId)
              break
          }
          successCount++
        } catch (error) {
          console.error(`Erro ao executar ação ${action} para usuário ${userId}:`, error)
          errorCount++
        }
      }

      if (successCount > 0) {
        const actionLabels = {
          block: 'bloqueados',
          unblock: 'desbloqueados',
          delete: 'removidos',
          restore: 'restaurados'
        }
        toast.success(`${successCount} usuário(s) ${actionLabels[action]} com sucesso!`)
        onUsersUpdate()
        onSelectionChange([])
      }

      if (errorCount > 0) {
        toast.error(`${errorCount} erro(s) ocorreram durante a operação`)
      }

    } catch (error) {
      console.error('Erro na ação em massa:', error)
      toast.error("Erro inesperado na operação em massa")
    } finally {
      setIsLoading(false)
    }
  }

  const { selected, activeCount, blockedCount, deletedCount } = getSelectedUsersInfo()

  if (selectedCount === 0) {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={allSelected}
          ref={(el) => {
            if (el) (el as HTMLInputElement).indeterminate = someSelected
          }}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm text-muted-foreground">
          Selecionar todos ({totalUsers})
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={allSelected}
          ref={(el) => {
            if (el) (el as HTMLInputElement).indeterminate = someSelected
          }}
          onCheckedChange={handleSelectAll}
        />
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span className="font-medium">{selectedCount} selecionado(s)</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {activeCount > 0 && <Badge variant="default">{activeCount} ativo(s)</Badge>}
        {blockedCount > 0 && <Badge variant="destructive">{blockedCount} bloqueado(s)</Badge>}
        {deletedCount > 0 && <Badge variant="secondary">{deletedCount} removido(s)</Badge>}
      </div>

      <div className="flex items-center space-x-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectionChange([])}
          disabled={isLoading}
        >
          Limpar Seleção
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm" disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Users className="mr-2 h-4 w-4" />
              )}
              Ações em Massa
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {activeCount > 0 && (
              <DropdownMenuItem
                onClick={() => handleBulkAction('block')}
                className="text-orange-600"
              >
                <Ban className="mr-2 h-4 w-4" />
                Bloquear ({activeCount})
              </DropdownMenuItem>
            )}

            {blockedCount > 0 && (
              <DropdownMenuItem
                onClick={() => handleBulkAction('unblock')}
                className="text-green-600"
              >
                <Shield className="mr-2 h-4 w-4" />
                Desbloquear ({blockedCount})
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {(activeCount > 0 || blockedCount > 0) && (
              <DropdownMenuItem
                onClick={() => handleBulkAction('delete')}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remover ({activeCount + blockedCount})
              </DropdownMenuItem>
            )}

            {deletedCount > 0 && (
              <DropdownMenuItem
                onClick={() => handleBulkAction('restore')}
                className="text-blue-600"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Restaurar ({deletedCount})
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}