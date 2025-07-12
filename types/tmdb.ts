// types/tmdb.ts
export interface TMDBSearchResult {
    id: number
    title?: string
    name?: string
    overview: string
    poster_path: string | null
    backdrop_path: string | null
    release_date?: string
    first_air_date?: string
    genre_ids: number[]
    vote_average: number
    media_type?: 'movie' | 'tv'
    original_language: string
  }
  
  export interface TMDBSearchResponse {
    page: number
    results: TMDBSearchResult[]
    total_pages: number
    total_results: number
  }
  
  export interface TMDBMovieDetails {
    id: number
    title: string
    overview: string
    poster_path: string | null
    backdrop_path: string | null
    release_date: string
    runtime: number
    genres: Array<{ id: number; name: string }>
    vote_average: number
    original_language: string
    production_countries: Array<{ iso_3166_1: string; name: string }>
    director?: string
    cast?: string[]
    spoken_languages: Array<{ iso_639_1: string; name: string }>
  }
  
  export interface TMDBTVDetails {
    id: number
    name: string
    overview: string
    poster_path: string | null
    backdrop_path: string | null
    first_air_date: string
    episode_run_time: number[]
    genres: Array<{ id: number; name: string }>
    vote_average: number
    original_language: string
    production_countries: Array<{ iso_3166_1: string; name: string }>
    created_by: Array<{ id: number; name: string }>
    spoken_languages: Array<{ iso_639_1: string; name: string }>
    number_of_seasons: number
    number_of_episodes: number
    director?: string
    cast?: string[]
  }
  
  export interface TMDBGenre {
    id: number
    name: string
  }
  
  export interface TMDBCredits {
    cast: Array<{
      id: number
      name: string
      character: string
      order: number
    }>
    crew: Array<{
      id: number
      name: string
      job: string
      department: string
    }>
  }