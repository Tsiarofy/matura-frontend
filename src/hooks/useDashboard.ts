import { useProjets } from '@/hooks/useProjets'
import { useProjetDetail, useEvaluationsProjet } from '@/hooks/useStades'
import { useMesCandidatures } from '@/hooks/useFinancements'
import { STADE_LABELS } from '@/lib/constants'
import { useProjetsSuivis, useDemandesMentor } from '@/hooks/useAccompagnement'
import { useMesOffres, type CandidatureAvecProjet } from '@/hooks/useInvestisseur'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'

// ─── Types exportés ───────────────────────────────────────────────────────────

export interface StadeDashboard {
  numero: number
  label: string
  statut: string
  completion_pct: number
  score_auto: number | null
}

export interface StatsDashboardEntrepreneur {
  nb_projets: number
  nb_candidatures: number
  nb_candidatures_acceptees: number
  nb_candidatures_en_attente: number
  // projet actif uniquement (pour les graphiques)
  nb_stades_valides: number
  nb_stades_soumis: number
  nb_stades_total: number
  score_global: number | null
  note_moyenne: number | null
  nb_evaluations: number
  brl_actuel: number
}

export interface EvenementActivite {
  id: string
  type: 'STADE_VALIDE' | 'STADE_SOUMIS' | 'EVALUATION' | 'CANDIDATURE' | 'MENTOR' | 'MISSION_SOUMISE' | 'CANDIDATURE_RECUE' | 'MISSION_VALIDEE' | 'MISSION_REJETEE' | 'DEMANDE_ACCEPTEE' | 'DEMANDE_REFUSEE'
  label: string
  date: string
}

// ─── Hook principal Entrepreneur ──────────────────────────────────────────────

export function useDashboardEntrepreneur() {
  // 1. Tous les projets de l'entrepreneur (pour la liste "Mon projet")
  const allProjetsQuery = useProjets({ page: 1, limite: 100 })
  const allProjets = allProjetsQuery.data?.projets ?? []

  // 2. Projet actif = premier de la liste (pour les graphiques de performance)
  const projet = allProjets[0] ?? null
  const projetId = projet?.id ?? ''

  // 3. Détail complet du projet actif (stades, score, mentor)
  const detailQuery = useProjetDetail(projetId)
  const detail = detailQuery.data ?? null

  // 4. Évaluations reçues pour le projet actif
  const evalsQuery = useEvaluationsProjet(projetId)
  const evaluations = evalsQuery.data ?? []

  // 5. Toutes les candidatures envoyées (agrégé global)
  const candidaturesQuery = useMesCandidatures()
  const candidatures = candidaturesQuery.data ?? []

  // ── Calculs locaux ────────────────────────────────────────────────────────
  // console.log("- - - LOGGER DANS LE HOOKS - - -");
  // console.log("detail", detail?.stades[0]);
  const stades: StadeDashboard[] = (detail?.stades ?? []).map((s) => ({
    numero: s.numero,
    label: STADE_LABELS[s.numero] ?? `Stade ${s.numero}`,
    statut: s.statut,
    completion_pct: s.completion_pct,
    score_auto: s.score_auto ?? null,
  }))

  const nb_stades_valides = stades.filter((s) => s.statut === 'VALIDE').length
  const nb_stades_soumis  = stades.filter((s) => s.statut === 'SOUMIS').length

  const note_moyenne =
    evaluations.length > 0
      ? evaluations.reduce((acc, e) => acc + e.note, 0) / evaluations.length
      : null

  // Stats agrégées globales (toutes les stats du compte)
  const nb_candidatures_acceptees = candidatures.filter((c) => c.statut === 'ACCEPTEE').length
  const nb_candidatures_en_attente = candidatures.filter((c) => c.statut === 'EN_ATTENTE').length

  const stats: StatsDashboardEntrepreneur = {
    // ── Global (toutes données confondues) ───────────────────────────────
    nb_projets: allProjets.length,
    nb_candidatures: candidatures.length,
    nb_candidatures_acceptees,
    nb_candidatures_en_attente,
    // ── Projet actif (pour les graphiques seulement) ─────────────────────
    nb_stades_valides,
    nb_stades_soumis,
    nb_stades_total: 7,
    score_global: detail?.score?.score_global ?? null,
    note_moyenne,
    nb_evaluations: evaluations.length,
    brl_actuel: detail?.brl_actuel ?? projet?.brl_actuel ?? 0,
  }

  // ── Activité récente (reconstituée depuis les dates) ─────────────────────

  const evenements: EvenementActivite[] = []

  stades.forEach((s) => {
    const stadeDetail = detail?.stades.find((sd) => sd.numero === s.numero)
    if (!stadeDetail) return

    if (s.statut === 'VALIDE' && stadeDetail.valide_le) {
      evenements.push({
        id: `valide-${s.numero}`,
        type: 'STADE_VALIDE',
        label: `Stade ${s.numero} — ${s.label} validé`,
        date: stadeDetail.valide_le,
      })
    } else if (s.statut === 'SOUMIS' && stadeDetail.soumis_le) {
      evenements.push({
        id: `soumis-${s.numero}`,
        type: 'STADE_SOUMIS',
        label: `Stade ${s.numero} — ${s.label} soumis pour évaluation`,
        date: stadeDetail.soumis_le,
      })
    }
  })

  evaluations.slice(0, 3).forEach((e) => {
    evenements.push({
      id: `eval-${e.id}`,
      type: 'EVALUATION',
      label: `Évaluation reçue — Note ${e.note}/5 par ${e.mentor.prenom} ${e.mentor.nom}`,
      date: e.cree_le,
    })
  })

  candidatures.slice(0, 2).forEach((c) => {
    evenements.push({
      id: `cand-${c.id}`,
      type: 'CANDIDATURE',
      label:
        c.statut === 'ACCEPTEE'
          ? `Candidature acceptée — ${c.offre.titre}`
          : `Candidature envoyée — ${c.offre.titre}`,
      date: c.createdAt ?? new Date().toISOString(),
    })
  })

  // Trier par date décroissante, garder 5 max
  const activite = evenements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return {
    isLoading: allProjetsQuery.isLoading || detailQuery.isLoading,
    isError: allProjetsQuery.isError || detailQuery.isError,
    projet,        // projet actif (pour graphiques)
    allProjets,    // tous les projets (pour la liste)
    detail,
    stades,
    stats,
    activite,
    candidatures,
  }
}

