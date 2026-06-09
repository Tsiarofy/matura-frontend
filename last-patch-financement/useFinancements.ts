import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { toast } from 'sonner'
import type {
  PaginatedOffres,
  FiltresFinancement,
  ProjetEligible,
  PostulerDto,
  Candidature,
  OffreFinancement,
} from '@matura/shared'

// ─── Clés de cache ────────────────────────────────────────────────────────────

export const financementKeys = {
  all:             ['financements'] as const,
  liste:           (f: object) => [...financementKeys.all, 'liste', f] as const,
  detail:          (id: string) => [...financementKeys.all, 'detail', id] as const,
  eligibles:       (id: string) => [...financementKeys.all, 'eligibles', id] as const,
  mesCandidatures: ()           => [...financementKeys.all, 'mes-candidatures'] as const,
}

// ─── useFinancements — liste paginée avec filtres (entrepreneur) ──────────────
// GET /financements

export function useFinancements(filtres: FiltresFinancement) {
  return useQuery<PaginatedOffres>({
    queryKey: financementKeys.liste(filtres),
    queryFn: async () => {
      const { data } = await apiClient.get('/financements', { params: filtres })
      return data
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}

// ─── useFinancementDetail — détail d'une offre ────────────────────────────────
// GET /financements/:id

export function useFinancementDetail(id: string) {
  return useQuery<OffreFinancement & {
    investisseur: { id: string; prenom: string; nom: string; url_avatar: string | null; profil: any }
    _count: { candidatures: number }
  }>({
    queryKey: financementKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/financements/${id}`)
      return data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// ─── useProjetsEligibles — projets de l'entrepreneur éligibles à une offre ────
// GET /financements/:id/projets-eligibles
// Filtre backend : brl_actuel >= max(6, offre.stadeCible) + statut != ARCHIVE

export function useProjetsEligibles(offreId: string, enabled = false) {
  return useQuery<ProjetEligible[]>({
    queryKey: financementKeys.eligibles(offreId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/financements/${offreId}/projets-eligibles`)
      return data
    },
    enabled: !!offreId && enabled,
    staleTime: 0,
  })
}

// ─── usePostuler — soumettre une candidature (entrepreneur) ───────────────────
// POST /financements/:id/postuler

export function usePostuler(offreId: string) {
  const qc = useQueryClient()
  return useMutation<Candidature, Error, PostulerDto>({
    mutationFn: async (dto) => {
      const { data } = await apiClient.post(`/financements/${offreId}/postuler`, dto)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: financementKeys.eligibles(offreId) })
      qc.invalidateQueries({ queryKey: financementKeys.mesCandidatures() })
      qc.invalidateQueries({ queryKey: financementKeys.detail(offreId) })
      toast.success('Candidature envoyée !', {
        description: "L'investisseur a été notifié de votre dossier.",
      })
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      toast.error('Impossible de postuler', {
        description: err.response?.data?.message ?? err.message,
      })
    },
  })
}

// ─── useMesCandidatures — candidatures soumises (entrepreneur) ────────────────
// GET /financements/mes-candidatures

export function useMesCandidatures() {
  return useQuery<(Candidature & {
    offre: OffreFinancement & {
      investisseur: { id: string; prenom: string; nom: string }
    }
    projet: { id: string; titre: string; brl_actuel: number }
  })[]>({
    queryKey: financementKeys.mesCandidatures(),
    queryFn: async () => {
      const { data } = await apiClient.get('/financements/mes-candidatures')
      return data
    },
    staleTime: 2 * 60 * 1000,
  })
}
