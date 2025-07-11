"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { AddContentModal } from "@/components/modals/add-content-modal"
import { EditContentModal } from "@/components/modals/edit-content-modal"
import { DeleteContentModal } from "@/components/modals/delete-content-modal"
import { api, ApiError } from "@/lib/api"
import { toast } from "sonner"
import type { Content } from "@/types/content"

export default function ContentsPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  // Modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)

  // Carregar conteúdos
  const loadContents = async () => {
    setIsLoading(true)
    try {
      const params = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== "all" && { categoria: categoryFilter }),
        ...(typeFilter !== "all" && { subcategoria: typeFilter }),
        ...(statusFilter !== "all" && { ativo: statusFilter === "active" ? "true" : "false" }),
      }

      const response = await api.getContents(params)
      
      if (response.success) {
        setContents(response.data)
        if (response.pagination) {
          setTotalItems(response.pagination.total)
          setTotalPages(Math.ceil(response.pagination.total / itemsPerPage))
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao carregar conteúdos")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Efeitos
  useEffect(() => {
    loadContents()
  }, [currentPage, sortBy, sortOrder])

  // Busca com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      loadContents()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, categoryFilter, typeFilter, statusFilter])

  // Funções utilitárias
  const getStatusColor = (status: boolean) => {
    return status ? "default" : "secondary"
  }

  const getStatusLabel = (status: boolean) => {
    return status ? "Ativo" : "Inativo"
  }

  const getCategoryLabel = (categoria: string) => {
    const categories: Record<string, string> = {
      acao: "Ação",
      aventura: "Aventura",
      comedia: "Comédia",
      drama: "Drama",
      terror: "Terror",
      ficcao_cientifica: "Ficção Científica",
      fantasia: "Fantasia",
      romance: "Romance",
      thriller: "Thriller",
      documentario: "Documentário",
      animacao: "Animação",
      crime: "Crime",
      guerra: "Guerra",
      historia: "História",
      musica: "Música",
      misterio: "Mistério",
      familia: "Família",
      biografia: "Biografia",
    }
    return categories[categoria] || categoria
  }

  const getTypeLabel = (tipo: string) => {
    const types: Record<string, string> = {
      filme: "Filme",
      serie: "Série",
      anime: "Anime",
      desenho: "Desenho",
      documentario: "Documentário",
      curta: "Curta",
      minisserie: "Minissérie",
      reality_show: "Reality Show",
      talk_show: "Talk Show",
      esporte: "Esporte",
    }
    return types[tipo] || tipo
  }

  const formatDuration = (duration: number) => {
    if (!duration) return "-"
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
  }

  // Handlers dos modais
  const handleEditContent = (content: Content) => {
    setSelectedContent(content)
    setIsEditModalOpen(true)
  }

  const handleDeleteContent = (content: Content) => {
    setSelectedContent(content)
    setIsDeleteModalOpen(true)
  }

  const handleModalSuccess = () => {
    loadContents()
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setTypeFilter("all")
    setStatusFilter("all")
    setSortBy("created_at")
    setSortOrder("desc")
    setCurrentPage(1)
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

      {/* Filtros */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros e Busca</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar conteúdos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="acao">Ação</SelectItem>
                  <SelectItem value="comedia">Comédia</SelectItem>
                  <SelectItem value="drama">Drama</SelectItem>
                  <SelectItem value="terror">Terror</SelectItem>
                  <SelectItem value="ficcao_cientifica">Ficção Científica</SelectItem>
                  <SelectItem value="documentario">Documentário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="filme">Filme</SelectItem>
                  <SelectItem value="serie">Série</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="documentario">Documentário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
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
                 <SelectItem value="created_at">Data de criação</SelectItem>
                 <SelectItem value="nome">Nome</SelectItem>
                 <SelectItem value="rating">Avaliação</SelectItem>
                 <SelectItem value="total_visualizations">Visualizações</SelectItem>
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
         </div>

         <div className="flex justify-between items-center mt-4">
           <Button variant="outline" onClick={clearFilters}>
             Limpar Filtros
           </Button>
           <div className="text-sm text-muted-foreground">
             {totalItems} conteúdo{totalItems !== 1 ? "s" : ""} encontrado{totalItems !== 1 ? "s" : ""}
           </div>
         </div>
       </CardContent>
     </Card>

     {/* Lista de Conteúdos */}
     <Card className="border-border/50">
       <CardHeader>
         <CardTitle>Lista de Conteúdos</CardTitle>
         <CardDescription>
           Página {currentPage} de {totalPages} ({totalItems} resultados)
         </CardDescription>
       </CardHeader>
       <CardContent>
         {isLoading ? (
           <div className="flex items-center justify-center py-8">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             <span className="ml-3 text-muted-foreground">Carregando conteúdos...</span>
           </div>
         ) : contents.length === 0 ? (
           <div className="text-center py-8">
             <p className="text-muted-foreground">Nenhum conteúdo encontrado</p>
             <Button 
               className="mt-4" 
               onClick={() => setIsAddModalOpen(true)}
             >
               <Plus className="mr-2 h-4 w-4" />
               Adicionar Primeiro Conteúdo
             </Button>
           </div>
         ) : (
           <>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Conteúdo</TableHead>
                   <TableHead>Categoria</TableHead>
                   <TableHead>Tipo</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Avaliação</TableHead>
                   <TableHead>Visualizações</TableHead>
                   <TableHead>Duração</TableHead>
                   <TableHead>Data</TableHead>
                   <TableHead className="w-[70px]">Ações</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {contents.map((content) => (
                   <TableRow key={content.id}>
                     <TableCell>
                       <div className="flex items-center space-x-3">
                         <div className="w-12 h-16 bg-secondary rounded flex items-center justify-center overflow-hidden">
                           {content.poster ? (
                             <img 
                               src={content.poster} 
                               alt={content.nome} 
                               className="w-full h-full object-cover"
                               onError={(e) => {
                                 const target = e.target as HTMLImageElement
                                 target.style.display = 'none'
                               }}
                             />
                           ) : (
                             <span className="text-xs text-center">{content.nome.substring(0, 2)}</span>
                           )}
                         </div>
                         <div>
                           <div className="font-medium">{content.nome}</div>
                           <div className="text-sm text-muted-foreground">
                             {content.metadata.ano_lancamento && `${content.metadata.ano_lancamento} • `}
                             {content.metadata.diretor}
                           </div>
                         </div>
                       </div>
                     </TableCell>
                     <TableCell>
                       <Badge variant="outline">{getCategoryLabel(content.categoria)}</Badge>
                     </TableCell>
                     <TableCell>
                       <Badge variant="secondary">{getTypeLabel(content.subcategoria)}</Badge>
                     </TableCell>
                     <TableCell>
                       <Badge variant={getStatusColor(content.ativo)}>
                         {getStatusLabel(content.ativo)}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       <div className="flex items-center space-x-1">
                         <span className="text-yellow-500">★</span>
                         <span>{content.rating.toFixed(1)}</span>
                       </div>
                     </TableCell>
                     <TableCell>
                       {content.total_visualizations.toLocaleString()}
                     </TableCell>
                     <TableCell>
                       {formatDuration(content.metadata.duracao || 0)}
                     </TableCell>
                     <TableCell>
                       {new Date(content.created_at).toLocaleDateString("pt-BR")}
                     </TableCell>
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
                           <DropdownMenuItem onClick={() => handleEditContent(content)}>
                             <Edit className="mr-2 h-4 w-4" />
                             Editar
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                             className="text-destructive"
                             onClick={() => handleDeleteContent(content)}
                           >
                             <Trash2 className="mr-2 h-4 w-4" />
                             Excluir
                           </DropdownMenuItem>
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
                   {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
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
     <AddContentModal 
       open={isAddModalOpen} 
       onOpenChange={setIsAddModalOpen}
       onSuccess={handleModalSuccess}
     />
     
     <EditContentModal 
       open={isEditModalOpen} 
       onOpenChange={setIsEditModalOpen}
       content={selectedContent}
       onSuccess={handleModalSuccess}
     />
     
     <DeleteContentModal 
       open={isDeleteModalOpen} 
       onOpenChange={setIsDeleteModalOpen}
       content={selectedContent}
       onSuccess={handleModalSuccess}
     />
   </div>
 )
}