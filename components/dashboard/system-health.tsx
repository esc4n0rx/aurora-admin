"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle, AlertTriangle, XCircle, Server, Database, Cpu, HardDrive } from "lucide-react"
import type { HealthStatus } from "@/types/auth"

interface SystemHealthProps {
  data: HealthStatus | null
  isLoading: boolean
}

export function SystemHealth({ data, isLoading }: SystemHealthProps) {
  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Status do Sistema</span>
          </CardTitle>
          <CardDescription>Monitoramento em tempo real</CardDescription>
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
            <Activity className="h-5 w-5" />
            <span>Status do Sistema</span>
          </CardTitle>
          <CardDescription>Dados não disponíveis</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'default'
      case 'warning':
        return 'secondary'
      case 'critical':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Status do Sistema</span>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(data.status)}
            <Badge variant={getStatusColor(data.status)} className="capitalize">
              {data.status}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Uptime: {formatUptime(data.system.uptime)} • Response: {data.responseTime}ms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recursos do Sistema */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center space-x-2">
            <Server className="h-4 w-4" />
            <span>Recursos do Sistema</span>
          </h4>
          
          {/* CPU */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Cpu className="h-3 w-3" />
                <span>CPU</span>
              </div>
              <span>{data.resources.cpu.usage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500" 
                style={{ width: `${data.resources.cpu.usage}%` }}
              />
            </div>
          </div>

          {/* Memória */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-3 w-3" />
                <span>Memória</span>
              </div>
              <span>{data.resources.memory.usage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500" 
                style={{ width: `${data.resources.memory.usage}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {formatBytes(data.resources.memory.used * 1024 * 1024)} / {formatBytes(data.resources.memory.total * 1024 * 1024)}
            </div>
          </div>
        </div>

        {/* Serviços */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Serviços</span>
          </h4>
          
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-muted-foreground">{data.services.database.message}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                {data.services.database.responseTime}ms
              </span>
              {getStatusIcon(data.services.database.status)}
            </div>
          </div>
        </div>

        {/* Informações do Sistema */}
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <p><strong>Hostname:</strong> {data.system.hostname}</p>
            <p><strong>Platform:</strong> {data.system.platform}</p>
          </div>
          <div>
            <p><strong>Node:</strong> {data.system.nodeVersion}</p>
            <p><strong>Environment:</strong> {data.system.environment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}