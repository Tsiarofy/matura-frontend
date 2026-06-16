import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FichierRequis, MissionStade } from '@matura/shared'
import { toast } from 'sonner'
import { apiClient } from '@/lib/apiClient'

export type { FichierRequis }

export interface FichierRequisItemDto {
  id?: string
  type: 'PDF' | 'EXCEL' | 'IMAGE' | 'VIDEO'
  description: string
  ordre?: number
}

export interface MissionItemDto {
  id?: string
  titre: string
  objectif: string
  fichiers_requis: FichierRequisItemDto[]
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

export function useMissionDetail(projetId: string, numStade: number, missionId: string) {
  return useQuery({
    queryKey: ['mission-detail', projetId, numStade, missionId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/projets/${projetId}/stades/${numStade}/missions/${missionId}`
      )
      return data
    },
    enabled: !!projetId && !!missionId,
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
      toast.success('Missions enregistrées')
    },
    onError: (err: Error & { response?: { data?: { message?: string | string[] } } }) => {
      const msg = err.response?.data?.message
      const desc = Array.isArray(msg) ? msg.join(', ') : (msg ?? err.message)
      toast.error('Erreur', {
        description: desc,
      })
    },
  })
}

/**
 * Soumission multi-fichiers pour une mission.
 * fichiersMap : Map<fichierRequisId, File>
 */
export function useSoumettreReponseMission(
  projetId: string,
  numStade: number,
  missionId: string,
) {
  const qc = useQueryClient()

  return useMutation<
    { statut: string },
    Error,
    { fichiersMap: Map<string, File>; fichiersSupplementaires?: File[]; commentaire: string }
  >({
    mutationFn: async ({ fichiersMap, fichiersSupplementaires = [], commentaire }) => {
      const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 Mo
      
      // Vérification des fichiers requis
      for (const file of Array.from(fichiersMap.values())) {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`Le fichier "${file.name}" dépasse la taille maximale autorisée (100 Mo).`)
        }
      }
      
      // Vérification des fichiers supplémentaires
      for (const file of fichiersSupplementaires) {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`Le fichier "${file.name}" dépasse la taille maximale autorisée (100 Mo).`)
        }
      }

      const formData = new FormData()

      const ids: string[] = []
      fichiersMap.forEach((file, id) => {
        formData.append('fichiers', file)
        ids.push(id)
      })
      formData.append('fichiers_requis_ids', JSON.stringify(ids))

      fichiersSupplementaires.forEach((file) => {
        formData.append('fichiers_supplementaires', file)
      })

      if (commentaire?.trim()) {
        formData.append('commentaire', commentaire.trim())
      }

      const { data } = await apiClient.post<{ statut: string }>(
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
      if (msg === 'TOUS_LES_FICHIERS_REQUIS') {
        toast.error('Fichiers manquants', {
          description: 'Vous devez uploader tous les fichiers requis avant de soumettre.',
        })
        return
      }
      if (msg?.startsWith('TYPE_FICHIER_INVALIDE')) {
        toast.error('Type de fichier incorrect', {
          description: 'Un des fichiers soumis ne correspond pas au type attendu par le mentor.',
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
        toast.success('Toutes les missions validées', {
          description: 'La saisie du stade est maintenant disponible.',
        })
        return
      }
      toast.success(result.statut === 'VALIDEE' ? 'Mission validée' : 'Mission rejetée')
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      toast.error('Erreur', {
        description: err.response?.data?.message ?? err.message,
      })
    },
  })
}

export function useSupprimerMission(projetId: string, numStade: number) {
  const qc = useQueryClient()

  return useMutation<{ deleted: string }, Error, string>({
    mutationFn: async (missionId) => {
      const { data } = await apiClient.delete<{ deleted: string }>(
        `/projets/${projetId}/stades/${numStade}/missions/${missionId}`,
      )
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['missions', projetId, numStade] })
      qc.invalidateQueries({ queryKey: ['stade', projetId, numStade] })
      toast.success('Mission supprimée')
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      const msg = err.response?.data?.message ?? err.message
      if (msg === 'MISSION_VALIDEE_NON_MODIFIABLE') {
        toast.error('Suppression impossible', {
          description: 'Cette mission a déjà été validée.',
        })
        return
      }
      toast.error('Erreur', { description: msg })
    },
  })
}
