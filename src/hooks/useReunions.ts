// src/hooks/useReunions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { ReunionSession, DemandeReunionDto, RejoindreReunion } from '@matura/shared'

// ── Query Keys ───────────────────────────────────────────────────

export const reunionKeys = {
  all:  () => ['reunions'] as const,
  list: () => [...reunionKeys.all(), 'list'] as const,
}

// ── Lister mes réunions ──────────────────────────────────────────

export function useMesReunions() {
  return useQuery<ReunionSession[]>({
    queryKey: reunionKeys.list(),
    queryFn: async () => {
      const { data } = await apiClient.get('/reunions/mes-reunions')
      return data
    },
    refetchInterval: 30_000, // polling toutes les 30s
  })
}

// ── Demander une réunion ─────────────────────────────────────────

export function useDemanderReunion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: DemandeReunionDto) => {
      const { data } = await apiClient.post('/reunions/demande', dto)
      return data as ReunionSession
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: reunionKeys.list() }),
  })
}

// ── Appel instantané ─────────────────────────────────────────────

export function useAppelInstantane() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: DemandeReunionDto) => {
      const { data } = await apiClient.post('/reunions/instantane', dto)
      return data as ReunionSession & { token: string; ws_url: string }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: reunionKeys.list() }),
  })
}

// ── Confirmer ────────────────────────────────────────────────────

export function useConfirmerReunion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/reunions/${id}/confirmer`)
      return data as ReunionSession
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: reunionKeys.list() }),
  })
}

// ── Refuser ──────────────────────────────────────────────────────

export function useRefuserReunion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/reunions/${id}/refuser`)
      return data as ReunionSession
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: reunionKeys.list() }),
  })
}

// ── Rejoindre (obtenir le token LiveKit) ─────────────────────────

export function useRejoindreReunion() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.get(`/reunions/${id}/rejoindre`)
      return data as RejoindreReunion
    },
  })
}
