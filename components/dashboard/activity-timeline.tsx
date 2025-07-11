"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Video, TrendingUp, Activity } from "lucide-react"
import type { SystemStats } from "@/types/auth"

interface ActivityTimelineProps {
  data: SystemStats | null
  isLoading: boolean
}

export function ActivityTimeline({ data, isLoading }: ActivityTimelineProps) {
  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Atividade do Sistema</span>
          </CardTitle>
          <CardDescription>Métricas de atividade em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                </div>
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
            <Clock className="h-5 w-5" />
            <span>Atividade do Sistema</span>
          </CardTitle>
          <CardDescription>Dados não disponíveis</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const activities = [
    {
      icon: Activity,
      title: "Ações nas últimas 24h",
      value: data.activity.actionsLast24h.toLocaleString('pt-BR'),
      description: "Interações de usuários",
      color: "default" as const,
    },
    {
      icon: TrendingUp,
      title: "Ações nos últimos 7 dias",
      value: data.activity.actionsLast7d.toLocaleString('pt-BR'),
      description: "Média de " + Math.round(data.activity.actionsLast7d / 7).toLocaleString('pt-BR') + " por dia",
      color: "secondary" as const,
    },
    {
      icon: Users,
      title: "IPs únicos (24h)",
      value: data.activity.uniqueIPsLast24h.toLocaleString('pt-BR'),
      description: "Visitantes únicos",
      color: "default" as const,
    },
    {
      icon: Video,
      title: "Novos usuários (7 dias)",
      value: data.users.newLastWeek.toLocaleString('pt-BR'),
      description: "Crescimento semanal",
      color: "default" as const,
    },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Atividade do Sistema</span>
        </CardTitle>
        <CardDescription>
          Última atualização: {new Date(data.timestamp).toLocaleString('pt-BR')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon
            
            return (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <Badge variant={activity.color} className="text-xs">
                      {activity.value}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Resumo de usuários */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Usuários Ativos</p>
              <p className="font-medium">{data.users.active.toLocaleString('pt-BR')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Total de Usuários</p>
              <p className="font-medium">{data.users.total.toLocaleString('pt-BR')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Usuários Bloqueados</p>
              <p className="font-medium text-destructive">{data.users.blocked.toLocaleString('pt-BR')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Usuários Deletados</p>
              <p className="font-medium text-muted-foreground">{data.users.deleted.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}