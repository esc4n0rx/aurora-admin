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