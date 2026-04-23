import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { toast } from 'sonner'
import type { ProjetResume, ProjetDetail } from '@matura/shared'

// ─── TYPES LOCAUX ─────────────────────────────────────────────────────────────

export interface StadeData {
  id: string
  projet_id: string
  type: string
  numero: number
  statut: string
  donnees: Record<string, unknown>
  metriques: Record<string, unknown>
  version: number
  score_auto: number | null
  completion_pct: number
  alertes: { code: string; niveau: string; message: string; resolue: boolean }[]
  // messages_coherence est optionnel : présent si le backend le renvoie, absent sinon
  messages_coherence?: { message: string; statut: string }[]
  commence_le: string | null
  soumis_le: string | null
  valide_le: string | null
  maj_le: string
}

export interface GateCondition {
  code: string
  libelle: string
  valide: boolean
  valeur_actuelle: number | string | boolean
  valeur_requise: number | string
}

export interface GateResult {
  peut_soumettre: boolean
  completion_pct: number
  conditions: GateCondition[]
  alertes_critiques: { code: string; niveau: string; message: string }[]
}

export interface EnregistrementResult {
  statut: string
  version: number
  completion_pct: number
  metriques: Record<string, unknown>
  alertes: { code: string; niveau: string; message: string }[]
  maj_le: string
}

// ─── USE STADE ────────────────────────────────────────────────────────────────

export function useStade(projetId: string, numStade: number) {
  return useQuery<StadeData>({
    queryKey: ['stade', projetId, numStade],
    queryFn: async () => {
      const { data } = await apiClient.get<StadeData>(`/projets/${projetId}/stades/${numStade}`)
      return data
    },
    enabled: !!projetId && numStade >= 1 && numStade <= 7,
    staleTime: 2 * 60 * 1000,
  })
}

// ─── USE ENREGISTRER STADE ────────────────────────────────────────────────────

export function useEnregistrerStade(projetId: string, numStade: number) {
  const qc = useQueryClient()

  return useMutation<EnregistrementResult, Error, Record<string, unknown>>({
    mutationFn: async (donnees) => {
      // console.log("AVANT LE RESUETE PUT");     
      // console.log(donnees);
      const { data } = await apiClient.put<EnregistrementResult>(
        `/projets/${projetId}/stades/${numStade}`,
        donnees,
      )
      // console.log(data);
      // console.log("AVANT LE RESUETE PUT");   
      return data
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['stade', projetId, numStade] })
      qc.invalidateQueries({ queryKey: ['projet', projetId] })
      qc.invalidateQueries({ queryKey: ['stade-gate', projetId, numStade] })
      qc.invalidateQueries({ queryKey: ['projet-courant'] })
      console.log("LOG APRES SUCCES");
      console.log(result);
      const critiques = result.alertes?.filter((a) => a.niveau === 'CRITIQUE') ?? []
      if (critiques.length > 0) {
        console.log("dans le log cacth")
        console.log(critiques)
        toast.warning(`Enregistré — ${critiques.length} alerte(s) critique(s)`, {
          description: critiques[0].message,
        })
      } else {
        toast.success('Stade enregistré', {
          description: `Complétion : ${result.completion_pct}%`,
        })
      }
    },
    onError: (err) => {
      toast.error("Erreur lors de l'enregistrement", { description: err.message })
    },
  })
}

// ─── USE SOUMETTRE ────────────────────────────────────────────────────────────

export function useSoumettre(projetId: string, numStade: number) {
  const qc = useQueryClient()

  return useMutation<{ statut: string; soumis_le: string; message: string }, Error, void>({
    mutationFn: async () => {
      console.log('AVANT LA SOUMISSION');
      const { data } = await apiClient.post(`/projets/${projetId}/stades/${numStade}/soumettre`, {})
       console.log('APRES LA SOUMISSION');
      return data
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['stade', projetId, numStade] })
      qc.invalidateQueries({ queryKey: ['projet', projetId] })
      qc.invalidateQueries({ queryKey: ['projets'] })
      qc.invalidateQueries({ queryKey: ['projet-courant'] })
      toast.success('Stade soumis !', { description: result.message })
    },
    onError: (err: Error & { response?: { data?: { code?: string; details?: { conditions_manquantes?: string[] } } } }) => {
      const code = err?.response?.data?.code
      if (code === 'CONDITIONS_GATE_NON_REMPLIES') {
        const manquantes = err.response?.data?.details?.conditions_manquantes ?? []
        toast.error('Conditions non remplies', { description: manquantes.slice(0, 2).join(' · ') })
      } else {
        toast.error('Impossible de soumettre', { description: err.message })
      }
    },
  })
}

// ─── USE STADE GATE ───────────────────────────────────────────────────────────

export function useStadeGate(projetId: string, numStade: number) {
  return useQuery<GateResult>({
    queryKey: ['stade-gate', projetId, numStade],
    queryFn: async () => {
      const { data } = await apiClient.get<GateResult>(`/projets/${projetId}/stades/${numStade}/verifier-gate`)
      return data
    },
    enabled: !!projetId && numStade >= 1,
    staleTime: 30 * 1000,
  })
}

// ─── USE PROJET DETAIL ────────────────────────────────────────────────────────

export function useProjetDetail(projetId: string) {
  return useQuery<ProjetDetail>({
    queryKey: ['projet', projetId],
    queryFn: async () => {
      const { data } = await apiClient.get<ProjetDetail>(`/projets/${projetId}`)
      return data
    },
    enabled: !!projetId,
    staleTime: 2 * 60 * 1000,
  })
}

// ─── USE PROJET COURANT (sidebar) ─────────────────────────────────────────────

export function useProjetCourant() {
  return useQuery<ProjetResume | null>({
    queryKey: ['projet-courant'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ projets: ProjetResume[]; total: number }>(
        '/projets/mes-projets',
        { params: { page: 1, limite: 1 } },
      )
      return data.projets[0] ?? null
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ─── USE ÉVALUER STADE (mentor) ───────────────────────────────────────────────

interface EvalDto {
  note: number
  commentaire: string
  criteres: Record<string, number>
  decision: 'VALIDE' | 'RENVOYE'
  motif_renvoi?: string
}

export function useEvaluerStade(projetId: string, numStade: number) {
  const qc = useQueryClient()

  return useMutation<unknown, Error, EvalDto>({
    mutationFn: async (dto) => {
      const { data } = await apiClient.post(
        `/projets/${projetId}/stades/${numStade}/evaluations`,
        dto,
      )
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stade', projetId, numStade] })
      qc.invalidateQueries({ queryKey: ['projet', projetId] })
      qc.invalidateQueries({ queryKey: ['projets'] })
      toast.success('Évaluation enregistrée')
    },
    onError: (err) => {
      toast.error("Erreur lors de l'évaluation", { description: err.message })
    },
  })
}
