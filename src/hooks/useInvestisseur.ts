import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { toast } from 'sonner'
import type {
  OffreFinancement,
  Candidature,
  StatutCandidature,
  CreerOffreDto,
  ProjetResume,
} from '@matura/shared'

// ─── Types étendus ────────────────────────────────────────────────────────────

export type OffreAvecCount = OffreFinancement & {
  _count: { candidatures: number }
}

export type CandidatureAvecProjet = Candidature & {
  projet: {
    id: string
    titre: string       // champ réel Prisma Projet
    brl_actuel: number  // champ réel Prisma Projet
    description: string | null
    secteur: string | null
    region: string | null
    statut: string
    proprietaire: { id: string; prenom: string; nom: string }
    equipe: { id: string }[]
    stades: { type: string; statut: string; donnees: any; score_auto: number | null }[]
    score: any | null
    finances: any | null
  }
  offre: { id: string; titre: string; stadeCible: number }
}

export interface FicheInvestisseur {
  identite: {
    id: string; titre: string; domaine: string; region: string
    brl_actuel: number; date_creation: string | null; resume_executif: string | null
  }
  equipe: {
    fondateur: { prenom_nom: string; avatar_url: string | null; bio: string | null }
    membres: { prenom_nom: string; role_projet: string; disciplines: string[] }[]
    mentor: { prenom_nom: string; nb_evaluations: number; note_moyenne: number | null } | null
  }
  score: {
    score_global: number; score_innovation: number; score_marche: number
    score_equipe: number; score_finance: number; score_execution: number
  } | null
  finances: {
    point_mort_unites: number | null
    ca_previsionnel: { annee1: number; annee2: number; annee3: number } | null
    roi: number | null
  } | null
  traction: {
    nb_clients: number | null
    clients_payants: number | null
    revenus_generes: number | null
    revenus_generes_ar: number | null
    score_nps: number | null
    taux_retention: number | null
    taux_retention_pct: number | null
    partenariats: string[]
    kpis_cles: unknown
  } | null
  besoins_financement: {
    montant_recherche: number | null; type_financement: string | null
    usage_des_fonds: string | null
  } | null
  documents: { type: string; nom: string; url: string }[]
}

// ─── Type résumé projet côté investisseur ────────────────────────────────────
// Correspond à la réponse de GET /investisseur/projets
// NB : le mentor est renvoyé avec prenom_nom (concaténé), pas prenom+nom séparés

export type ProjetInvestisseur = Omit<ProjetResume, 'mentor' | 'score_global'> & {
  titre: string
  domaine: string
  region: string
  brl_actuel: number
  score_global: number | null
  mentor: { prenom: string; nom: string; prenom_nom?: string } | null
  traction?: Record<string, unknown> | null
}

// ─── Clés de cache ────────────────────────────────────────────────────────────

export const investisseurKeys = {
  mesOffres:          ()           => ['investisseur', 'mes-offres'] as const,
  candidaturesOffre:  (id: string) => ['investisseur', 'candidatures', id] as const,
  projets:            (p: object)  => ['investisseur', 'projets', p] as const,
  fiche:              (id: string) => ['investisseur', 'fiche', id] as const,
}

// ─── useMesOffres ─────────────────────────────────────────────────────────────
// GET /financements/mes-offres

export function useMesOffres() {
  return useQuery<OffreAvecCount[]>({
    queryKey: investisseurKeys.mesOffres(),
    queryFn: async () => {
      const { data } = await apiClient.get('/financements/mes-offres')
      return data
    },
    staleTime: 2 * 60 * 1000,
  })
}

// ─── useCreerOffre ────────────────────────────────────────────────────────────
// POST /financements

export function useCreerOffre() {
  const qc = useQueryClient()
  return useMutation<OffreFinancement, Error, CreerOffreDto>({
    mutationFn: async (dto) => {
      const { data } = await apiClient.post('/financements', dto)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: investisseurKeys.mesOffres() })
      toast.success('Offre créée avec succès')
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      toast.error('Erreur lors de la création', {
        description: err.response?.data?.message ?? err.message,
      })
    },
  })
}

// ─── useCandidaturesOffre ─────────────────────────────────────────────────────
// GET /financements/candidatures-recues?offreId=

export function useCandidaturesOffre(offreId: string, enabled = true) {
  return useQuery<CandidatureAvecProjet[]>({
    queryKey: investisseurKeys.candidaturesOffre(offreId),
    queryFn: async () => {
      const { data } = await apiClient.get('/financements/candidatures-recues', {
        params: { offreId },
      })
      return data
    },
    enabled: !!offreId && enabled,
    staleTime: 60 * 1000,
  })
}

// ─── useChangerStatutCandidature ──────────────────────────────────────────────
// PATCH /financements/candidatures/:candidatureId/statut

export function useChangerStatutCandidature() {
  const qc = useQueryClient()
  return useMutation<
    Candidature,
    Error,
    { candidatureId: string; statut: StatutCandidature; offreId: string }
  >({
    mutationFn: async ({ candidatureId, statut }) => {
      const { data } = await apiClient.patch(
        `/financements/candidatures/${candidatureId}/statut`,
        { statut },
      )
      return data
    },
    onSuccess: (_, { offreId }) => {
      qc.invalidateQueries({ queryKey: investisseurKeys.candidaturesOffre(offreId) })
      toast.success('Statut mis à jour')
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      toast.error('Erreur', { description: err.response?.data?.message ?? err.message })
    },
  })
}

// ─── useProjetsInvestisseurs ──────────────────────────────────────────────────
// GET /investisseur/projets
// Projets publics brl_actuel >= 6 + score >= 65

export function useProjetsInvestisseurs(params: {
  domaine?: string; score_min?: number; region?: string; page?: number
} = {}) {
  return useQuery<{
    projets: ProjetInvestisseur[]
    total: number; page: number; pages: number
  }>({
    queryKey: investisseurKeys.projets(params),
    queryFn: async () => {
      const { data } = await apiClient.get('/investisseur/projets', { params })
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ─── useFicheInvestisseur ─────────────────────────────────────────────────────
// GET /investisseur/projets/:projetId/fiche

export function useFicheInvestisseur(projetId: string) {
  return useQuery<FicheInvestisseur>({
    queryKey: investisseurKeys.fiche(projetId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/investisseur/projets/${projetId}/fiche`)
      return data
    },
    enabled: !!projetId,
    staleTime: 5 * 60 * 1000,
  })
}