// ─── Hook Mentor ─────────────────────────────────────────────────────────────

export interface StatsDashboardMentor {
  nb_projets_suivis: number
  nb_en_attente_evaluation: number
  nb_demandes_attente: number
}

export function useDashboardMentor() {
  const projetsQuery = useProjetsSuivis()
  const demandesQuery = useDemandesMentor({ statut: 'EN_ATTENTE' })

  const projetsSuivis = projetsQuery.data ?? []
  const demandes = demandesQuery.data?.demandes ?? []

  const nb_en_attente_evaluation = projetsSuivis.filter(
    (p) => p.stade_actif?.en_attente_evaluation
  ).length

  const stats: StatsDashboardMentor = {
    nb_projets_suivis: projetsSuivis.length,
    nb_en_attente_evaluation,
    nb_demandes_attente: demandes.length,
  }

  // Activité récente mentor
  const evenements: EvenementActivite[] = []

  projetsSuivis.forEach((p) => {
    if (p.stade_actif?.en_attente_evaluation) {
      evenements.push({
        id: `attente-eval-${p.id}`,
        type: 'STADE_SOUMIS',
        label: `${p.proprietaire.prenom} ${p.proprietaire.nom} a soumis le stade ${p.stade_actif.numero} de "${p.titre}"`,
        date: p.maj_le,
      })
    }
  })

  demandes.forEach((d) => {
    evenements.push({
      id: `demande-recue-${d.id}`,
      type: 'MENTOR',
      label: `Demande d'accompagnement reçue pour "${d.projet?.titre}"`,
      date: d.cree_le,
    })
  })

  const activite = evenements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return {
    isLoading: projetsQuery.isLoading || demandesQuery.isLoading,
    isError: projetsQuery.isError || demandesQuery.isError,
    projetsSuivis,
    demandes,
    stats,
    activite,
  }
}

// ─── Hook Investisseur ────────────────────────────────────────────────────────

export interface StatsDashboardInvestisseur {
  nb_offres_actives: number
  nb_candidatures_recues: number
  nb_candidatures_en_attente: number
  nb_projets_finances: number
}

export function useDashboardInvestisseur() {
  const offresQuery = useMesOffres()
  
  // Requête globale pour récupérer toutes les candidatures reçues par l'investisseur
  const candidaturesQuery = useQuery<CandidatureAvecProjet[]>({
    queryKey: ['investisseur', 'candidatures-recues-toutes'],
    queryFn: async () => {
      const { data } = await apiClient.get('/financements/candidatures-recues')
      return data
    },
    staleTime: 60 * 1000,
  })

  const offres = offresQuery.data ?? []
  const candidatures = candidaturesQuery.data ?? []

  const nb_offres_actives = offres.filter((o) => o.statut === 'OUVERTE').length
  const nb_candidatures_recues = candidatures.length
  const nb_candidatures_en_attente = candidatures.filter((c) => c.statut === 'EN_ATTENTE').length
  const nb_projets_finances = candidatures.filter((c) => c.statut === 'ACCEPTEE').length

  const stats: StatsDashboardInvestisseur = {
    nb_offres_actives,
    nb_candidatures_recues,
    nb_candidatures_en_attente,
    nb_projets_finances,
  }

  // Pipeline des candidatures pour le graphe
  const pipeline = {
    EN_ATTENTE: candidatures.filter((c) => c.statut === 'EN_ATTENTE').length,
    EN_ANALYSE: candidatures.filter((c) => c.statut === 'EN_REVUE').length,
    ACCEPTE: candidatures.filter((c) => c.statut === 'ACCEPTEE').length,
    REFUSE: candidatures.filter((c) => c.statut === 'REJETEE').length,
  }

  // Activité récente investisseur
  const evenements: EvenementActivite[] = []

  candidatures.forEach((c) => {
    evenements.push({
      id: `candidature-recue-${c.id}`,
      type: 'CANDIDATURE',
      label: `Nouvelle candidature de "${c.projet.titre}" pour l'offre "${c.offre.titre}"`,
      date: c.createdAt ?? new Date().toISOString(),
    })
  })

  offres.forEach((o) => {
    evenements.push({
      id: `offre-creee-${o.id}`,
      type: 'STADE_VALIDE', // Réutiliser type valide pour un icône de succès vert
      label: `Offre de financement "${o.titre}" créée`,
      date: o.createdAt ?? new Date().toISOString(),
    })
  })

  const activite = evenements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return {
    isLoading: offresQuery.isLoading || candidaturesQuery.isLoading,
    isError: offresQuery.isError || candidaturesQuery.isError,
    offres,
    candidatures,
    stats,
    pipeline,
    activite,
  }
}

