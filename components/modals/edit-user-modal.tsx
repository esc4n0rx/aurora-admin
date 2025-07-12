"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Shield, CreditCard, Activity, Calendar, Mail, AlertTriangle, User, Ban, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { UserStatusBadge } from "@/components/dashboard/user-status-badge"
import { api, ApiError } from "@/lib/api"
import type { AdminUser } from "@/types/auth"

interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUser | null
}

export function EditUserModal({ open, onOpenChange, user }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    data_nascimento: "",
    notes: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        data_nascimento: user.data_nascimento,
        notes: "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implementação futura para atualizar dados do usuário
    // Por enquanto, apenas simula o salvamento
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Informações do usuário atualizadas!")
      onOpenChange(false)
    }, 1500)
  }

  const handleBlockUser = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      await api.blockUser(user.id, { reason: "Bloqueado via modal de edição" })
      toast.success("Usuário bloqueado com sucesso!")
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao bloquear usuário:', error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao bloquear usuário")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnblockUser = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      await api.unblockUser(user.id)
      toast.success("Usuário desbloqueado com sucesso!")
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao desbloquear usuário:', error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao desbloquear usuário")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestoreUser = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      await api.restoreUser(user.id)
      toast.success("Usuário restaurado com sucesso!")
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao restaurar usuário:', error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao restaurar usuário")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Editar Usuário</span>
          </DialogTitle>
          <DialogDescription>Gerencie informações, permissões e configurações do usuário</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Informações Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder-user.jpg" alt={user.nome} />
                    <AvatarFallback className="text-lg">
                      {getUserInitials(user.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{user.nome}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <UserStatusBadge user={user} showIcon />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                    <Input
                      id="data_nascimento"
                      type="date"
                      value={formData.data_nascimento}
                      onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ID do Usuário</Label>
                    <code className="text-sm bg-secondary px-2 py-1 rounded block">{user.id}</code>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações Internas</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notas internas sobre o usuário..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Detalhes da Conta</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Data de Cadastro</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(user.created_at)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Última Atividade</Label>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(user.last_activity)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Perfis Criados</Label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.profiles_count}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Total de Ações</Label>
                    <Badge variant="outline">{user.actions_count.toLocaleString()}</Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Status da Conta</Label>
                    <UserStatusBadge user={user} />
                  </div>
                </div>

                {/* Ações de administração */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {!user.is_deleted && (
                    <>
                      {!user.is_blocked ? (
                        <Button 
                          variant="destructive" 
                          onClick={handleBlockUser}
                          disabled={isLoading}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Bloquear Usuário
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          onClick={handleUnblockUser}
                          disabled={isLoading}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Desbloquear Usuário
                        </Button>
                      )}
                    </>
                  )}
                  
                  {user.is_deleted && (
                    <Button 
                      variant="default" 
                      onClick={handleRestoreUser}
                      disabled={isLoading}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Restaurar Usuário
                    </Button>
                  )}
                  
                  <Button variant="outline" disabled={isLoading}>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
          <Card>
             <CardHeader>
               <CardTitle className="flex items-center space-x-2">
                 <Shield className="h-4 w-4" />
                 <span>Permissões e Controles</span>
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label>Conta Ativa</Label>
                     <p className="text-sm text-muted-foreground">Usuário pode acessar a plataforma</p>
                   </div>
                   <Switch
                     checked={!user.is_blocked && !user.is_deleted}
                     disabled={true}
                   />
                 </div>

                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label>Pode Assistir Conteúdo</Label>
                     <p className="text-sm text-muted-foreground">Permissão para streaming de vídeos</p>
                   </div>
                   <Switch
                     checked={!user.is_blocked && !user.is_deleted}
                     disabled={true}
                   />
                 </div>

                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label>Pode Fazer Download</Label>
                     <p className="text-sm text-muted-foreground">Permissão para download offline</p>
                   </div>
                   <Switch
                     checked={false}
                     disabled={true}
                   />
                 </div>

                 <div className="space-y-2">
                   <Label>Máximo de Perfis</Label>
                   <Select value="5" disabled>
                     <SelectTrigger className="w-32">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="1">1 perfil</SelectItem>
                       <SelectItem value="2">2 perfis</SelectItem>
                       <SelectItem value="3">3 perfis</SelectItem>
                       <SelectItem value="4">4 perfis</SelectItem>
                       <SelectItem value="5">5 perfis</SelectItem>
                       <SelectItem value="unlimited">Ilimitado</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>

                 <div className="text-sm text-muted-foreground">
                   <p>Atualmente: {user.profiles_count} perfis criados</p>
                 </div>
               </div>
             </CardContent>
           </Card>

           {/* Informações de Bloqueio/Remoção */}
           {(user.is_blocked || user.is_deleted) && (
             <Card className="border-destructive/50">
               <CardHeader>
                 <CardTitle className="flex items-center space-x-2 text-destructive">
                   <AlertTriangle className="h-4 w-4" />
                   <span>Restrições da Conta</span>
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 {user.is_blocked && (
                   <div className="space-y-2">
                     <h4 className="font-medium text-destructive">Conta Bloqueada</h4>
                     <div className="text-sm space-y-1">
                       <p><strong>Motivo:</strong> {user.blocked_reason || 'Não informado'}</p>
                       <p><strong>Bloqueado em:</strong> {user.blocked_at ? formatDate(user.blocked_at) : 'N/A'}</p>
                       <p><strong>Bloqueado por:</strong> {user.blocked_by || 'N/A'}</p>
                     </div>
                   </div>
                 )}
                 
                 {user.is_deleted && (
                   <div className="space-y-2">
                     <h4 className="font-medium text-destructive">Conta Removida</h4>
                     <div className="text-sm space-y-1">
                       <p><strong>Removido em:</strong> {user.deleted_at ? formatDate(user.deleted_at) : 'N/A'}</p>
                       <p><strong>Removido por:</strong> {user.deleted_by || 'N/A'}</p>
                     </div>
                   </div>
                 )}
               </CardContent>
             </Card>
           )}
         </TabsContent>

         <TabsContent value="activity" className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center space-x-2">
                 <Activity className="h-4 w-4" />
                 <span>Histórico de Atividades</span>
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="text-center p-4 bg-secondary/30 rounded-lg">
                     <div className="text-2xl font-bold">{user.actions_count.toLocaleString()}</div>
                     <div className="text-sm text-muted-foreground">Total de Ações</div>
                   </div>
                   <div className="text-center p-4 bg-secondary/30 rounded-lg">
                     <div className="text-2xl font-bold">{user.profiles_count}</div>
                     <div className="text-sm text-muted-foreground">Perfis Criados</div>
                   </div>
                   <div className="text-center p-4 bg-secondary/30 rounded-lg">
                     <div className="text-2xl font-bold">
                       {Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                     </div>
                     <div className="text-sm text-muted-foreground">Dias na Plataforma</div>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <h4 className="font-medium">Atividades Recentes</h4>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                       <div className="space-y-1">
                         <p className="font-medium">Última atividade registrada</p>
                         <p className="text-sm text-muted-foreground">Login na plataforma</p>
                       </div>
                       <span className="text-sm text-muted-foreground">{formatDate(user.last_activity)}</span>
                     </div>
                     
                     <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                       <div className="space-y-1">
                         <p className="font-medium">Conta criada</p>
                         <p className="text-sm text-muted-foreground">Registro inicial na plataforma</p>
                       </div>
                       <span className="text-sm text-muted-foreground">{formatDate(user.created_at)}</span>
                     </div>

                     {user.updated_at !== user.created_at && (
                       <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                         <div className="space-y-1">
                           <p className="font-medium">Perfil atualizado</p>
                           <p className="text-sm text-muted-foreground">Última modificação dos dados</p>
                         </div>
                         <span className="text-sm text-muted-foreground">{formatDate(user.updated_at)}</span>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             </CardContent>
           </Card>
         </TabsContent>
       </Tabs>

       <DialogFooter>
         <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
           Cancelar
         </Button>
         <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary/90">
           {isLoading ? "Salvando..." : "Salvar Alterações"}
         </Button>
       </DialogFooter>
     </DialogContent>
   </Dialog>
 )
}