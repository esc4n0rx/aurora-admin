import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  description: string
  isLoading?: boolean
  trend?: Array<{ value: number; label: string }>
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
  isLoading = false,
  trend
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 hover:border-border transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {change && (
            <Badge 
              variant={
                changeType === "positive" 
                  ? "default" 
                  : changeType === "negative" 
                  ? "destructive" 
                  : "secondary"
              } 
              className="text-xs"
            >
              {change}
            </Badge>
          )}
          <span>{description}</span>
        </div>
        {trend && trend.length > 0 && (
          <div className="mt-3 flex items-center space-x-1">
            {trend.map((point, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 flex-1 rounded-full bg-secondary",
                  point.value > 50 && "bg-primary"
                )}
                title={point.label}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}