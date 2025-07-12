// components/modals/add-content-modal.tsx
"use client"

import type React from "react"

import { useState, useCallback } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchInput } from "@/components/ui/search-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Plus, Film, Tv, Search, Download, Star } from "lucide-react"
import { api, ApiError } from "@/lib/api"
import { toast } from "sonner"
import type { CreateContentRequest } from "@/types/content"
import type { TMDBSearchResult, TMDBMovieDetails, TMDBTVDetails } from "@/types/tmdb"

interface AddContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddContentModal({ open, onOpenChange, onSuccess }: AddContentModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    url_transmissao: "",
    poster: "",
    categoria: "",
    subcategoria: "",
    ativo: true,
    rating: 0,
    qualidades: [] as string[],
    metadata: {
      descricao: "",
      duracao: 0,
      ano_lancamento: 0,
      diretor: "",
      elenco: "",
      idade_recomendada: "",
      idioma: "português",
      legendas: [] as string[],
      trailer_url: "",
    },
  })

  const [newQualidade, setNewQualidade] = useState("")
  const [newLegenda, setNewLegenda] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Estados para TMDB
  const [tmdbResults, setTmdbResults] = useState<TMDBSearchResult[]>([])
  const [tmdbLoading, setTmdbLoading] = useState(false)
  const [selectedTmdbItem, setSelectedTmdbItem] = useState<TMDBSearchResult | null>(null)
  const [importingFromTmdb, setImportingFromTmdb] = useState(false)
  const [tmdbSearchType, setTmdbSearchType] = useState<'multi' | 'movie' | 'tv'>('multi')
  const [showTmdbSearch, setShowTmdbSearch] = useState(true)
  const [activeTab, setActiveTab] = useState<'tmdb' | 'manual'>('tmdb')

  // Buscar no TMDB
  const handleTmdbSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setTmdbResults([])
      return
    }

    setTmdbLoading(true)
    try {
      const response = await api.searchTMDB(query, tmdbSearchType)
      if (response.success) {
        setTmdbResults(response.data.results)
      }
    } catch (error) {
      console.error('Erro na busca TMDB:', error)
      toast.error("Erro ao buscar no TMDB")
    } finally {
      setTmdbLoading(false)
    }
  }, [tmdbSearchType])

  // Limpar busca TMDB
  const handleTmdbClear = useCallback(() => {
    setTmdbResults([])
    setSelectedTmdbItem(null)
  }, [])

  // Mapeamento de gêneros TMDB para categorias locais
  const mapTmdbGenreToCategory = (genreIds: number[]): string => {
    const genreMap: Record<number, string> = {
      28: 'acao', // Action
      12: 'aventura', // Adventure
      16: 'animacao', // Animation
      35: 'comedia', // Comedy
      80: 'crime', // Crime
      99: 'documentario', // Documentary
      18: 'drama', // Drama
      10751: 'familia', // Family
      14: 'fantasia', // Fantasy
      36: 'historia', // History
      27: 'terror', // Horror
      10402: 'musica', // Music
      9648: 'misterio', // Mystery
      10749: 'romance', // Romance
      878: 'ficcao_cientifica', // Science Fiction
      10770: 'documentario', // TV Movie
      53: 'thriller', // Thriller
      10752: 'guerra', // War
      37: 'aventura', // Western
      // TV Genres
      10759: 'acao', // Action & Adventure
      10762: 'familia', // Kids
      10763: 'documentario', // News
      10764: 'documentario', // Reality
      10765: 'ficcao_cientifica', // Sci-Fi & Fantasy
      10766: 'drama', // Soap
      10767: 'documentario', // Talk
      10768: 'guerra', // War & Politics
    }

    for (const genreId of genreIds) {
      if (genreMap[genreId]) {
        return genreMap[genreId]
      }
    }
    
    return 'drama' // fallback
  }

  // Importar dados do TMDB
  const handleImportFromTmdb = useCallback(async (tmdbItem: TMDBSearchResult) => {
    setImportingFromTmdb(true)
    setSelectedTmdbItem(tmdbItem)
    
    try {
      const mediaType = tmdbItem.media_type || (tmdbItem.title ? 'movie' : 'tv')
      const response = await api.getTMDBDetails(tmdbItem.id, mediaType)
      
      if (response.success) {
        const details = response.data as TMDBMovieDetails | TMDBTVDetails
        
        // Mapear dados básicos
        const isMovie = 'title' in details
        const nome = isMovie ? details.title : (details as TMDBTVDetails).name
        const releaseDate = isMovie ? details.release_date : (details as TMDBTVDetails).first_air_date
        const duracao = isMovie ? details.runtime : (details as TMDBTVDetails).episode_run_time[0] || 0
        
        // Mapear categoria baseada nos gêneros
        const categoria = details.genres.length > 0 
          ? mapTmdbGenreToCategory(details.genres.map(g => g.id)) 
          : 'drama'
        
        // Mapear subcategoria
        const subcategoria = isMovie ? 'filme' : 'serie'
        
        // URL do poster
        const posterUrl = details.poster_path 
          ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
          : ""
        
        // Elenco
        const elenco = details.cast ? details.cast.join(", ") : ""
        
        // Idioma original para legendas
        const legendas = details.original_language === 'pt' 
          ? ['português'] 
          : ['português', 'inglês']

        setFormData({
          ...formData,
          nome,
          poster: posterUrl,
          categoria,
          subcategoria,
          rating: details.vote_average,
          qualidades: ['1080p', '720p'], // Padrão
          metadata: {
            ...formData.metadata,
            descricao: details.overview,
            duracao,
            ano_lancamento: releaseDate ? new Date(releaseDate).getFullYear() : 0,
            diretor: details.director || (isMovie ? "" : (details as TMDBTVDetails).created_by[0]?.name || ""),
            elenco,
            idioma: details.original_language === 'pt' ? 'português' : 'inglês',
            legendas,
          },
        })
        
        setShowTmdbSearch(false)
        setActiveTab('manual')
        toast.success(`Dados importados do TMDB: ${nome}`)
      }
    } catch (error) {
      console.error('Erro ao importar do TMDB:', error)
      toast.error("Erro ao importar dados do TMDB")
    } finally {
      setImportingFromTmdb(false)
    }
  }, [formData, mapTmdbGenreToCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const createData: CreateContentRequest = {
        nome: formData.nome,
        url_transmissao: formData.url_transmissao,
        poster: formData.poster,
        categoria: formData.categoria,
        subcategoria: formData.subcategoria,
        ativo: formData.ativo,
        rating: formData.rating,
        qualidades: formData.qualidades,
        metadata: {
          ...formData.metadata,
          elenco: formData.metadata.elenco ? formData.metadata.elenco.split(",").map(item => item.trim()) : [],
        },
      }

      await api.createContent(createData)
      
      toast.success("Conteúdo criado com sucesso!")
      onOpenChange(false)
      onSuccess?.()
      
      // Reset form
      setFormData({
        nome: "",
        url_transmissao: "",
        poster: "",
       categoria: "",
       subcategoria: "",
       ativo: true,
       rating: 0,
       qualidades: [],
       metadata: {
         descricao: "",
         duracao: 0,
         ano_lancamento: 0,
         diretor: "",
         elenco: "",
         idade_recomendada: "",
         idioma: "português",
         legendas: [],
         trailer_url: "",
       },
     })
     setTmdbResults([])
     setSelectedTmdbItem(null)
     setShowTmdbSearch(true)
     setActiveTab('tmdb')
   } catch (error) {
     console.error('Erro ao criar conteúdo:', error)
     if (error instanceof ApiError) {
       toast.error(error.message)
     } else {
       toast.error("Erro inesperado ao criar conteúdo")
     }
   } finally {
     setIsLoading(false)
   }
 }

 const addQualidade = () => {
   if (newQualidade.trim() && !formData.qualidades.includes(newQualidade.trim())) {
     setFormData({ ...formData, qualidades: [...formData.qualidades, newQualidade.trim()] })
     setNewQualidade("")
   }
 }

 const removeQualidade = (qualidadeToRemove: string) => {
   setFormData({ ...formData, qualidades: formData.qualidades.filter((q) => q !== qualidadeToRemove) })
 }

 const addLegenda = () => {
   if (newLegenda.trim() && !formData.metadata.legendas.includes(newLegenda.trim())) {
     setFormData({ 
       ...formData, 
       metadata: { 
         ...formData.metadata, 
         legendas: [...formData.metadata.legendas, newLegenda.trim()] 
       } 
     })
     setNewLegenda("")
   }
 }

 const removeLegenda = (legendaToRemove: string) => {
   setFormData({ 
     ...formData, 
     metadata: { 
       ...formData.metadata, 
       legendas: formData.metadata.legendas.filter((l) => l !== legendaToRemove) 
     } 
   })
 }

 const resetForm = () => {
   setFormData({
     nome: "",
     url_transmissao: "",
     poster: "",
     categoria: "",
     subcategoria: "",
     ativo: true,
     rating: 0,
     qualidades: [],
     metadata: {
       descricao: "",
       duracao: 0,
       ano_lancamento: 0,
       diretor: "",
       elenco: "",
       idade_recomendada: "",
       idioma: "português",
       legendas: [],
       trailer_url: "",
     },
   })
   setTmdbResults([])
   setSelectedTmdbItem(null)
   setShowTmdbSearch(true)
   setActiveTab('tmdb')
 }

 const getTmdbImageUrl = (path: string | null) => {
   return path ? `https://image.tmdb.org/t/p/w300${path}` : null
 }

 const formatTmdbTitle = (item: TMDBSearchResult) => {
   return item.title || item.name || 'Título não disponível'
 }

 const formatTmdbDate = (item: TMDBSearchResult) => {
   const date = item.release_date || item.first_air_date
   return date ? new Date(date).getFullYear() : ''
 }

 const formatTmdbType = (item: TMDBSearchResult) => {
   if (item.media_type === 'movie') return 'Filme'
   if (item.media_type === 'tv') return 'Série'
   return item.title ? 'Filme' : 'Série'
 }

 return (
   <Dialog open={open} onOpenChange={onOpenChange}>
     <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
       <DialogHeader>
         <DialogTitle className="flex items-center space-x-2">
           <Film className="h-5 w-5" />
           <span>Adicionar Novo Conteúdo</span>
         </DialogTitle>
         <DialogDescription>
           {showTmdbSearch 
             ? "Busque no TMDB para importar dados automaticamente ou preencha manualmente"
             : "Preencha as informações do novo filme ou série para adicionar à plataforma"
           }
         </DialogDescription>
       </DialogHeader>

       <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'tmdb' | 'manual')} className="w-full">
         <TabsList className="grid w-full grid-cols-2">
           <TabsTrigger value="tmdb" className="flex items-center space-x-2">
             <Search className="h-4 w-4" />
             <span>Buscar TMDB</span>
           </TabsTrigger>
           <TabsTrigger value="manual" className="flex items-center space-x-2">
             <Upload className="h-4 w-4" />
             <span>Manual</span>
           </TabsTrigger>
         </TabsList>

         <TabsContent value="tmdb" className="space-y-4">
           {/* Busca TMDB */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center space-x-2">
                 <Search className="h-5 w-5" />
                 <span>Buscar no TMDB</span>
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex space-x-4">
                 <div className="flex-1">
                   <SearchInput
                     placeholder="Digite o nome do filme ou série..."
                     onSearch={handleTmdbSearch}
                     onClear={handleTmdbClear}
                     debounceMs={500}
                   />
                 </div>
                 <Select value={tmdbSearchType} onValueChange={(value: 'multi' | 'movie' | 'tv') => setTmdbSearchType(value)}>
                   <SelectTrigger className="w-[150px]">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="multi">Todos</SelectItem>
                     <SelectItem value="movie">Filmes</SelectItem>
                     <SelectItem value="tv">Séries</SelectItem>
                   </SelectContent>
                 </Select>
               </div>

               {tmdbLoading && (
                 <div className="flex items-center justify-center py-8">
                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                   <span className="ml-3 text-muted-foreground">Buscando no TMDB...</span>
                 </div>
               )}

               {tmdbResults.length > 0 && (
                 <div className="grid gap-4 max-h-96 overflow-y-auto">
                   {tmdbResults.map((item) => (
                     <Card 
                       key={item.id} 
                       className={`cursor-pointer transition-colors hover:border-primary ${
                         selectedTmdbItem?.id === item.id ? 'border-primary bg-primary/5' : ''
                       }`}
                       onClick={() => !importingFromTmdb && handleImportFromTmdb(item)}
                     >
                       <CardContent className="p-4">
                         <div className="flex space-x-4">
                           <div className="w-16 h-24 bg-secondary rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                             {getTmdbImageUrl(item.poster_path) ? (
                               <img 
                                 src={getTmdbImageUrl(item.poster_path)!} 
                                 alt={formatTmdbTitle(item)}
                                 className="w-full h-full object-cover"
                               />
                             ) : (
                               <Film className="w-6 h-6 text-muted-foreground" />
                             )}
                           </div>
                           <div className="flex-1 space-y-2">
                             <div className="flex items-start justify-between">
                               <div>
                                 <h4 className="font-medium">{formatTmdbTitle(item)}</h4>
                                 <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                   <Badge variant="outline">{formatTmdbType(item)}</Badge>
                                   {formatTmdbDate(item) && (
                                     <span>{formatTmdbDate(item)}</span>
                                   )}
                                   <div className="flex items-center space-x-1">
                                     <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                     <span>{typeof item.vote_average === 'number' ? item.vote_average.toFixed(1) : '--'}</span>
                                   </div>
                                 </div>
                               </div>
                               {importingFromTmdb && selectedTmdbItem?.id === item.id && (
                                 <div className="flex items-center space-x-2">
                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                   <span className="text-sm text-muted-foreground">Importando...</span>
                                 </div>
                               )}
                             </div>
                             <p className="text-sm text-muted-foreground line-clamp-2">
                               {item.overview || 'Descrição não disponível'}
                             </p>
                             {!importingFromTmdb && (
                               <Button 
                                 size="sm" 
                                 className="w-fit"
                                 onClick={(e) => {
                                   e.stopPropagation()
                                   handleImportFromTmdb(item)
                                 }}
                                 disabled={importingFromTmdb}
                               >
                                 <Download className="w-3 h-3 mr-1" />
                                 Importar
                               </Button>
                             )}
                             {importingFromTmdb && selectedTmdbItem?.id === item.id && (
                               <Button size="sm" className="w-fit" disabled>
                                 <Download className="w-3 h-3 mr-1 animate-spin" />
                                 Importando...
                               </Button>
                             )}
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
               )}

               {!tmdbLoading && tmdbResults.length === 0 && (
                 <div className="text-center py-8 text-muted-foreground">
                   <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                   <p>Nenhum resultado encontrado. Tente outros termos de busca.</p>
                 </div>
               )}
             </CardContent>
           </Card>
         </TabsContent>

         <TabsContent value="manual" className="space-y-4">
           <form onSubmit={handleSubmit} className="space-y-6">
             {/* Dados importados do TMDB */}
             {selectedTmdbItem && (
               <Card className="border-primary/50 bg-primary/5">
                 <CardHeader>
                   <CardTitle className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                       <Download className="h-5 w-5 text-primary" />
                       <span>Dados Importados do TMDB</span>
                     </div>
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={resetForm}
                       type="button"
                     >
                       Limpar e Recomeçar
                     </Button>
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="flex items-center space-x-4">
                     <div className="w-16 h-24 bg-secondary rounded flex items-center justify-center overflow-hidden">
                       {getTmdbImageUrl(selectedTmdbItem.poster_path) ? (
                         <img 
                           src={getTmdbImageUrl(selectedTmdbItem.poster_path)!}
                           alt={formatTmdbTitle(selectedTmdbItem)}
                           className="w-full h-full object-cover"
                         />
                       ) : (
                         <Film className="w-6 h-6 text-muted-foreground" />
                       )}
                     </div>
                     <div>
                       <h4 className="font-medium">{formatTmdbTitle(selectedTmdbItem)}</h4>
                       <p className="text-sm text-muted-foreground">
                         {formatTmdbType(selectedTmdbItem)} • {formatTmdbDate(selectedTmdbItem)}
                       </p>
                       <div className="flex items-center space-x-1 text-sm">
                         <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                         <span>{selectedTmdbItem.vote_average.toFixed(1)}</span>
                       </div>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             )}

             {/* Informações Básicas */}
             <Card>
               <CardContent className="p-4 space-y-4">
                 <h3 className="font-semibold text-lg">Informações Básicas</h3>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="nome">Título *</Label>
                     <Input
                       id="nome"
                       value={formData.nome}
                       onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                       placeholder="Ex: Stranger Things"
                       required
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="subcategoria">Tipo *</Label>
                     <Select 
                       value={formData.subcategoria} 
                       onValueChange={(value) => setFormData({ ...formData, subcategoria: value })}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Selecione o tipo" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="filme">
                           <div className="flex items-center space-x-2">
                             <Film className="h-4 w-4" />
                             <span>Filme</span>
                           </div>
                         </SelectItem>
                         <SelectItem value="serie">
                           <div className="flex items-center space-x-2">
                             <Tv className="h-4 w-4" />
                             <span>Série</span>
                           </div>
                         </SelectItem>
                         <SelectItem value="anime">Anime</SelectItem>
                         <SelectItem value="desenho">Desenho</SelectItem>
                         <SelectItem value="documentario">Documentário</SelectItem>
                         <SelectItem value="curta">Curta-metragem</SelectItem>
                         <SelectItem value="minisserie">Minissérie</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="descricao">Descrição *</Label>
                   <Textarea
                     id="descricao"
                     value={formData.metadata.descricao}
                     onChange={(e) => setFormData({ 
                       ...formData, 
                       metadata: { ...formData.metadata, descricao: e.target.value } 
                     })}
                     placeholder="Descreva o enredo e principais características..."
                     rows={4}
                     required
                   />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="categoria">Categoria *</Label>
                     <Select 
                       value={formData.categoria} 
                       onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Selecione a categoria" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="acao">Ação</SelectItem>
                         <SelectItem value="aventura">Aventura</SelectItem>
                         <SelectItem value="comedia">Comédia</SelectItem>
                         <SelectItem value="drama">Drama</SelectItem>
                         <SelectItem value="terror">Terror</SelectItem>
                         <SelectItem value="ficcao_cientifica">Ficção Científica</SelectItem>
                         <SelectItem value="fantasia">Fantasia</SelectItem>
                         <SelectItem value="romance">Romance</SelectItem>
                         <SelectItem value="thriller">Thriller</SelectItem>
                         <SelectItem value="documentario">Documentário</SelectItem>
                         <SelectItem value="animacao">Animação</SelectItem>
                         <SelectItem value="crime">Crime</SelectItem>
                         <SelectItem value="guerra">Guerra</SelectItem>
                         <SelectItem value="historia">História</SelectItem>
                         <SelectItem value="musica">Música</SelectItem>
                         <SelectItem value="misterio">Mistério</SelectItem>
                         <SelectItem value="familia">Família</SelectItem>
                         <SelectItem value="biografia">Biografia</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="duracao">Duração (minutos)</Label>
                     <Input
                       id="duracao"
                       type="number"
                       value={formData.metadata.duracao}
                       onChange={(e) => setFormData({ 
                         ...formData, 
                         metadata: { ...formData.metadata, duracao: parseInt(e.target.value) || 0 } 
                       })}
                       placeholder="120"
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="ano_lancamento">Ano de Lançamento</Label>
                     <Input
                       id="ano_lancamento"
                       type="number"
                       value={formData.metadata.ano_lancamento}
                       onChange={(e) => setFormData({ 
                         ...formData, 
                         metadata: { ...formData.metadata, ano_lancamento: parseInt(e.target.value) || 0 } 
                       })}
                       placeholder="2024"
                       min="1900"
                       max="2030"
                     />
                   </div>
                 </div>
               </CardContent>
             </Card>

             {/* Detalhes de Produção */}
             <Card>
               <CardContent className="p-4 space-y-4">
                 <h3 className="font-semibold text-lg">Detalhes de Produção</h3>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="diretor">Diretor</Label>
                     <Input
                       id="diretor"
                       value={formData.metadata.diretor}
                       onChange={(e) => setFormData({ 
                         ...formData, 
                         metadata: { ...formData.metadata, diretor: e.target.value } 
                       })}
                       placeholder="Nome do diretor"
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="idade_recomendada">Classificação</Label>
                     <Select
                       value={formData.metadata.idade_recomendada}
                       onValueChange={(value) => setFormData({ 
                         ...formData, 
                         metadata: { ...formData.metadata, idade_recomendada: value } 
                       })}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Classificação etária" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="L">Livre</SelectItem>
                         <SelectItem value="10+">10 anos</SelectItem>
                         <SelectItem value="12+">12 anos</SelectItem>
                         <SelectItem value="14+">14 anos</SelectItem>
                         <SelectItem value="16+">16 anos</SelectItem>
                         <SelectItem value="18+">18 anos</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="elenco">Elenco Principal</Label>
                     <Textarea
                       id="elenco"
                       value={formData.metadata.elenco}
                       onChange={(e) => setFormData({ 
                         ...formData, 
                         metadata: { ...formData.metadata, elenco: e.target.value } 
                       })}
                       placeholder="Separe os nomes por vírgula: Ator 1, Atriz 2, Ator 3..."
                       rows={2}
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="rating">Avaliação (0-10)</Label>
                     <Input
                       id="rating"
                       type="number"
                       step="0.1"
                       min="0"
                       max="10"
                       value={formData.rating}
                       onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                       placeholder="8.5"
                     />
                   </div>
                 </div>
               </CardContent>
             </Card>

             {/* URLs e Mídia */}
             <Card>
               <CardContent className="p-4 space-y-4">
                 <h3 className="font-semibold text-lg">URLs e Mídia</h3>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="url_transmissao">URL de Transmissão *</Label>
                     <Input
                       id="url_transmissao"
                       value={formData.url_transmissao}
                       onChange={(e) => setFormData({ ...formData, url_transmissao: e.target.value })}
                       placeholder="https://cdn.exemplo.com/video.m3u8"
                       required
                     />
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="poster">URL do Poster *</Label>
                     <Input
                       id="poster"
                       value={formData.poster}
                       onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                       placeholder="https://cdn.exemplo.com/poster.jpg"
                       required
                     />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="trailer_url">URL do Trailer</Label>
                   <Input
                     id="trailer_url"
                     value={formData.metadata.trailer_url}
                     onChange={(e) => setFormData({ 
                       ...formData, 
                       metadata: { ...formData.metadata, trailer_url: e.target.value } 
                     })}
                     placeholder="https://youtube.com/watch?v=..."
                   />
                 </div>
               </CardContent>
             </Card>

             {/* Qualidades e Legendas */}
             <Card>
               <CardContent className="p-4 space-y-4">
                 <h3 className="font-semibold text-lg">Qualidades e Legendas</h3>

                 <div className="space-y-2">
                   <Label>Qualidades *</Label>
                   <div className="flex space-x-2">
                     <Input
                       value={newQualidade}
                       onChange={(e) => setNewQualidade(e.target.value)}
                       placeholder="Ex: 4K, 1080p, 720p..."
                       onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addQualidade())}
                     />
                     <Button type="button" onClick={addQualidade} size="icon" variant="outline">
                       <Plus className="h-4 w-4" />
                     </Button>
                   </div>
                   {formData.qualidades.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-2">
                       {formData.qualidades.map((qualidade) => (
                         <Badge key={qualidade} variant="secondary" className="flex items-center space-x-1">
                           <span>{qualidade}</span>
                           <button 
                             type="button" 
                             onClick={() => removeQualidade(qualidade)} 
                             className="ml-1 hover:text-destructive"
                           >
                             <X className="h-3 w-3" />
                           </button>
                         </Badge>
                       ))}
                     </div>
                   )}
                 </div>

                 <div className="space-y-2">
                   <Label>Legendas</Label>
                   <div className="flex space-x-2">
                     <Input
                       value={newLegenda}
                       onChange={(e) => setNewLegenda(e.target.value)}
                       placeholder="Ex: português, inglês, espanhol..."
                       onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLegenda())}
                     />
                     <Button type="button" onClick={addLegenda} size="icon" variant="outline">
                       <Plus className="h-4 w-4" />
                     </Button>
                   </div>
                   {formData.metadata.legendas.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-2">
                       {formData.metadata.legendas.map((legenda) => (
                         <Badge key={legenda} variant="secondary" className="flex items-center space-x-1">
                           <span>{legenda}</span>
                           <button 
                             type="button" 
                             onClick={() => removeLegenda(legenda)} 
                             className="ml-1 hover:text-destructive"
                           >
                             <X className="h-3 w-3" />
                           </button>
                         </Badge>
                       ))}
                     </div>
                   )}
                 </div>
               </CardContent>
             </Card>

             {/* Configurações */}
             <Card>
               <CardContent className="p-4 space-y-4">
                 <h3 className="font-semibold text-lg">Configurações</h3>

                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label>Publicar Imediatamente</Label>
                     <p className="text-sm text-muted-foreground">O conteúdo ficará visível para os usuários</p>
                   </div>
                   <Switch
                     checked={formData.ativo}
                     onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                   />
                 </div>
               </CardContent>
             </Card>
           </form>
         </TabsContent>
       </Tabs>

       <DialogFooter>
         <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
           Cancelar
         </Button>
         <Button 
           onClick={handleSubmit} 
           disabled={isLoading || !formData.nome || !formData.url_transmissao || !formData.poster || !formData.categoria || !formData.subcategoria} 
           className="bg-primary hover:bg-primary/90"
         >
           {isLoading ? "Salvando..." : "Adicionar Conteúdo"}
         </Button>
       </DialogFooter>
     </DialogContent>
   </Dialog>
 )
}