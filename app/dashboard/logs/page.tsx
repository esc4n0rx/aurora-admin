"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Video,
  Settings,
  Shield,
  CreditCard,
  FileText,
  Search,
  Filter,
  Calendar,
  Eye,
  Download,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  BarChart3,
} from "lucide-react"
import { useLogs } from "@/hooks/use-logs"
import type { LogEntry } from "@/types/logs"

const getTypeIcon = (category: string) => {
  switch (category) {
    case "auth":
      return User
    case "content":
      return Video
    case "system":
      return Settings
    case "security":
      return Shield
    case "profile":
      return User
    case "admin":
      return Shield
    default:
      return FileText
  }
}

const getTypeColor = (category: string) => {
  switch (category) {
    case "auth":
      return "default"
    case "content":
      return "secondary"
    case "system":
      return "outline"
    case "security":
      return "destructive"
    case "profile":
      return "default"
    case "admin":
      return "secondary"
    default:
      return "secondary"
  }
}

const getStatusIcon = (statusCode: number) => {
  if (statusCode >= 200 && statusCode < 300) return Info
  if (statusCode >= 400) return AlertTriangle
  return Info
}

const getStatusColor = (statusCode: number) => {
  if (statusCode >= 200 && statusCode < 300) return "default"
  if (statusCode >= 400 && statusCode < 500) return "secondary"
  if (statusCode >= 500) return "destructive"
  return "default"
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "auth":
      return "Autenticação"
    case "content":
      return "Conteúdo"
    case "system":
      return "Sistema"
    case "security":
      return "Segurança"
    case "profile":
      return "Perfil"
    case "admin":
      return "Administração"
    default:
      return "Outros"
  }
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    return `${diffInMinutes} min atrás`
  } else if (diffInHours < 24) {
    return `${diffInHours}h atrás`
  } else {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
}

