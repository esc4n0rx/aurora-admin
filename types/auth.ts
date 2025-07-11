export interface LoginRequest {
    email: string
    senha: string
  }
  
  export interface User {
    id: string
    nome: string
    email: string
    data_nascimento: string
    created_at: string
    updated_at: string
  }
  
  export interface LoginResponse {
    success: boolean
    message: string
    data: {
      user: User
      token: string
    }
  }
  
  export interface ApiError {
    success: false
    message: string
  }
  
  export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
  }
  
  // Novos tipos para estatísticas administrativas
  export interface SystemStats {
    users: {
      total: number
      active: number
      blocked: number
      deleted: number
      newLastWeek: number
    }
    content: {
      categoryStats: Array<{
        categoria: string
        count: number
      }>
      totalViews: number
    }
    activity: {
      actionsLast24h: number
      actionsLast7d: number
      uniqueIPsLast24h: number
    }
    timestamp: string
  }
  
  export interface ContentStats {
    categoryStats: Array<{
      categoria: string
      count: number
    }>
    totalViews: number
  }
  
  export interface HealthStatus {
    success: boolean
    status: 'healthy' | 'warning' | 'critical'
    timestamp: string
    responseTime: number
    version: string
    environment: string
    system: {
      platform: string
      architecture: string
      hostname: string
      uptime: number
      nodeVersion: string
      processUptime: number
      environment: string
    }
    resources: {
      memory: {
        total: number
        free: number
        used: number
        usage: number
        process: {
          rss: number
          heapTotal: number
          heapUsed: number
          external: number
        }
      }
      cpu: {
        usage: number
        cores: number
        model: string
      }
      disk: {
        available: string
        message: string
      }
    }
    services: {
      database: {
        status: string
        message: string
        responseTime: number
      }
    }
    application: {
      users: {
        total: number
        active: number
        blocked: number
      }
      profiles: {
        total: number
        active: number
      }
      content: {
        total: number
        active: number
      }
      actions: {
        total: number
        last24h: number
      }
    }
  }
  
  export interface AdminUser {
    id: string
    nome: string
    email: string
    data_nascimento: string
    is_blocked: boolean
    is_deleted: boolean
    blocked_reason: string | null
    blocked_at: string | null
    blocked_by: string | null
    deleted_at: string | null
    deleted_by: string | null
    profiles_count: number
    actions_count: number
    last_activity: string
    created_at: string
    updated_at: string
  }
  
  export interface Content {
    id: string
    nome: string
    url_transmissao: string
    poster: string
    categoria: string
    subcategoria: string
    ativo: boolean
    temporada: number | null
    episodio: number | null
    rating: number
    total_visualizations: number
    qualidades: string[]
    metadata: {
      descricao: string
      duracao: number
      ano_lancamento: number
      diretor: string
    }
    created_at: string
    updated_at: string
    is_series: boolean
    view_count: number
  }
  
  export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
    pagination?: {
      total: number
      limit: number
      offset: number
      hasMore: boolean
    }
  }