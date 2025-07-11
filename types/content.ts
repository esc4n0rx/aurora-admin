export interface ContentMetadata {
    descricao?: string
    duracao?: number
    ano_lancamento?: number
    diretor?: string
    elenco?: string[]
    idade_recomendada?: string
    idioma?: string
    legendas?: string[]
    trailer_url?: string
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
    metadata: ContentMetadata
    created_at: string
    updated_at: string
    is_series: boolean
    view_count: number
  }
  
  export interface ContentListResponse {
    success: boolean
    message: string
    data: Content[]
    pagination: {
      total: number
      limit: number
      offset: number
      hasMore: boolean
    }
  }
  
  export interface ContentResponse {
    success: boolean
    message: string
    data: Content
  }
  
  export interface CreateContentRequest {
    nome: string
    url_transmissao: string
    poster: string
    categoria: string
    subcategoria: string
    ativo: boolean
    rating?: number
    qualidades: string[]
    metadata: ContentMetadata
  }
  
  export interface UpdateContentRequest {
    nome?: string
    url_transmissao?: string
    poster?: string
    categoria?: string
    subcategoria?: string
    ativo?: boolean
    rating?: number
    qualidades?: string[]
    metadata?: Partial<ContentMetadata>
  }
  
  export interface ContentStats {
    success: boolean
    message: string
    data: {
      categoryStats: Array<{ categoria: string; count: number }>
      totalViews: number
    }
  }