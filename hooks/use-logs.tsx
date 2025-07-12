// hooks/use-logs.tsx

"use client"

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { LogEntry, LogsParams, LogsStatsResponse } from '@/types/logs'

interface LogsState {
  logs: LogEntry[]
  stats: LogsStatsResponse['data'] | null
  isLoading: boolean
  isStatsLoading: boolean
  error: string | null
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export function useLogs() {
  const [state, setState] = useState<LogsState>({
    logs: [],
    stats: null,
    isLoading: false,
    isStatsLoading: false,
    error: null,
    pagination: {
      total: 0,
      limit: 50,
      offset: 0,
      hasMore: false,
    },
  })

  const [filters, setFilters] = useState<LogsParams>({
    limit: 50,
    offset: 0,
  })

  const fetchLogs = useCallback(async (params?: LogsParams) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const searchParams = { ...filters, ...params }
      const response = await api.getLogs(searchParams)

      if (response.success) {
        setState(prev => ({
          ...prev,
          logs: response.data,
          pagination: response.pagination,
          isLoading: false,
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar logs:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar logs do sistema',
      }))
    }
  }, [filters])

  const fetchStats = useCallback(async (timeRange?: '1d' | '7d' | '30d' | '90d') => {
    try {
      setState(prev => ({ ...prev, isStatsLoading: true }))

      const response = await api.getLogsStats({ timeRange })

      if (response.success) {
        setState(prev => ({
          ...prev,
          stats: response.data,
          isStatsLoading: false,
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas de logs:', error)
      setState(prev => ({
        ...prev,
        isStatsLoading: false,
      }))
    }
  }, [])

  const updateFilters = useCallback((newFilters: Partial<LogsParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }))
  }, [])

  const loadPage = useCallback((page: number) => {
    const offset = (page - 1) * (filters.limit || 50)
    setFilters(prev => ({ ...prev, offset }))
  }, [filters.limit])

  const refreshLogs = useCallback(() => {
    fetchLogs()
  }, [fetchLogs])

  const refreshStats = useCallback(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    ...state,
    filters,
    updateFilters,
    loadPage,
    refreshLogs,
    refreshStats,
  }
}