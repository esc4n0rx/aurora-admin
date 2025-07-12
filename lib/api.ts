// lib/api.ts
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

// Função auxiliar para fazer requests para nossa própria API Next.js
async function makeInternalRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    
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

  // Listar usuários (admin) - ATUALIZADO
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

  // NOVOS ENDPOINTS PARA GERENCIAMENTO DE USUÁRIOS
  
  // Obter detalhes de um usuário específico
  getAdminUserDetails: (userId: string) =>
    makeRequest<import('@/types/auth').ApiResponse<import('@/types/auth').AdminUser>>(`/admin/users/${userId}`),

  // Bloquear usuário
  blockUser: (userId: string, data: import('@/types/auth').BlockUserRequest) =>
    makeRequest<import('@/types/auth').BlockUserResponse>(`/admin/users/${userId}/block`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Desbloquear usuário
  unblockUser: (userId: string) =>
    makeRequest<import('@/types/auth').UnblockUserResponse>(`/admin/users/${userId}/unblock`, {
      method: 'POST',
    }),

  // Remover usuário (soft delete)
  deleteUser: (userId: string) =>
    makeRequest<import('@/types/auth').DeleteUserResponse>(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),

  // Restaurar usuário removido
  restoreUser: (userId: string) =>
    makeRequest<import('@/types/auth').RestoreUserResponse>(`/admin/users/${userId}/restore`, {
      method: 'POST',
    }),

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

  // Novos endpoints para gerenciamento de conteúdos
  getContent: (contentId: string) =>
    makeRequest<import('@/types/content').ContentResponse>(`/contents/${contentId}`),

  createContent: (data: import('@/types/content').CreateContentRequest) =>
    makeRequest<import('@/types/content').ContentResponse>('/contents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateContent: (contentId: string, data: import('@/types/content').UpdateContentRequest) =>
    makeRequest<import('@/types/content').ContentResponse>(`/contents/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteContent: (contentId: string) =>
    makeRequest<{ success: boolean; message: string }>(`/contents/${contentId}`, {
      method: 'DELETE',
    }),

  getContentAdminStats: () =>
    makeRequest<import('@/types/content').ContentStats>('/contents/admin/stats'),

  getContentViewStats: (contentId: string, timeRange?: string) => {
    const query = timeRange ? `?timeRange=${timeRange}` : ''
    return makeRequest<any>(`/contents/${contentId}/stats${query}`)
  },

  getPopularContents: (limit?: number) => {
    const queryParams = limit ? `?limit=${limit}` : ''
    return makeRequest<import('@/types/content').ContentListResponse>(
      `/contents/popular${queryParams}`
    )
  },

  getSeriesEpisodes: (seriesName: string, season?: number) => {
    const queryParams = season ? `?season=${season}` : ''
    return makeRequest<import('@/types/content').ContentListResponse>(
      `/contents/series/${seriesName}/episodes${queryParams}`
    )
  },

  // TMDB Integration - Internal API calls
  searchTMDB: (query: string, type: 'multi' | 'movie' | 'tv' = 'multi', page = 1) => {
    const params = new URLSearchParams({
      query,
      type,
      page: page.toString(),
    })
    return makeInternalRequest<{
      success: boolean
      data: import('@/types/tmdb').TMDBSearchResponse
    }>(`/api/tmdb/search?${params}`)
  },

  getTMDBDetails: (id: number, type: 'movie' | 'tv') => {
    const params = new URLSearchParams({
      id: id.toString(),
      type,
    })
    return makeInternalRequest<{
      success: boolean
      data: import('@/types/tmdb').TMDBMovieDetails | import('@/types/tmdb').TMDBTVDetails
    }>(`/api/tmdb/details?${params}`)
  },

  getLogs: (params?: import('@/types/logs').LogsParams) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return makeRequest<import('@/types/logs').LogsResponse>(`/admin/logs${query}`)
  },

  // Obter estatísticas de logs (Admin only)
  getLogsStats: (params?: import('@/types/logs').LogsStatsParams) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return makeRequest<import('@/types/logs').LogsStatsResponse>(`/admin/logs/stats${query}`)
  },

  
}