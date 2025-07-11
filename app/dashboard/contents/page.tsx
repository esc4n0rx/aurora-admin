"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { AddContentModal } from "@/components/modals/add-content-modal"

const contents = [
  {
    id: 1,
    title: "Stranger Things - Temporada 4",
    category: "Série",
    status: "Publicado",
    views: "2.3M",
    duration: "8h 32min",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Avatar: O Caminho da Água",
    category: "Filme",
    status: "Publicado",
    views: "1.8M",
    duration: "3h 12min",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    title: "The Last of Us - Episódio 1",
    category: "Série",
    status: "Rascunho",
    views: "0",
    duration: "58min",
    createdAt: "2024-01-08",
  },
  {
    id: 4,
    title: "Top Gun: Maverick",
    category: "Filme",
    status: "Publicado",
    views: "3.1M",
    duration: "2h 10min",
    createdAt: "2024-01-05",
  },
  {
    id: 5,
    title: "House of the Dragon - S1E10",
    category: "Série",
    status: "Publicado",
    views: "1.2M",
    duration: "1h 8min",
    createdAt: "2024-01-03",
  },
]

export default function ContentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredContents = contents.filter(
    (content) =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Publicado":
        return "default"
      case "Rascunho":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Conteúdos</h2>
          <p className="text-muted-foreground">Gerencie filmes, séries e outros conteúdos da plataforma</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Conteúdo
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Lista de Conteúdos</CardTitle>
          <CardDescription>{filteredContents.length} conteúdos encontrados</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar conteúdos..."
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
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visualizações</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-[70px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell className="font-medium">{content.title}</TableCell>
                  <TableCell>{content.category}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(content.status)}>{content.status}</Badge>
                  </TableCell>
                  <TableCell>{content.views}</TableCell>
                  <TableCell>{content.duration}</TableCell>
                  <TableCell>{new Date(content.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remover
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
      <AddContentModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  )
}
