import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { OffreFinancement, Candidature, StatutCandidature } from '@maturproj/shared';

// ─── Clés de cache ────────────────────────────────────────────────────────────

export const investisseurKeys = {
  mesOffres: () => ['investisseur', 'mes-offres'] as const,
  candidaturesOffre: (offreId: string) =>
    ['investisseur', 'candidatures', offreId] as const,
  toutesLesCandidatures: () => ['investisseur', 'candidatures'] as const,
};

// ─── Mes offres (investisseur) ────────────────────────────────────────────────

export function useMesOffres() {
  return useQuery<
    (OffreFinancement & { _count: { candidatures: number } })[]
  >({
    queryKey: investisseurKeys.mesOffres(),
    queryFn: () =>
      apiClient.get('/financements/mes-offres').then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  });
}

// ─── Candidatures reçues pour une offre donnée ───────────────────────────────

export type CandidatureAvecProjet = Candidature & {
  projet: {
    id: string;
    nom: string;
    brl: number;
    description?: string;
    secteur?: string;
    region?: string;
    statut?: string;
    entrepreneur?: { id: string; nom: string };
    // Champs universels supplémentaires
    createdAt?: string;
    equipe?: number;
  };
};

export function useCandidaturesOffre(offreId: string, enabled = true) {
  return useQuery<CandidatureAvecProjet[]>({
    queryKey: investisseurKeys.candidaturesOffre(offreId),
    queryFn: () =>
      apiClient
        .get('/financements/candidatures-recues', { params: { offreId } })
        .then((r) => r.data),
    enabled: !!offreId && enabled,
    staleTime: 1000 * 60,
  });
}

// ─── Changer statut d'une candidature ────────────────────────────────────────

export function useChangerStatutCandidature() {
  const qc = useQueryClient();

  return useMutation<
    Candidature,
    Error,
    { candidatureId: string; statut: StatutCandidature; offreId: string }
  >({
    mutationFn: ({ candidatureId, statut }) =>
      apiClient
        .patch(`/financements/candidatures/${candidatureId}/statut`, { statut })
        .then((r) => r.data),
    onSuccess: (_, { offreId }) => {
      qc.invalidateQueries({
        queryKey: investisseurKeys.candidaturesOffre(offreId),
      });
    },
  });
}
