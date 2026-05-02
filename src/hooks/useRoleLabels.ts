// maturproj-frontend/src/hooks/useRoleLabels.ts
// Lexique adaptatif selon le rôle de l'utilisateur connecté.
//
// Objectif : Adapter le vocabulaire de l'interface selon que l'utilisateur est :
// - ENTREPRENEUR : formulation guidée, pédagogique ("Quel problème résolvez-vous ?")
// - MENTOR/INVESTISSEUR : formulation professionnelle, analytique ("Problem Statement")
//
// Ce hook lit le rôle depuis le `authStore` (Zustand) et retourne un objet
// de labels typés. Il est conçu pour être extensible à tous les stades.

import { useMemo } from 'react'
import { authStore } from '@/stores/authStore'

// ─── DÉFINITION DES LABELS PAR STADE ─────────────────────────────

interface StadeLabels {
  // Stade 1
  enonce_probleme: string
  profil_affecte: string
  intensite_probleme: string
  observations_terrain: string
  solutions_existantes: string
  contexte_geographique: string
  // Stade 2
  proposition_valeur: string
  segments_clients: string
  canaux: string
  avantage_unique: string
  sources_revenus: string
  structure_couts: string
  // Stade 3
  taille_marche: string
  enquete: string
  concurrents: string
  positionnement_prix: string
  base_marche_label: string
  som_label: string
  sam_label: string
  // Stade 4
  evolution_canvas: string
  // Stade 5
  equipe: string
  finances: string
  jalons: string
  // Stade 6
  mvp: string
  retours_clients: string
  iterations: string
  // Stade 7
  resume_executif: string
  demande_financement: string
  contexte_investisseur: string
}

const LABELS_ENTREPRENEUR: StadeLabels = {
  // Stade 1
  enonce_probleme: 'Quel problème résolvez-vous ?',
  profil_affecte: 'Qui est affecté par ce problème ?',
  intensite_probleme: 'Quelle est l\'intensité du problème ?',
  observations_terrain: 'Qu\'avez-vous observé sur le terrain ?',
  solutions_existantes: 'Quelles solutions existent déjà ?',
  contexte_geographique: 'Où se situe votre marché ?',
  // Stade 2
  proposition_valeur: 'Quelle est votre proposition de valeur ?',
  segments_clients: 'Qui sont vos clients cibles ?',
  canaux: 'Comment allez-vous les atteindre ?',
  avantage_unique: 'Qu\'est-ce qui vous rend unique ?',
  sources_revenus: 'Comment allez-vous gagner de l\'argent ?',
  structure_couts: 'Quels sont vos coûts principaux ?',
  // Stade 3
  taille_marche: 'Quelle est la taille de votre marché ?',
  enquete: 'Qu\'avez-vous appris de votre enquête terrain ?',
  concurrents: 'Qui sont vos concurrents ?',
  positionnement_prix: 'Quel prix allez-vous pratiquer ?',
  base_marche_label: 'Taille de votre marché cible',
  som_label: 'Objectif de ventes An 1 (SOM)',
  sam_label: 'Marché que vous pouvez réellement servir (SAM)',
  // Stade 4
  evolution_canvas: 'Qu\'est-ce qui a changé depuis votre Lean Canvas ?',
  // Stade 5
  equipe: 'Qui compose votre équipe ?',
  finances: 'Vos projections financières',
  jalons: 'Vos prochaines étapes clés',
  // Stade 6
  mvp: 'Décrivez votre MVP',
  retours_clients: 'Qu\'ont dit vos premiers utilisateurs ?',
  iterations: 'Comment avez-vous itéré ?',
  // Stade 7
  resume_executif: 'Votre résumé exécutif',
  demande_financement: 'De combien avez-vous besoin ?',
  contexte_investisseur: 'Pourquoi investir maintenant ?',
}

const LABELS_PROFESSIONNEL: StadeLabels = {
  // Stade 1
  enonce_probleme: 'Problem Statement',
  profil_affecte: 'Profil des utilisateurs affectés',
  intensite_probleme: 'Intensité du problème',
  observations_terrain: 'Validation terrain',
  solutions_existantes: 'Analyse des solutions existantes',
  contexte_geographique: 'Contexte géographique',
  // Stade 2
  proposition_valeur: 'Proposition de valeur unique (UVP)',
  segments_clients: 'Segments clients',
  canaux: 'Stratégie d\'acquisition',
  avantage_unique: 'Avantage concurrentiel',
  sources_revenus: 'Modèle de revenus',
  structure_couts: 'Structure de coûts',
  // Stade 3
  taille_marche: 'Dimensionnement marché (TAM/SAM/SOM)',
  enquete: 'Résultats d\'enquête quantitative',
  concurrents: 'Cartographie concurrentielle',
  positionnement_prix: 'Positionnement prix & IRP',
  base_marche_label: 'Base de marché total (TAM)',
  som_label: 'SOM — Marché réaliste An 1',
  sam_label: 'SAM — Marché adressable',
  // Stade 4
  evolution_canvas: 'Évolution du Business Model Canvas',
  // Stade 5
  equipe: 'Composition de l\'équipe',
  finances: 'Analyse de faisabilité financière',
  jalons: 'Plan d\'action & jalons',
  // Stade 6
  mvp: 'Minimum Viable Product',
  retours_clients: 'Feedback utilisateurs (NPS/rétention)',
  iterations: 'Cycle d\'itérations produit',
  // Stade 7
  resume_executif: 'Executive Summary',
  demande_financement: 'Demande de financement',
  contexte_investisseur: 'Thèse d\'investissement',
}

/**
 * Hook retournant les labels adaptés au rôle de l'utilisateur.
 * - ENTREPRENEUR → Labels pédagogiques (questions guidées)
 * - MENTOR / INVESTISSEUR / ADMIN → Labels professionnels (terminologie métier)
 */
export function useRoleLabels(): StadeLabels {
  const role = authStore((state) => state.utilisateur?.role)

  return useMemo(() => {
    if (role === 'ENTREPRENEUR') {
      return LABELS_ENTREPRENEUR
    }
    return LABELS_PROFESSIONNEL
  }, [role])
}

// Export du type pour usage dans les composants
export type { StadeLabels }
