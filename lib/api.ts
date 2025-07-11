const API_BASE_URL = 'http://localhost:3000/api/v1'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // Adicionar token de autorização se disponível
  const token = localStorage.getItem('auth_token')
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    // Erro de rede ou parsing
    throw new ApiError(
      'Erro de conexão. Verifique sua internet e tente novamente.',
      0
    )
  }
}

export const api = {
  // Autenticação
  login: (credentials: { email: string; senha: string }) =>
    makeRequest<import('@/types/auth').LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Estatísticas administrativas
  getSystemStats: () =>
    makeRequest<import('@/types/auth').ApiResponse<import('@/types/auth').SystemStats>>('/admin/stats'),

  // Estatísticas de conteúdo
  getContentStats: () =>
    makeRequest<import('@/types/auth').ApiResponse<import('@/types/auth').ContentStats>>('/contents/admin/stats'),

  // Health check completo
  getHealthStatus: () =>
    makeRequest<import('@/types/auth').HealthStatus>('/health/full'),

  // Listar usuários (admin)
  getAdminUsers: (params?: {
    limit?: number
    offset?: number
    search?: string
    status?: string
    sort_by?: string
    sort_order?: string
  }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return makeRequest<import('@/types/auth').ApiResponse<import('@/types/auth').AdminUser[]>>(`/admin/users${query}`)
  },

  // Listar conteúdos
  getContents: (params?: {
    categoria?: string
    subcategoria?: string
    ativo?: string
    limit?: number
    offset?: number
    search?: string
    sort_by?: string
    sort_order?: string
  }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return makeRequest<import('@/types/auth').ApiResponse<import('@/types/auth').Content[]>>(`/contents${query}`)
  },
}