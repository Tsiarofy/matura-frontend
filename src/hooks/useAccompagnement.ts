import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { toast } from 'sonner'

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface MentorPublic {
  id: string
  prenom: string
  nom: string
  url_avatar: string | null
  profil: {
    domaines_expertise?: string[]
    annees_experience?: number
    linkedin_url?: string
    disponible?: boolean
    bio?: string
  } | null
}

export interface DemandeAccompagnement {
  id: string
  message: string | null
  statut: 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE'
  cree_le: string
  mentor?: MentorPublic
  projet?: {
    id: string
    titre: string
    domaine: string
    brl_actuel: number
    description: string
    proprietaire?: { id: string; prenom: string; nom: string }
  }
}

export interface ProjetSuivi {
  id: string
  titre: string
  domaine: string
  region: string
  statut: string
  brl_actuel: number
  score_global: number | null
  proprietaire: { id: string; prenom: string; nom: string }
  stade_actif: {
    type: string
    numero: number
    statut: string
    en_attente_evaluation: boolean
  } | null
  cree_le: string
  maj_le: string
}

// ─── USE MENTORS (annuaire) ───────────────────────────────────────────────────

export function useMentors(params: { domaine?: string; disponible?: boolean; page?: number } = {}) {
  return useQuery<{ mentors: MentorPublic[]; total: number; page: number; pages: number }>({
    queryKey: ['mentors', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/mentors', { params })
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ─── USE ENVOYER DEMANDE (entrepreneur) ──────────────────────────────────────

export function useEnvoyerDemande(projetId: string) {
  const qc = useQueryClient()
  return useMutation<unknown, Error, { mentor_id: string; message?: string }>({
    mutationFn: async (dto) => {
      const { data } = await apiClient.post(`/projets/${projetId}/demandes`, dto)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['demandes-projet', projetId] })
      qc.invalidateQueries({ queryKey: ['projet', projetId] })
      toast.success('Demande envoyée', {
        description: 'Le mentor a été notifié de votre demande.',
      })
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      const msg = err.response?.data?.message ?? err.message
      toast.error('Erreur', { description: msg })
    },
  })
}

// ─── USE DEMANDES ENVOYÉES (entrepreneur, par projet) ────────────────────────

export function useDemandesProjet(projetId: string) {
  return useQuery<DemandeAccompagnement[]>({
    queryKey: ['demandes-projet', projetId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/projets/${projetId}/demandes`)
      return data
    },
    enabled: !!projetId,
    staleTime: 2 * 60 * 1000,
  })
}

// ─── USE DEMANDES REÇUES (mentor) ─────────────────────────────────────────────

export function useDemandesMentor(params: { statut?: string } = {}) {
  return useQuery<{ demandes: DemandeAccompagnement[]; total: number; page: number; pages: number }>({
    queryKey: ['demandes-mentor', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/demandes', { params })
      return data
    },
    staleTime: 60 * 1000,
  })
}

// ─── USE RÉPONDRE DEMANDE (mentor) ────────────────────────────────────────────

export function useRepondreDemande() {
  const qc = useQueryClient()
  return useMutation<
    { id: string; statut: string; message: string },
    Error,
    { demandeId: string; statut: 'ACCEPTE' | 'REFUSE' }
  >({
    mutationFn: async ({ demandeId, statut }) => {
      const { data } = await apiClient.patch(`/demandes/${demandeId}`, { statut })
      return data
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['demandes-mentor'] })
      qc.invalidateQueries({ queryKey: ['projets-suivis'] })
      toast.success(
        result.statut === 'ACCEPTE' ? 'Demande acceptée !' : 'Demande refusée',
        { description: result.message },
      )
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      toast.error('Erreur', { description: err.response?.data?.message ?? err.message })
    },
  })
}

// ─── USE PROJETS SUIVIS (mentor) ──────────────────────────────────────────────

export function useProjetsSuivis() {
  return useQuery<ProjetSuivi[]>({
    queryKey: ['projets-suivis'],
    queryFn: async () => {
      const { data } = await apiClient.get('/projets-suivis')
      return data
    },
    staleTime: 2 * 60 * 1000,
  })
}

// ─── USE ANNULER DEMANDE (entrepreneur) ───────────────────────────────────────

export function useAnnulerDemande(projetId: string) {
  const qc = useQueryClient()
  return useMutation<unknown, Error, string>({
    mutationFn: async (demandeId) => {
      const { data } = await apiClient.delete(`/projets/${projetId}/demandes/${demandeId}`)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['demandes-projet', projetId] })
      toast.success('Demande annulée')
    },
  })
}
