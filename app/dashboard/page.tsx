"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Video, Crown, Server, Activity, Clock, CheckCircle, RefreshCw } from "lucide-react"
import { useAdminStats } from "@/hooks/use-admin-stats"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ContentStatsChart } from "@/components/dashboard/content-stats-chart"
import { SystemHealth } from "@/components/dashboard/system-health"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"

export default function DashboardPage() {
  const { systemStats, contentStats, healthStatus, isLoading, error, refreshStats } = useAdminStats()

  // Calcular estatísticas derivadas
  const totalContent = contentStats?.categoryStats.reduce((sum, cat) => sum + cat.count, 0) || 0
  const activeUsersPercentage = systemStats ? ((systemStats.users.active / systemStats.users.total) * 100).toFixed(1) : '0'
  const serverStatus = healthStatus?.status === 'healthy' ? 'Online' : healthStatus?.status === 'warning' ? 'Atenção' : 'Crítico'
  const uptime = healthStatus ? ((healthStatus.system.uptime / 86400) * 100).toFixed(1) : '0'

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
            <p className="text-muted-foreground">Acompanhe as métricas principais da sua plataforma</p>
          </div>
          <Button onClick={refreshStats} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao Carregar Dados</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={refreshStats}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
          <p className="text-muted-foreground">Acompanhe as métricas principais da sua plataforma</p>
        </div>
        <Button onClick={refreshStats} variant="outline" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Usuários"
          value={systemStats?.users.total || 0}
          change={systemStats ? `+${systemStats.users.newLastWeek}` : undefined}
          changeType="positive"
          icon={Users}
          description="Usuários registrados"
          isLoading={isLoading}
        />
        
        <StatsCard
          title="Conteúdos Publicados"
          value={totalContent}
          change={contentStats ? `${contentStats.categoryStats.length} categorias` : undefined}
          changeType="neutral"
          icon={Video}
          description="Conteúdos disponíveis"
          isLoading={isLoading}
        />
        
        <StatsCard
          title="Usuários Ativos"
          value={systemStats?.users.active || 0}
          change={`${activeUsersPercentage}%`}
          changeType="positive"
          icon={Crown}
          description="Taxa de usuários ativos"
          isLoading={isLoading}
        />
        
        <StatsCard
          title="Status do Servidor"
          value={serverStatus}
          change={`${uptime}% uptime`}
          changeType={healthStatus?.status === 'healthy' ? "positive" : healthStatus?.status === 'warning' ? "neutral" : "negative"}
          icon={Server}
          description="Status operacional"
          isLoading={isLoading}
        />
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Estatísticas de Conteúdo */}
        <ContentStatsChart data={contentStats} isLoading={isLoading} />
        
        {/* Status do Sistema */}
        <SystemHealth data={healthStatus} isLoading={isLoading} />
      </div>

      {/* Atividade e Visão Geral */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Timeline de Atividades */}
        <ActivityTimeline data={systemStats} isLoading={isLoading} />

        {/* Métricas de Visualização */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Métricas de Engajamento</span>
            </CardTitle>
            <CardDescription>Estatísticas de visualização e interação</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-2 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : contentStats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Total de Visualizações</p>
                    <p className="text-2xl font-bold">
                      {contentStats.totalViews.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>

                {systemStats && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Ações (24h)</p>
                        <p className="text-lg font-semibold">
                          {systemStats.activity.actionsLast24h.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Ações (7d)</p>
                        <p className="text-lg font-semibold">
                          {systemStats.activity.actionsLast7d.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">IPs Únicos (24h)</p>
                          <p className="text-lg font-semibold">
                            {systemStats.activity.uniqueIPsLast24h.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <Badge variant="outline">
                          Média: {Math.round(systemStats.activity.actionsLast24h / systemStats.activity.uniqueIPsLast24h || 0)} ações/usuário
                        </Badge>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum dado de engajamento disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo do Sistema */}
      {healthStatus && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Resumo do Sistema</span>
            </CardTitle>
            <CardDescription>
              Última atualização: {new Date().toLocaleString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Ambiente</p>
                <Badge variant="outline" className="capitalize">
                  {healthStatus.environment}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Versão</p>
                <Badge variant="secondary">v{healthStatus.version}</Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Tempo de Resposta</p>
                <Badge variant={healthStatus.responseTime < 500 ? "default" : healthStatus.responseTime < 2000 ? "secondary" : "destructive"}>
                  {healthStatus.responseTime}ms
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">CPU</p>
                <Badge variant={healthStatus.resources.cpu.usage < 70 ? "default" : healthStatus.resources.cpu.usage < 90 ? "secondary" : "destructive"}>
                  {healthStatus.resources.cpu.usage.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}