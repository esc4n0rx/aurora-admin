"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Calendar, 
  Activity, 
  Shield, 
  Clock, 
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react"
import { api, ApiError } from "@/lib/api"
import { toast } from "sonner"
import { UserStatusBadge } from "@/components/dashboard/user-status-badge"
import type { AdminUser } from "@/types/auth"

interface UserDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
  onUserUpdate?: (user: AdminUser) => void
}

export function UserDetailsModal({ open, onOpenChange, userId, onUserUpdate }: UserDetailsModalProps) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && userId) {
      loadUserDetails()
    }
  }, [open, userId])

  const loadUserDetails = async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      const response = await api.getAdminUserDetails(userId)
      if (response.success) {
        setUser(response.data)
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do usuário:', error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao carregar detalhes do usuário")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getTimeSince = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Menos de 1 hora atrás'
    if (diffInHours < 24) return `${diffInHours} hora${diffInHours > 1 ? 's' : ''} atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`
    
    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths} mês${diffInMonths > 1 ? 'es' : ''} atrás`
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (!user && !isLoading) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Detalhes do Usuário</span>
          </DialogTitle>
          <DialogDescription>
            Informações completas e histórico de atividades
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Carregando detalhes...</span>
          </div>
        ) : user ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="activity">Atividade</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Header do Usuário */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" alt={user.nome} />
                      <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                        {getUserInitials(user.nome)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold">{user.nome}</h3>
                          <p className="text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <UserStatusBadge user={user} showIcon />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={loadUserDetails}
                            disabled={isLoading}
                          >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{user.profiles_count}</div>
                          <div className="text-sm text-muted-foreground">Perfis</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{user.actions_count.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Ações</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                          </div>
                          <div className="text-sm text-muted-foreground">Dias na plataforma</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {getTimeSince(user.last_activity)}
                          </div>
                          <div className="text-sm text-muted-foreground">Última atividade</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informações Pessoais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Informações Pessoais</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data de Nascimento:</span>
                      <span>{new Date(user.data_nascimento).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cadastro:</span>
                      <span>{formatDate(user.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Última atualização:</span>
                      <span>{formatDate(user.updated_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID do usuário:</span>
                      <code className="text-xs bg-secondary px-2 py-1 rounded">{user.id}</code>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Estatísticas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Perfis criados:</span>
                      <Badge variant="outline">{user.profiles_count}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total de ações:</span>
                      <Badge variant="outline">{user.actions_count.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Média de ações/dia:</span>
                      <Badge variant="outline">
                        {Math.round(user.actions_count / Math.max(1, Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))))}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status da conta:</span>
                      <UserStatusBadge user={user} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Informações de Bloqueio/Remoção */}
              {(user.is_blocked || user.is_deleted) && (
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Informações de {user.is_deleted ? 'Remoção' : 'Bloqueio'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.is_blocked && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Motivo do bloqueio:</span>
                          <span className="text-right max-w-xs">{user.blocked_reason || 'Não informado'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bloqueado em:</span>
                          <span>{user.blocked_at ? formatDate(user.blocked_at) : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bloqueado por:</span>
                          <code className="text-xs">{user.blocked_by || 'N/A'}</code>
                        </div>
                      </>
                    )}
                    
                    {user.is_deleted && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Removido em:</span>
                          <span>{user.deleted_at ? formatDate(user.deleted_at) : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Removido por:</span>
                          <code className="text-xs">{user.deleted_by || 'N/A'}</code>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>Atividade Recente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Última atividade</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(user.last_activity)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{getTimeSince(user.last_activity)}</Badge>
                    </div>

                    <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                     <p>Histórico detalhado de atividades não disponível</p>
                     <p className="text-sm">Apenas a última atividade está sendo registrada</p>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

           <TabsContent value="history" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center space-x-2">
                   <Calendar className="h-4 w-4" />
                   <span>Histórico da Conta</span>
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   <div className="flex items-start space-x-4">
                     <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                     <div className="flex-1">
                       <p className="font-medium">Conta criada</p>
                       <p className="text-sm text-muted-foreground">
                         {formatDate(user.created_at)}
                       </p>
                     </div>
                   </div>

                   {user.updated_at !== user.created_at && (
                     <div className="flex items-start space-x-4">
                       <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                       <div className="flex-1">
                         <p className="font-medium">Última atualização</p>
                         <p className="text-sm text-muted-foreground">
                           {formatDate(user.updated_at)}
                         </p>
                       </div>
                     </div>
                   )}

                   {user.blocked_at && (
                     <div className="flex items-start space-x-4">
                       <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                       <div className="flex-1">
                         <p className="font-medium">Conta bloqueada</p>
                         <p className="text-sm text-muted-foreground">
                           {formatDate(user.blocked_at)}
                         </p>
                         {user.blocked_reason && (
                           <p className="text-sm text-muted-foreground mt-1">
                             Motivo: {user.blocked_reason}
                           </p>
                         )}
                       </div>
                     </div>
                   )}

                   {user.deleted_at && (
                     <div className="flex items-start space-x-4">
                       <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                       <div className="flex-1">
                         <p className="font-medium">Conta removida</p>
                         <p className="text-sm text-muted-foreground">
                           {formatDate(user.deleted_at)}
                         </p>
                       </div>
                     </div>
                   )}

                   <div className="flex items-start space-x-4">
                     <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                     <div className="flex-1">
                       <p className="font-medium">Última atividade</p>
                       <p className="text-sm text-muted-foreground">
                         {formatDate(user.last_activity)}
                       </p>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
         </Tabs>
       ) : null}
     </DialogContent>
   </Dialog>
 )
}