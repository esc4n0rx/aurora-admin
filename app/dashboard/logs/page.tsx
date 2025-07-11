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
} from "lucide-react"

const logs = [
  {
    id: 1,
    action: "Usuário criou conta",
    user: "João Silva",
    email: "joao@email.com",
    timestamp: "2024-01-15T10:30:00Z",
    type: "user",
    severity: "info",
    details: "Novo registro via email",
    ip: "192.168.1.100",
    userAgent: "Chrome 120.0.0.0 - Windows 10",
    location: "São Paulo, SP",
    metadata: {
      registrationMethod: "email",
      referrer: "google.com",
      device: "desktop",
    },
  },
  {
    id: 2,
    action: "Vídeo publicado",
    user: "Admin",
    email: "admin@aurora.com",
    timestamp: "2024-01-15T09:15:00Z",
    type: "content",
    severity: "info",
    details: "Stranger Things - Temporada 4",
    ip: "10.0.0.1",
    userAgent: "Chrome 120.0.0.0 - macOS",
    location: "Rio de Janeiro, RJ",
    metadata: {
      contentId: "st-s4",
      category: "series",
      duration: "8h 32min",
    },
  },
  {
    id: 3,
    action: "Configuração alterada",
    user: "Admin",
    email: "admin@aurora.com",
    timestamp: "2024-01-15T08:45:00Z",
    type: "system",
    severity: "warning",
    details: "Modo de manutenção desativado",
    ip: "10.0.0.1",
    userAgent: "Chrome 120.0.0.0 - macOS",
    location: "Rio de Janeiro, RJ",
    metadata: {
      setting: "maintenance_mode",
      oldValue: "true",
      newValue: "false",
    },
  },
  {
    id: 4,
    action: "Usuário suspenso",
    user: "Admin",
    email: "admin@aurora.com",
    timestamp: "2024-01-14T16:20:00Z",
    type: "security",
    severity: "critical",
    details: "Violação dos termos de uso",
    ip: "10.0.0.1",
    userAgent: "Chrome 120.0.0.0 - macOS",
    location: "Rio de Janeiro, RJ",
    metadata: {
      suspendedUserId: "user_123",
      reason: "terms_violation",
      duration: "7_days",
    },
  },
  {
    id: 5,
    action: "Pagamento processado",
    user: "Maria Santos",
    email: "maria@email.com",
    timestamp: "2024-01-14T14:10:00Z",
    type: "payment",
    severity: "info",
    details: "Assinatura Premium - R$ 29,90",
    ip: "192.168.1.200",
    userAgent: "Safari 17.0 - iOS 17",
    location: "Belo Horizonte, MG",
    metadata: {
      amount: "29.90",
      currency: "BRL",
      paymentMethod: "credit_card",
      transactionId: "txn_abc123",
    },
  },
  {
    id: 6,
    action: "Tentativa de login falhada",
    user: "Desconhecido",
    email: "hacker@evil.com",
    timestamp: "2024-01-14T12:00:00Z",
    type: "security",
    severity: "critical",
    details: "Múltiplas tentativas de login com credenciais inválidas",
    ip: "203.0.113.1",
    userAgent: "curl/7.68.0",
    location: "Localização desconhecida",
    metadata: {
      attempts: 15,
      blocked: true,
      targetUser: "admin@aurora.com",
    },
  },
  {
    id: 7,
    action: "Download de conteúdo",
    user: "Pedro Costa",
    email: "pedro@email.com",
    timestamp: "2024-01-14T11:30:00Z",
    type: "content",
    severity: "info",
    details: "Avatar: O Caminho da Água",
    ip: "192.168.1.150",
    userAgent: "Aurora+ Mobile App 2.1.0 - Android 13",
    location: "Brasília, DF",
    metadata: {
      contentId: "avatar-2",
      quality: "1080p",
      fileSize: "4.2GB",
    },
  },
  {
    id: 8,
    action: "Relatório gerado",
    user: "Admin",
    email: "admin@aurora.com",
    timestamp: "2024-01-14T10:00:00Z",
    type: "report",
    severity: "info",
    details: "Relatório mensal de usuários",
    ip: "10.0.0.1",
    userAgent: "Chrome 120.0.0.0 - macOS",
    location: "Rio de Janeiro, RJ",
    metadata: {
      reportType: "monthly_users",
      period: "2024-01",
      recordCount: 12847,
    },
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "user":
      return User
    case "content":
      return Video
    case "system":
      return Settings
    case "security":
      return Shield
    case "payment":
      return CreditCard
    case "report":
      return FileText
    default:
      return FileText
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "user":
      return "default"
    case "content":
      return "secondary"
    case "system":
      return "outline"
    case "security":
      return "destructive"
    case "payment":
      return "default"
    case "report":
      return "secondary"
    default:
      return "secondary"
  }
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "info":
      return Info
    case "warning":
      return AlertTriangle
    case "critical":
      return AlertTriangle
    default:
      return Info
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "info":
      return "default"
    case "warning":
      return "secondary"
    case "critical":
      return "destructive"
    default:
      return "default"
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case "user":
      return "Usuário"
    case "content":
      return "Conteúdo"
    case "system":
      return "Sistema"
    case "security":
      return "Segurança"
    case "payment":
      return "Pagamento"
    case "report":
      return "Relatório"
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
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLog, setSelectedLog] = useState<(typeof logs)[0] | null>(null)

  const itemsPerPage = 10

  // Filtrar logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || log.type === typeFilter
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const logDate = new Date(log.timestamp)
      const now = new Date()
      const diffInHours = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60)

      switch (dateFilter) {
        case "1h":
          matchesDate = diffInHours <= 1
          break
        case "24h":
          matchesDate = diffInHours <= 24
          break
        case "7d":
          matchesDate = diffInHours <= 168
          break
        case "30d":
          matchesDate = diffInHours <= 720
          break
      }
    }

    return matchesSearch && matchesType && matchesSeverity && matchesDate
  })

  // Paginação
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage)

  const clearFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setSeverityFilter("all")
    setDateFilter("all")
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Logs de Atividade</h2>
          <p className="text-muted-foreground">Monitore todas as ações e eventos da plataforma em tempo real</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={clearFilters}>
            Limpar Filtros
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="content">Conteúdo</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                  <SelectItem value="security">Segurança</SelectItem>
                  <SelectItem value="payment">Pagamento</SelectItem>
                  <SelectItem value="report">Relatório</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severidade</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo período</SelectItem>
                  <SelectItem value="1h">Última hora</SelectItem>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Resultados</label>
              <div className="text-sm text-muted-foreground pt-2">
                {filteredLogs.length} de {logs.length} logs
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Logs */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>
            Página {currentPage} de {totalPages} ({filteredLogs.length} resultados)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedLogs.map((log) => {
              const IconComponent = getTypeIcon(log.type)
              const SeverityIcon = getSeverityIcon(log.severity)

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
                      <h4 className="font-medium">{log.action}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityColor(log.severity)} className="flex items-center space-x-1">
                          <SeverityIcon className="w-3 h-3" />
                          <span className="capitalize">{log.severity}</span>
                        </Badge>
                        <Badge variant={getTypeColor(log.type)}>{getTypeLabel(log.type)}</Badge>
                        <span className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder-user.jpg" alt={log.user} />
                        <AvatarFallback className="text-xs">
                          {log.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {log.user} ({log.email})
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{log.ip}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{log.location}</span>
                    </div>

                    <p className="text-sm text-muted-foreground">{log.details}</p>
                  </div>

                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredLogs.length)} de{" "}
                {filteredLogs.length} resultados
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
                      <span>{selectedLog.action}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityColor(selectedLog.severity)}>{selectedLog.severity}</Badge>
                        <Badge variant={getTypeColor(selectedLog.type)}>{getTypeLabel(selectedLog.type)}</Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Usuário</label>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder-user.jpg" alt={selectedLog.user} />
                            <AvatarFallback className="text-xs">
                              {selectedLog.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedLog.user}</p>
                            <p className="text-sm text-muted-foreground">{selectedLog.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Data e Hora</label>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(selectedLog.timestamp).toLocaleString("pt-BR")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                      <p className="text-sm bg-secondary/50 p-3 rounded-lg">{selectedLog.details}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Localização</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{selectedLog.location}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Endereço IP</label>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-secondary px-2 py-1 rounded">{selectedLog.ip}</code>
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                      <code className="text-sm bg-secondary p-3 rounded-lg block">{selectedLog.userAgent}</code>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">ID do Log</label>
                        <code className="text-sm bg-secondary px-2 py-1 rounded">{selectedLog.id}</code>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                        <code className="text-sm bg-secondary px-2 py-1 rounded">{selectedLog.timestamp}</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Metadados Adicionais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(selectedLog.metadata).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                          <span className="text-sm font-medium capitalize">{key.replace(/_/g, " ")}</span>
                          <code className="text-sm bg-secondary px-2 py-1 rounded">{String(value)}</code>
                        </div>
                      ))}
                    </div>
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
