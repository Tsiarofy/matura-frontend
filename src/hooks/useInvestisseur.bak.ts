import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { toast } from 'sonner'

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface OffreResume {
  id: string; titre: string; type_financement: string
  est_actif: boolean; brl_minimal: number
  date_limite: string | null; nb_candidatures: number; cree_le: string
}

export interface CreerOffrePayload {
  titre: string; description: string; type_financement: string
  montant_min_ar?: number; montant_max_ar?: number
  brl_minimal: number; secteurs_cibles: string[]
  regions_cibles: string[]; date_limite?: string | null
}

export interface ProjetInvestisseur {
  id: string; titre: string; domaine: string; region: string; brl_actuel: number
  score: {
    score_global: number; score_innovation: number; score_marche: number
    score_equipe: number; score_finance: number; score_execution: number
  } | null
  mentor: { prenom_nom: string } | null
  traction: Record<string, unknown> | null
}

export interface FicheInvestisseur {
  id: string; titre: string; domaine: string; region: string
  resume_executif: string | null
  score: {
    score_global: number; score_innovation: number; score_marche: number
    score_equipe: number; score_finance: number; score_execution: number
  } | null
  finances: {
    point_mort_unites: number | null
    ca_previsionnel: { annee1: number; annee2: number; annee3: number } | null
    roi: number | null
  } | null
  traction: Record<string, unknown> | null
  demande_financement: { montant_ar: unknown; type: unknown } | null
  equipe: Array<{ prenom_nom: string; role_projet: string; disciplines: string[] }>
  mentor: { prenom_nom: string; nb_evaluations: number } | null
}

export interface Candidature {
  id: string; statut: string; message: string | null
  brl_au_moment: number; cree_le: string
  projet: {
    id: string; titre: string; domaine: string; region: string
    brl_actuel: number; score_global: number | null
    proprietaire: { id: string; prenom: string; nom: string }
  }
}

// ─── USE MES OFFRES ───────────────────────────────────────────────────────────

export function useMesOffres() {
  return useQuery<OffreResume[]>({
    queryKey: ['investisseur-mes-offres'],
    queryFn: async () => {
      const { data } = await apiClient.get('/investisseur/mes-offres')
      return data
    },
    staleTime: 2 * 60 * 1000,
  })
}

// ─── USE CRÉER OFFRE ──────────────────────────────────────────────────────────

export function useCreerOffre() {
  const qc = useQueryClient()
  return useMutation<
    { id: string; titre: string; est_actif: boolean; message: string },
    Error, CreerOffrePayload
  >({
    mutationFn: async (dto) => {
      const { data } = await apiClient.post('/financements', dto)
      return data
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['investisseur-mes-offres'] })
      toast.success('Offre créée', { description: result.message })
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      console.error('Erreur création offre :', err)
      console.error(err)
      toast.error('Erreur', { description: err.response?.data?.message ?? err.message })
    },
  })
}

// ─── USE CANDIDATURES D'UNE OFFRE ────────────────────────────────────────────

export function useCandidaturesOffre(offreId: string) {
  return useQuery<Candidature[]>({
    queryKey: ['investisseur-candidatures', offreId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/investisseur/mes-offres/${offreId}/candidatures`)
      return data
    },
    enabled: !!offreId,
    staleTime: 60 * 1000,
  })
}

// ─── USE MAJ STATUT CANDIDATURE ──────────────────────────────────────────────

export function useMajStatutCandidature(offreId: string) {
  const qc = useQueryClient()
  return useMutation<
    { id: string; statut: string }, Error,
    { candidatureId: string; statut: string }
  >({
    mutationFn: async ({ candidatureId, statut }) => {
      const { data } = await apiClient.patch(`/investisseur/candidatures/${candidatureId}`, { statut })
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['investisseur-candidatures', offreId] })
      toast.success('Statut mis à jour')
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      toast.error('Erreur', { description: err.response?.data?.message ?? err.message })
    },
  })
}

// ─── USE PROJETS INVESTISSEURS ────────────────────────────────────────────────

export function useProjetsInvestisseurs(params: {
  domaine?: string; score_min?: number; region?: string; page?: number
} = {}) {
  return useQuery<{ projets: ProjetInvestisseur[]; total: number; page: number; pages: number }>({
    queryKey: ['investisseur-projets', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/investisseur/projets', { params })
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ─── USE FICHE INVESTISSEUR ───────────────────────────────────────────────────

export function useFicheInvestisseur(projetId: string) {
  return useQuery<FicheInvestisseur>({
    queryKey: ['investisseur-fiche', projetId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/investisseur/projets/${projetId}/fiche`)
      return data
    },
    enabled: !!projetId,
    staleTime: 5 * 60 * 1000,
  })
}
