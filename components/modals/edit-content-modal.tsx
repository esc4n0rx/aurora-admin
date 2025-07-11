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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Plus, Film, Tv, Save } from "lucide-react"
import { api, ApiError } from "@/lib/api"
import { toast } from "sonner"
import type { Content, UpdateContentRequest } from "@/types/content"

interface EditContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: Content | null
  onSuccess?: () => void
}

export function EditContentModal({ open, onOpenChange, content, onSuccess }: EditContentModalProps) {
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

  useEffect(() => {
    if (content) {
      setFormData({
        nome: content.nome,
        url_transmissao: content.url_transmissao,
        poster: content.poster,
        categoria: content.categoria,
        subcategoria: content.subcategoria,
        ativo: content.ativo,
        rating: content.rating,
        qualidades: content.qualidades || [],
        metadata: {
          descricao: content.metadata.descricao || "",
          duracao: content.metadata.duracao || 0,
          ano_lancamento: content.metadata.ano_lancamento || 0,
          diretor: content.metadata.diretor || "",
          elenco: content.metadata.elenco?.join(", ") || "",
          idade_recomendada: content.metadata.idade_recomendada || "",
          idioma: content.metadata.idioma || "português",
          legendas: content.metadata.legendas || [],
          trailer_url: content.metadata.trailer_url || "",
        },
      })
    }
  }, [content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content) return

    setIsLoading(true)

    try {
      const updateData: UpdateContentRequest = {
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

      await api.updateContent(content.id, updateData)
      
      toast.success("Conteúdo atualizado com sucesso!")
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao atualizar conteúdo:', error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro inesperado ao atualizar conteúdo")
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

  if (!content) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Film className="h-5 w-5" />
            <span>Editar Conteúdo</span>
          </DialogTitle>
          <DialogDescription>
            Modifique as informações do conteúdo selecionado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select 
                    value={formData.categoria} 
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acao">Ação</SelectItem>
                      <SelectItem value="comedia">Comédia</SelectItem>
                      <SelectItem value="drama">Drama</SelectItem>
                      <SelectItem value="terror">Terror</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="ficcao_cientifica">Ficção Científica</SelectItem>
                      <SelectItem value="thriller">Thriller</SelectItem>
                      <SelectItem value="documentario">Documentário</SelectItem>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label>Qualidades</Label>
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
                  <Label>Ativo</Label>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}