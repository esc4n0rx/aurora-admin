"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, Edit, Ban, Mail } from "lucide-react"
import { EditUserModal } from "@/components/modals/edit-user-modal"

const users = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    plan: "Premium",
    status: "Ativo",
    joinDate: "2024-01-15",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    plan: "Básico",
    status: "Ativo",
    joinDate: "2024-01-10",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@email.com",
    plan: "Premium",
    status: "Suspenso",
    joinDate: "2024-01-08",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@email.com",
    plan: "Gratuito",
    status: "Ativo",
    joinDate: "2024-01-05",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 5,
    name: "Carlos Ferreira",
    email: "carlos@email.com",
    plan: "Premium",
    status: "Ativo",
    joinDate: "2024-01-03",
    avatar: "/placeholder-user.jpg",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "default"
      case "Suspenso":
        return "destructive"
      case "Inativo":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Premium":
        return "default"
      case "Básico":
        return "secondary"
      case "Gratuito":
        return "outline"
      default:
        return "secondary"
    }
  }

  const handleEditUser = (user: (typeof users)[0]) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
        <p className="text-muted-foreground">Gerencie usuários e suas assinaturas na plataforma</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>{filteredUsers.length} usuários encontrados</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="w-[70px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getPlanColor(user.plan)}>{user.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="mr-2 h-4 w-4" />
                          Suspender
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <EditUserModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} user={selectedUser} />
    </div>
  )
}
