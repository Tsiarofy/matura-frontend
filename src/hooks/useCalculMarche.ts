// src/hooks/useCalculMarche.ts
// Hook de calcul de marché pour le Stade 3 (B2C/B2B)
// Retourne les 9 champs spec IEME/BRL + champs affichage frontend

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'

interface SousZones {
  tout_selectionner: boolean
  items: Array<{ code: string; nom: string }>
}


interface CalculMarcheParams {
  typeClient: 'B2C' | 'B2B'
  codeZone: string
  niveauZone: string,
  sousZone:SousZones,
  pctUtilisateurs: number
  partsConcurrents: Array<{ nom: string; part_globale_pct: number; part_zone_pct: number }>
  tam_valeur: number
  sam_valeur: number
  som_valeur: number
}

// Type aligné sur la spec Section 3.2 (9 champs exacts) + champs UI
export interface CalculMarcheResult {
  // ── Champs affichage frontend (AffichageCalculMarche) ──────────────────
  population_totale: number
  population_concernee: number
  parts_concurrents_zone_pct: number
  population_occupee_concurrents: number
  population_disponible: number
  sam_pct_utilisateurs: number
  sam_pct_population_totale: number
  som_pct_utilisateurs: number
  som_pct_population_totale: number
  alertes: string[]
  niveau_alerte: 'VERT' | 'ORANGE' | 'ROUGE'
  // ── 9 champs CalculsInformatifs spec (Section 3.2) ─────────────────────
  base_totale: number
  source_base: 'GEOSERVICE' | 'DECLARATIF'
  occupee_concurrents: number
  disponible: number
  sam_pct_totale: number
  sam_pct_disponible: number
  som_pct_totale: number
  som_pct_disponible: number
  alertes_ignorees: string[]
}

type StatistiquesZone = {
  population_2018: number
  projection_actuelle: number
  nb_fokontany: number
}

function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

function safeNum(n: unknown): number {
  return typeof n === 'number' && Number.isFinite(n) ? n : 0
}

function calculerAlertesSpec(params: { sam_pct_disponible: number; som_pct_disponible: number }) {
  const alertes: string[] = []
  let niveau_alerte: 'VERT' | 'ORANGE' | 'ROUGE' = 'VERT'

  if (params.sam_pct_disponible > 80) {
    alertes.push(
      `SAM irréaliste : représente ${params.sam_pct_disponible.toFixed(1)}% de la population libre (>80%). Revoyez vos hypothèses.`,
    )
    niveau_alerte = 'ROUGE'
  }

  if (params.som_pct_disponible > 20) {
    alertes.push(
      `Objectif An 1 irréaliste : SOM représente ${params.som_pct_disponible.toFixed(1)}% du marché libre (>20%).`,
    )
    niveau_alerte = 'ROUGE'
  } else if (params.som_pct_disponible > 5) {
    alertes.push(
      `Objectif An 1 très ambitieux : SOM représente ${params.som_pct_disponible.toFixed(1)}% du marché libre (>5%). Risque d'exécution élevé.`,
    )
    if (niveau_alerte === 'VERT') niveau_alerte = 'ORANGE'
  }

  return { alertes, niveau_alerte }
}

