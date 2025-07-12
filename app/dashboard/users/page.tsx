"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Ban, 
  Mail, 
  Eye, 
  Shield, 
  Trash2, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Users
} from "lucide-react"
import { api, ApiError } from "@/lib/api"
import { toast } from "sonner"
import { EditUserModal } from "@/components/modals/edit-user-modal"
import { UserDetailsModal } from "@/components/modals/user-details-modal"
import { BlockUserModal } from "@/components/modals/block-user-modal"
import { DeleteUserModal } from "@/components/modals/delete-user-modal"
import { UserStatusBadge } from "@/components/dashboard/user-status-badge"
import { UserActions } from "@/components/dashboard/user-actions"
import type { AdminUser } from "@/types/auth"

export default function UsersPage() {
  // Estados principais
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  
  // Filtros e busca
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 20

  // Modais
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // Carregar usuários
  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const params = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      }

      const response = await api.getAdminUsers(params)
      
      if (response.success) {
        setUsers(response.data)
        if (response.pagination) {
          setTotalItems(response.pagination.total)
          setTotalPages(Math.ceil(response.pagination.total / itemsPerPage))
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao carregar usuários")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Efeitos
  useEffect(() => {
    loadUsers()
  }, [currentPage, sortBy, sortOrder])

  // Busca com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      loadUsers()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, statusFilter])

  // Handlers das ações
  const handleUserUpdate = (updatedUser?: AdminUser) => {
    loadUsers()
    setSelectedUsers([])
  }

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUserId(user.id)
    setIsDetailsModalOpen(true)
  }

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleBlockUser = (user: AdminUser) => {
    setSelectedUser(user)
    setIsBlockModalOpen(true)
  }

  const handleUnblockUser = async (user: AdminUser) => {
    try {
      const response = await api.unblockUser(user.id)
      if (response.success) {
        toast.success("Usuário desbloqueado com sucesso!")
        loadUsers()
      }
    } catch (error) {
      console.error('Erro ao desbloquear usuário:', error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao desbloquear usuário")
      }
    }
  }

  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleRestoreUser = async (user: AdminUser) => {
    try {
      const response = await api.restoreUser(user.id)
      if (response.success) {
        toast.success("Usuário restaurado com sucesso!")
        loadUsers()
      }
    } catch (error) {
      console.error('Erro ao restaurar usuário:', error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao restaurar usuário")
      }
    }
  }
 
  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setSortBy("created_at")
    setSortOrder("desc")
    setCurrentPage(1)
    setSelectedUsers([])
  }
 
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }
 
  const formatLastActivity = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora'
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d atrás`
    
    return formatDate(dateString)
  }
 
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }
 
  const handleUserSelection = (userId: string, selected: boolean) => {
    if (selected) {
      setSelectedUsers(prev => [...prev, userId])
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    }
  }
 
  const exportUsers = () => {
    // Implementação futura para exportar dados
    toast.info("Funcionalidade de exportação em desenvolvimento")
  }
 
  // Estatísticas dos usuários filtrados
  const activeUsers = users.filter(user => !user.is_blocked && !user.is_deleted).length
  const blockedUsers = users.filter(user => user.is_blocked).length
  const deletedUsers = users.filter(user => user.is_deleted).length
 
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie usuários, permissões e acessos da plataforma
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={loadUsers} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>
 
      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{totalItems}</p>
                <p className="text-xs text-muted-foreground">Total de usuários</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{activeUsers}</p>
                <p className="text-xs text-muted-foreground">Usuários ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{blockedUsers}</p>
                <p className="text-xs text-muted-foreground">Usuários bloqueados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{deletedUsers}</p>
                <p className="text-xs text-muted-foreground">Usuários removidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
 
      {/* Filtros */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros e Busca</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar usuários</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
 
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="blocked">Bloqueados</SelectItem>
                  <SelectItem value="deleted">Removidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
 
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Data de cadastro</SelectItem>
                  <SelectItem value="nome">Nome</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="last_activity">Última atividade</SelectItem>
                </SelectContent>
              </Select>
            </div>
 
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordem</label>
              <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Decrescente</SelectItem>
                  <SelectItem value="asc">Crescente</SelectItem>
                </SelectContent>
              </Select>
            </div>
 
            <div className="space-y-2">
              <label className="text-sm font-medium">Ações</label>
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
 
      {/* Ações em Massa */}
      <UserActions
        selectedUsers={selectedUsers}
        onSelectionChange={setSelectedUsers}
        users={users}
        onUsersUpdate={handleUserUpdate}
      />
 
      {/* Lista de Usuários */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Página {currentPage} de {totalPages} ({totalItems} usuários encontrados)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Carregando usuários...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Nenhum usuário encontrado</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={clearFilters}
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedUsers.length === users.length && users.length > 0}
                        ref={(el) => {
                          if (el) (el as HTMLInputElement).indeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length
                        }}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(users.map(user => user.id))
                          } else {
                            setSelectedUsers([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Perfis</TableHead>
                    <TableHead>Ações</TableHead>
                    <TableHead>Última Atividade</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead className="w-[70px]">Opções</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => 
                            handleUserSelection(user.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder-user.jpg" alt={user.nome} />
                            <AvatarFallback className="text-xs">
                              {getUserInitials(user.nome)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.nome}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <UserStatusBadge user={user} />
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{user.profiles_count}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{user.actions_count.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatLastActivity(user.last_activity)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatDate(user.created_at)}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Enviar Email
                            </DropdownMenuItem>
                            
                            {/* Ações específicas baseadas no status */}
                            {!user.is_deleted && (
                              <>
                                {!user.is_blocked ? (
                                  <DropdownMenuItem 
                                    className="text-orange-600"
                                    onClick={() => handleBlockUser(user)}
                                  >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Bloquear
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    className="text-green-600"
                                    onClick={() => handleUnblockUser(user)}
                                  >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Desbloquear
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remover
                                </DropdownMenuItem>
                              </>
                            )}
                            
                            {user.is_deleted && (
                              <DropdownMenuItem 
                                className="text-blue-600"
                                onClick={() => handleRestoreUser(user)}
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Restaurar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
 
              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a{" "}
                    {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} usuários
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8"
                          >
                            {page}
                          </Button>
                        )
                      })}
                      {totalPages > 5 && (
                        <>
                          <span className="text-muted-foreground">...</span>
                          <Button
                            variant={currentPage === totalPages ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-8 h-8"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
 
      {/* Modais */}
      <UserDetailsModal 
        open={isDetailsModalOpen} 
        onOpenChange={setIsDetailsModalOpen}
        userId={selectedUserId}
        onUserUpdate={handleUserUpdate}
      />
      
      <EditUserModal 
        open={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen}
        user={selectedUser}
      />
      
      <BlockUserModal 
        open={isBlockModalOpen} 
        onOpenChange={setIsBlockModalOpen}
        user={selectedUser}
        onSuccess={handleUserUpdate}
      />
      
      <DeleteUserModal 
        open={isDeleteModalOpen} 
        onOpenChange={setIsDeleteModalOpen}
        user={selectedUser}
        onSuccess={handleUserUpdate}
      />
    </div>
  )
 }