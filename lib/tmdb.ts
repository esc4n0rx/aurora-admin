// lib/tmdb.ts
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

if (!TMDB_API_KEY) {
  throw new Error('TMDB_API_KEY environment variable is required')
}

export class TMDBError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = 'TMDBError'
  }
}

async function tmdbRequest<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', TMDB_API_KEY!)
  url.searchParams.set('language', 'pt-BR')
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  try {
    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new TMDBError(`TMDB API error: ${response.statusText}`, response.status)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof TMDBError) {
      throw error
    }
    throw new TMDBError('Network error when connecting to TMDB', 0)
  }
}

export const tmdbApi = {
  // Buscar conteúdos (filmes e séries)
  searchMulti: async (query: string, page = 1) => {
    return tmdbRequest<import('@/types/tmdb').TMDBSearchResponse>('/search/multi', {
      query,
      page: page.toString(),
    })
  },

  // Buscar apenas filmes
  searchMovies: async (query: string, page = 1) => {
    return tmdbRequest<import('@/types/tmdb').TMDBSearchResponse>('/search/movie', {
      query,
      page: page.toString(),
    })
  },

  // Buscar apenas séries
  searchTV: async (query: string, page = 1) => {
    return tmdbRequest<import('@/types/tmdb').TMDBSearchResponse>('/search/tv', {
      query,
      page: page.toString(),
    })
  },

  // Detalhes de um filme
  getMovieDetails: async (movieId: number) => {
    return tmdbRequest<import('@/types/tmdb').TMDBMovieDetails>(`/movie/${movieId}`)
  },

  // Detalhes de uma série
  getTVDetails: async (tvId: number) => {
    return tmdbRequest<import('@/types/tmdb').TMDBTVDetails>(`/tv/${tvId}`)
  },

  // Créditos (elenco e equipe)
  getMovieCredits: async (movieId: number) => {
    return tmdbRequest<import('@/types/tmdb').TMDBCredits>(`/movie/${movieId}/credits`)
  },

  getTVCredits: async (tvId: number) => {
    return tmdbRequest<import('@/types/tmdb').TMDBCredits>(`/tv/${tvId}/credits`)
  },

  // Gêneros
  getMovieGenres: async () => {
    return tmdbRequest<{ genres: import('@/types/tmdb').TMDBGenre[] }>('/genre/movie/list')
  },

  getTVGenres: async () => {
    return tmdbRequest<{ genres: import('@/types/tmdb').TMDBGenre[] }>('/genre/tv/list')
  },

  // Utilitários
  getImageUrl: (path: string | null, size = 'w500') => {
    if (!path) return null
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  },

  getFullImageUrl: (path: string | null) => {
    if (!path) return null
    return `${TMDB_IMAGE_BASE_URL}/original${path}`
  },
}