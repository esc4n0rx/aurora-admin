"use client"

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { SystemStats, ContentStats, HealthStatus } from '@/types/auth'

interface AdminStatsState {
  systemStats: SystemStats | null
  contentStats: ContentStats | null
  healthStatus: HealthStatus | null
  isLoading: boolean
  error: string | null
}

export function useAdminStats() {
  const [state, setState] = useState<AdminStatsState>({
    systemStats: null,
    contentStats: null,
    healthStatus: null,
    isLoading: true,
    error: null,
  })

  const fetchStats = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const [systemResponse, contentResponse, healthResponse] = await Promise.allSettled([
        api.getSystemStats(),
        api.getContentStats(),
        api.getHealthStatus(),
      ])

      const systemStats = systemResponse.status === 'fulfilled' ? systemResponse.value.data : null
      const contentStats = contentResponse.status === 'fulfilled' ? contentResponse.value.data : null
      const healthStatus = healthResponse.status === 'fulfilled' ? healthResponse.value : null

      setState({
        systemStats,
        contentStats,
        healthStatus,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar estatísticas do sistema',
      }))
    }
  }

  const refreshStats = () => {
    fetchStats()
  }

  useEffect(() => {
    fetchStats()
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    ...state,
    refreshStats,
  }
}