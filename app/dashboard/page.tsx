import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Video, Crown, Server, Activity, Clock, CheckCircle } from "lucide-react"

const stats = [
  {
    title: "Total de Usuários",
    value: "12,847",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    description: "Usuários registrados",
  },
  {
    title: "Vídeos Publicados",
    value: "3,429",
    change: "+8%",
    changeType: "positive" as const,
    icon: Video,
    description: "Conteúdos disponíveis",
  },
  {
    title: "Assinantes Ativos",
    value: "8,932",
    change: "+23%",
    changeType: "positive" as const,
    icon: Crown,
    description: "Planos premium ativos",
  },
  {
    title: "Status do Servidor",
    value: "Online",
    change: "99.9%",
    changeType: "positive" as const,
    icon: Server,
    description: "Uptime atual",
  },
]

const recentActivity = [
  {
    action: "Novo usuário registrado",
    user: "João Silva",
    time: "2 min atrás",
    type: "user",
  },
  {
    action: "Vídeo publicado",
    user: "Maria Santos",
    time: "15 min atrás",
    type: "content",
  },
  {
    action: "Assinatura premium ativada",
    user: "Pedro Costa",
    time: "1h atrás",
    type: "subscription",
  },
  {
    action: "Configuração atualizada",
    user: "Admin",
    time: "2h atrás",
    type: "system",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
        <p className="text-muted-foreground">Acompanhe as métricas principais da sua plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 hover:border-border transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Badge variant={stat.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                  {stat.change}
                </Badge>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Server Status */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Status do Sistema</span>
            </CardTitle>
            <CardDescription>Monitoramento em tempo real dos recursos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memória</span>
                <span>62%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "62%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Armazenamento</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">Todos os serviços operacionais</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Atividade Recente</span>
            </CardTitle>
            <CardDescription>Últimas ações realizadas na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