function calculerMarcheLocal(params: CalculMarcheParams, statsZone: StatistiquesZone): CalculMarcheResult {
  // B2B = déclaratif : la base totale correspond au TAM saisi
  if (params.typeClient === 'B2B') {
    const tam = safeNum(params.tam_valeur)
    const sam = safeNum(params.sam_valeur)
    const som = safeNum(params.som_valeur)
    const base_totale = tam
    const disponible = tam
    const sam_pct_totale = base_totale > 0 ? (sam / base_totale) * 100 : 0
    const som_pct_totale = base_totale > 0 ? (som / base_totale) * 100 : 0

    const { alertes, niveau_alerte } = calculerAlertesSpec({
      sam_pct_disponible: sam_pct_totale,
      som_pct_disponible: som_pct_totale,
    })

    return {
      population_totale: 0,
      population_concernee: 0,
      parts_concurrents_zone_pct: 0,
      population_occupee_concurrents: 0,
      population_disponible: 0,
      sam_pct_utilisateurs: 0,
      sam_pct_population_totale: 0,
      som_pct_utilisateurs: 0,
      som_pct_population_totale: 0,
      alertes,
      niveau_alerte,
      base_totale,
      source_base: 'DECLARATIF',
      occupee_concurrents: 0,
      disponible,
      sam_pct_totale,
      sam_pct_disponible: sam_pct_totale,
      som_pct_totale,
      som_pct_disponible: som_pct_totale,
      // IMPORTANT: géré côté UI entrepreneur (persistance), pas auto
      alertes_ignorees: [],
    }
  }

  // B2C = GeoService : on prend la population INSTAT comme base_totale
  const population_totale = safeNum(statsZone.population_2018)
  const pctUtilisateurs = clampPct(params.pctUtilisateurs)
  const population_concernee = Math.round((population_totale * pctUtilisateurs) / 100)

  const parts_concurrents_zone_pct = (params.partsConcurrents ?? []).reduce(
    (sum, c) => sum + safeNum(c.part_zone_pct),
    0,
  )
  const population_occupee_concurrents = Math.round((population_totale * parts_concurrents_zone_pct) / 100)
  const population_disponible = population_totale - population_occupee_concurrents

  const sam_valeur = safeNum(params.sam_valeur)
  const som_valeur = safeNum(params.som_valeur)

  const sam_pct_utilisateurs = population_concernee > 0 ? (sam_valeur / population_concernee) * 100 : 0
  const sam_pct_population_totale = population_totale > 0 ? (sam_valeur / population_totale) * 100 : 0
  const som_pct_utilisateurs = population_concernee > 0 ? (som_valeur / population_concernee) * 100 : 0
  const som_pct_population_totale = population_totale > 0 ? (som_valeur / population_totale) * 100 : 0

  const base_totale = population_totale
  const disponible = population_disponible
  const sam_pct_totale = sam_pct_population_totale
  const som_pct_totale = som_pct_population_totale
  const sam_pct_disponible = disponible > 0 ? (sam_valeur / disponible) * 100 : 0
  const som_pct_disponible = disponible > 0 ? (som_valeur / disponible) * 100 : 0

  const { alertes, niveau_alerte } = calculerAlertesSpec({ sam_pct_disponible, som_pct_disponible })

  return {
    population_totale,
    population_concernee,
    parts_concurrents_zone_pct,
    population_occupee_concurrents,
    population_disponible,
    sam_pct_utilisateurs,
    sam_pct_population_totale,
    som_pct_utilisateurs,
    som_pct_population_totale,
    alertes,
    niveau_alerte,
    base_totale,
    source_base: 'GEOSERVICE',
    occupee_concurrents: population_occupee_concurrents,
    disponible,
    sam_pct_totale,
    sam_pct_disponible,
    som_pct_totale,
    som_pct_disponible,
    // IMPORTANT: géré côté UI entrepreneur (persistance), pas auto
    alertes_ignorees: [],
  }
}
export function useCalculMarche(params: CalculMarcheParams) {
  // const enabled = !!params.codeZone && !!params.niveauZone
  // const enabled=false;
  return useQuery<CalculMarcheResult>({
    queryKey: ['calcul-marche', params],
    queryFn: async (): Promise<CalculMarcheResult> => {
      try {
        console.log("Lancement du calcul de marché avec params:", params)
        console.log("Lancement du calcul de marché avec params:", params.codeZone)
        console.log("Niveau de zone:", params.niveauZone)
        console.log("Sous-zones:", params.sousZone)
        console.log("- - - - - FIN- - - - - - - - ")

        const stats = await apiClient.post<StatistiquesZone>('/geo/population',{ code: params.codeZone, niveau: params.niveauZone, sousZones: params.sousZone }
        )
        console.log("Stats de population reçues du GeoService:", stats.data)
        return calculerMarcheLocal(params, stats.data)
      } catch (error) {
        // Log d'erreur spécifique ici
        console.error("Erreur API Population:", error)
        throw error // Important : TanStack Query a besoin que l'erreur soit "jetée"
      }
    },
    // enabled,
    staleTime: 5 * 60 * 1000,
  })
}
