"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Film, TrendingUp } from "lucide-react"
import type { ContentStats } from "@/types/auth"

interface ContentStatsChartProps {
  data: ContentStats | null
  isLoading: boolean
}

export function ContentStatsChart({ data, isLoading }: ContentStatsChartProps) {
  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Film className="h-5 w-5" />
            <span>Estatísticas de Conteúdo</span>
          </CardTitle>
          <CardDescription>Distribuição por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-2 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Film className="h-5 w-5" />
            <span>Estatísticas de Conteúdo</span>
          </CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const totalContent = data.categoryStats.reduce((sum, cat) => sum + cat.count, 0)
  const maxCount = Math.max(...data.categoryStats.map(cat => cat.count))

  const getCategoryLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      'acao': 'Ação',
      'drama': 'Drama',
      'comedia': 'Comédia',
      'terror': 'Terror',
      'ficcao_cientifica': 'Ficção Científica',
      'fantasia': 'Fantasia',
      'romance': 'Romance',
      'thriller': 'Thriller',
      'documentario': 'Documentário',
      'animacao': 'Animação',
      'crime': 'Crime',
      'guerra': 'Guerra',
      'historia': 'História',
      'musica': 'Música',
      'misterio': 'Mistério',
      'familia': 'Família',
      'biografia': 'Biografia'
    }
    return labels[categoria] || categoria.charAt(0).toUpperCase() + categoria.slice(1)
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Film className="h-5 w-5" />
          <span>Estatísticas de Conteúdo</span>
        </CardTitle>
        <CardDescription>
          {totalContent.toLocaleString('pt-BR')} conteúdos • {data.totalViews.toLocaleString('pt-BR')} visualizações totais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.categoryStats
            .sort((a, b) => b.count - a.count)
            .map((category) => {
              const percentage = ((category.count / totalContent) * 100).toFixed(1)
              const barWidth = (category.count / maxCount) * 100

              return (
                <div key={category.categoria} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {getCategoryLabel(category.categoria)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {percentage}%
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {category.count.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              )
            })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Total de visualizações: {data.totalViews.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}