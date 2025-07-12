// types/logs.ts

export interface LogEntry {
    id: string
    user_id: string
    profile_id: string | null
    action_type: string
    action_category: 'auth' | 'profile' | 'content' | 'system' | 'security' | 'admin'
    description: string
    metadata: Record<string, any>
    ip_address: string
    user_agent: string
    request_id: string
    endpoint: string
    method: string
    status_code: number
    response_time_ms: number
    created_at: string
    users: {
      nome: string
      email: string
    } | null
    profiles: {
      nome: string
    } | null
  }
  
  export interface LogsResponse {
    success: boolean
    message: string
    data: LogEntry[]
    pagination: {
      total: number
      limit: number
      offset: number
      hasMore: boolean
    }
  }
  
  export interface LogsParams {
    limit?: number
    offset?: number
    userId?: string
    actionCategory?: 'auth' | 'profile' | 'content' | 'system' | 'security' | 'admin'
    actionType?: string
    startDate?: string
    endDate?: string
    ipAddress?: string
    statusCode?: string
  }
  
  export interface LogsStatsResponse {
    success: boolean
    message: string
    data: {
      actionStats: Array<{
        action_category: string
        count: number
      }>
      topUsers: Array<{
        user_id: string
        users: {
          nome: string
          email: string
        }
        count: number
      }>
      topIPs: Array<{
        ip_address: string
        count: number
      }>
      timeRange: string
    }
  }
  
  export interface LogsStatsParams {
    timeRange?: '1d' | '7d' | '30d' | '90d'
  }