export default function LogsPage() {
  const { 
    logs, 
    stats,
    isLoading, 
    isStatsLoading,
    error, 
    pagination, 
    filters,
    updateFilters, 
    loadPage,
    refreshLogs,
    refreshStats
  } = useLogs()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [showStats, setShowStats] = useState(false)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    // Note: A API não tem parâmetro de busca por texto na documentação
    // Implementaremos filtro local por enquanto
  }

  const handleCategoryFilter = (category: string) => {
    if (category === "all") {
      updateFilters({ actionCategory: undefined })
    } else {
      updateFilters({ actionCategory: category as any })
    }
  }

  const handleDateFilter = (timeRange: string) => {
    if (timeRange === "all") {
      updateFilters({ startDate: undefined, endDate: undefined })
    } else {
      const now = new Date()
      const days = parseInt(timeRange.replace('d', ''))
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      
      updateFilters({
        startDate: startDate.toISOString(),
        endDate: now.toISOString()
      })
    }
  }

  const handleStatusFilter = (statusCode: string) => {
    if (statusCode === "all") {
      updateFilters({ statusCode: undefined })
    } else {
      updateFilters({ statusCode })
    }
  }

  // Filtrar logs localmente para busca por texto
  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      log.description.toLowerCase().includes(searchLower) ||
      log.action_type.toLowerCase().includes(searchLower) ||
      (log.users?.nome.toLowerCase().includes(searchLower)) ||
      (log.users?.email.toLowerCase().includes(searchLower)) ||
      log.ip_address.includes(searchLower)
    )
  })

  const totalPages = Math.ceil(pagination.total / pagination.limit)
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Logs do Sistema</h1>
            <p className="text-muted-foreground">Monitore e analise as atividades do sistema</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={refreshLogs} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs do Sistema</h1>
          <p className="text-muted-foreground">
            Monitore e analise as atividades do sistema em tempo real
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowStats(!showStats)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {showStats ? 'Ocultar' : 'Mostrar'} Estatísticas
          </Button>
          <Button onClick={refreshLogs} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats?.actionStats.map((stat) => (
            <Card key={stat.action_category}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {getCategoryLabel(stat.action_category)}
                </CardTitle>
                {(() => {
                  const IconComponent = getTypeIcon(stat.action_category)
                  return <IconComponent className="h-4 w-4 text-muted-foreground" />
                })()}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.count.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">ações registradas</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filtros */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ação, usuário ou IP..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select onValueChange={handleCategoryFilter} defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="auth">Autenticação</SelectItem>
                  <SelectItem value="content">Conteúdo</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                  <SelectItem value="security">Segurança</SelectItem>
                  <SelectItem value="profile">Perfil</SelectItem>
                  <SelectItem value="admin">Administração</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select onValueChange={handleStatusFilter} defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="200">Sucesso (200)</SelectItem>
                  <SelectItem value="201">Criado (201)</SelectItem>
                  <SelectItem value="400">Erro Cliente (400+)</SelectItem>
                  <SelectItem value="500">Erro Servidor (500+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select onValueChange={handleDateFilter} defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Todos os períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="1">Último dia</SelectItem>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {filteredLogs.length} de {pagination.total} logs encontrados
          </div>
        </CardContent>
      </Card>

      {/* Lista de Logs */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>
            Página {currentPage} de {totalPages} ({pagination.total} resultados)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando logs...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Nenhum log encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => {
                const IconComponent = getTypeIcon(log.action_category)
                const StatusIcon = getStatusIcon(log.status_code)

                return (
                  <div
                    key={log.id}
                    className="flex items-start space-x-4 p-4 rounded-lg border border-border/50 hover:border-border transition-colors cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{log.description}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={getStatusColor(log.status_code)} 
                            className="flex items-center space-x-1"
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{log.status_code}</span>
                          </Badge>
                          <Badge variant={getTypeColor(log.action_category)}>
                            {getCategoryLabel(log.action_category)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(log.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder-user.jpg" alt={log.users?.nome || 'Unknown'} />
                          <AvatarFallback className="text-xs">
                            {log.users?.nome
                              ? log.users.nome
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "UK"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {log.users?.nome || 'Usuário desconhecido'} ({log.users?.email || 'Email não disponível'})
</span>
<span className="text-sm text-muted-foreground">•</span>
<span className="text-sm text-muted-foreground">{log.ip_address}</span>
<span className="text-sm text-muted-foreground">•</span>
<span className="text-sm text-muted-foreground">
{log.response_time_ms}ms
</span>
</div>
                  <p className="text-sm text-muted-foreground">
                    {log.method} {log.endpoint}
                  </p>
                </div>

                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Mostrando {pagination.offset + 1} a {Math.min(pagination.offset + pagination.limit, pagination.total)} de{" "}
            {pagination.total} resultados
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1 || isLoading}
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
                    onClick={() => loadPage(page)}
                    className="w-8 h-8"
                    disabled={isLoading}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages || isLoading}
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </CardContent>
  </Card>

  {/* Modal de Detalhes do Log */}
  <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Detalhes do Log</span>
        </DialogTitle>
        <DialogDescription>Informações completas sobre a atividade registrada</DialogDescription>
      </DialogHeader>

      {selectedLog && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="technical">Detalhes Técnicos</TabsTrigger>
            <TabsTrigger value="metadata">Metadados</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedLog.description}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(selectedLog.status_code)}>
                      {selectedLog.status_code}
                    </Badge>
                    <Badge variant={getTypeColor(selectedLog.action_category)}>
                      {getCategoryLabel(selectedLog.action_category)}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Usuário</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" alt={selectedLog.users?.nome || 'Unknown'} />
                          <AvatarFallback className="text-xs">
                            {selectedLog.users?.nome
                              ? selectedLog.users.nome
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "UK"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedLog.users?.nome || 'Usuário desconhecido'}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedLog.users?.email || 'Email não disponível'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedLog.profiles && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Perfil</label>
                        <p className="mt-1">{selectedLog.profiles.nome}</p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Ação</label>
                      <p className="mt-1 font-mono text-sm">{selectedLog.action_type}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Data e Hora</label>
                      <p className="mt-1">{new Date(selectedLog.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                      <p className="mt-1 font-mono">{selectedLog.ip_address}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Request ID</label>
                      <p className="mt-1 font-mono text-sm">{selectedLog.request_id}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tempo de Resposta</label>
                      <p className="mt-1">{selectedLog.response_time_ms}ms</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status Code</label>
                      <div className="mt-1">
                        <Badge variant={getStatusColor(selectedLog.status_code)}>
                          {selectedLog.status_code}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Método HTTP</label>
                    <p className="mt-1 font-mono">{selectedLog.method}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Endpoint</label>
                    <p className="mt-1 font-mono text-sm break-all">{selectedLog.endpoint}</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                    <p className="mt-1 text-sm break-all">{selectedLog.user_agent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Metadados</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 ? (
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground">Nenhum metadado disponível</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </DialogContent>
  </Dialog>
</div>
)
}