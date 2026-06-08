import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { MissionStade } from '@matura/shared'
import { toast } from 'sonner'
import { apiClient } from '@/lib/apiClient'

export interface MissionItemDto {
  titre: string
  objectif: string
  type_preuve_attendue: 'PDF' | 'EXCEL' | 'IMAGE' | 'VIDEO' | 'AUCUN'
  preuve_obligatoire: boolean
  date_limite?: string
  ordre?: number
}

export interface EvaluerMissionDto {
  decision: 'VALIDEE' | 'REJETEE'
  motif_rejet?: string
}

export function useMissions(projetId: string, numStade: number) {
  return useQuery<MissionStade[]>({
    queryKey: ['missions', projetId, numStade],
    queryFn: async () => {
      const { data } = await apiClient.get<MissionStade[]>(
        `/projets/${projetId}/stades/${numStade}/missions`,
      )
      return data
    },
    enabled: !!projetId && numStade >= 1 && numStade <= 7,
    staleTime: 60 * 1000,
  })
}

export function useCreerMissions(projetId: string, numStade: number) {
  const qc = useQueryClient()

  return useMutation<
    { created: number; missions_completees: boolean },
    Error,
    { missions: MissionItemDto[] }
  >({
    mutationFn: async (body) => {
      const { data } = await apiClient.post<{ created: number; missions_completees: boolean }>(
        `/projets/${projetId}/stades/${numStade}/missions`,
        body,
      )
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['missions', projetId, numStade] })
      qc.invalidateQueries({ queryKey: ['stade', projetId, numStade] })
      toast.success('Missions enregistrees')
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      toast.error('Erreur', {
        description: err.response?.data?.message ?? err.message,
      })
    },
  })
}

export function useSoumettreReponseMission(
  projetId: string,
  numStade: number,
  missionId: string,
) {
  const qc = useQueryClient()

  return useMutation<{ id: string; statut: string }, Error, FormData>({
    mutationFn: async (formData) => {
      const { data } = await apiClient.post<{ id: string; statut: string }>(
        `/projets/${projetId}/stades/${numStade}/missions/${missionId}/soumettre`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['missions', projetId, numStade] })
      qc.invalidateQueries({ queryKey: ['stade', projetId, numStade] })
      toast.success('Mission soumise')
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      const msg = err.response?.data?.message ?? err.message
      if (msg === 'PREUVE_REQUISE') {
        toast.error('Fichier requis', {
          description: 'Cette mission necessite un fichier preuve.',
        })
        return
      }
      toast.error('Erreur', { description: msg })
    },
  })
}

export function useEvaluerMission(
  projetId: string,
  numStade: number,
  missionId: string,
) {
  const qc = useQueryClient()

  return useMutation<
    { statut: string; missions_completees: boolean },
    Error,
    EvaluerMissionDto
  >({
    mutationFn: async (dto) => {
      const { data } = await apiClient.post<{ statut: string; missions_completees: boolean }>(
        `/projets/${projetId}/stades/${numStade}/missions/${missionId}/evaluer`,
        dto,
      )
      return data
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['missions', projetId, numStade] })
      qc.invalidateQueries({ queryKey: ['stade', projetId, numStade] })
      if (result.missions_completees) {
        toast.success('Toutes les missions validees', {
          description: "La saisie du stade est maintenant disponible.",
        })
        return
      }
      toast.success(result.statut === 'VALIDEE' ? 'Mission validee' : 'Mission rejetee')
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      toast.error('Erreur', {
        description: err.response?.data?.message ?? err.message,
      })
    },
  })
}
