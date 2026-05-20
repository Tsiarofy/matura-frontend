import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type {
  ListeFormationsResponse,
  FormationDetail,
  CreerFormationDto,
  CreerLessonDto,
} from '@matura/shared'

// ─── PARAMÈTRES DE FILTRE ────────────────────────────────────────────────────

export interface FiltresFormations {
  domaine?: string
  stade_cible?: number
  type_cible?: string
  page?: number
  limite?: number
}

// ─── LISTE DES FORMATIONS ────────────────────────────────────────────────────

export function useFormations(params: FiltresFormations = {}) {
  return useQuery({
    queryKey: ['formations', params],
    queryFn: async (): Promise<ListeFormationsResponse> => {
      const response = await apiClient.get<ListeFormationsResponse>('/formations', { params })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
  })
}

// ─── MES FORMATIONS (mentor) ─────────────────────────────────────────────────

export function useMesFormations(params: { page?: number; limite?: number } = {}) {
  return useQuery({
    queryKey: ['formations', 'mes-formations', params],
    queryFn: async (): Promise<ListeFormationsResponse> => {
      const response = await apiClient.get<ListeFormationsResponse>('/formations/mes-formations', { params })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ─── DÉTAIL D'UNE FORMATION ───────────────────────────────────────────────────

export function useFormationDetail(formationId: string) {
  return useQuery({
    queryKey: ['formations', formationId],
    queryFn: async (): Promise<FormationDetail> => {
      const response = await apiClient.get<FormationDetail>(`/formations/${formationId}`)
      return response.data
    },
    enabled: !!formationId,
    staleTime: 2 * 60 * 1000,
  })
}

// ─── CRÉER UNE FORMATION ─────────────────────────────────────────────────────

export function useCreerFormation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreerFormationDto) =>
      apiClient.post('/formations', dto).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations'] })
    },
  })
}

// ─── AJOUTER UNE LEÇON ────────────────────────────────────────────────────────

export function useAjouterLesson(formationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreerLessonDto) =>
      apiClient.post(`/formations/${formationId}/lessons`, dto).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations', formationId] })
    },
  })
}
