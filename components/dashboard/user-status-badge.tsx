"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Trash2 } from "lucide-react"
import type { AdminUser } from "@/types/auth"

interface UserStatusBadgeProps {
  user: AdminUser
  showIcon?: boolean
}

export function UserStatusBadge({ user, showIcon = false }: UserStatusBadgeProps) {
  if (user.is_deleted) {
    return (
      <Badge variant="destructive" className="flex items-center space-x-1">
        {showIcon && <Trash2 className="h-3 w-3" />}
        <span>Removido</span>
      </Badge>
    )
  }

  if (user.is_blocked) {
    return (
      <Badge variant="destructive" className="flex items-center space-x-1">
        {showIcon && <XCircle className="h-3 w-3" />}
        <span>Bloqueado</span>
      </Badge>
    )
  }

  // Verificar se o usuário está inativo (sem atividade recente)
  const lastActivity = new Date(user.last_activity)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  if (lastActivity < thirtyDaysAgo) {
    return (
      <Badge variant="secondary" className="flex items-center space-x-1">
        {showIcon && <AlertTriangle className="h-3 w-3" />}
        <span>Inativo</span>
      </Badge>
    )
  }

  return (
    <Badge variant="default" className="flex items-center space-x-1">
      {showIcon && <CheckCircle className="h-3 w-3" />}
      <span>Ativo</span>
    </Badge>
  )
}