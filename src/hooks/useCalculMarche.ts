// maturproj-frontend/src/hooks/useCalculMarche.ts
// Moteur de calcul marché 100% côté client — latence 0ms, aucun appel API.
//
// Ce hook est le cœur de la refonte Stade 3. Il :
// 1. Distingue B2C (GeoService → population auto) de B2B/B2B2C (saisie manuelle)
// 2. Calcule la part de marché occupée, le marché libre, et les ratios SAM/SOM
// 3. Génère des alertes de réalisme BRL (seuils 5% et 20% du marché libre)
// 4. Retourne un objet conforme à CalculsStade3Schema (typage strict Zod)
//
// Performance : useMemo garantit que les calculs ne sont refaits que lorsque
// les inputs changent — pas de re-render superflu, pas de requête réseau.

import { useMemo } from 'react'
import type { CalculsStade3 } from '@matura/shared'

/**
 * Hook de calcul marché temps réel (0ms latency).
 *
 * @param typeCible - Type de marché cible du projet (B2B, B2C, B2B2C)
 * @param baseTotale - Population GeoService (B2C) ou estimation manuelle (B2B/B2B2C)
 * @param partsConcurrents - Tableau des parts de marché concurrents (en %)
 * @param samValeur - Valeur SAM déclarée par l'entrepreneur
 * @param somValeur - Valeur SOM déclarée par l'entrepreneur (objectif An 1)
 *
 * @returns CalculsStade3 | null — null si baseTotale n'est pas définie
 */
export function useCalculMarche(
  typeCible: 'B2B' | 'B2C' | 'B2B2C',
  baseTotale: number,
  partsConcurrents: number[],
  samValeur: number,
  somValeur: number
): CalculsStade3 | null {
  return useMemo(() => {
    if (!baseTotale || baseTotale <= 0) return null

    // 1. Marché occupé par les concurrents
    const totalPartsConcurrents = partsConcurrents.reduce((acc, pct) => acc + (pct || 0), 0)
    const occupee = Math.round((baseTotale * Math.min(totalPartsConcurrents, 100)) / 100)

    // 2. Marché disponible (libre)
    const disponible = Math.max(baseTotale - occupee, 0)

    // 3. Ratios SAM/SOM en % du marché disponible
    const samPctDispo = disponible > 0 ? (samValeur / disponible) * 100 : 0
    const somPctDispo = disponible > 0 ? (somValeur / disponible) * 100 : 0

    // 4. Alertes de réalisme BRL
    const alertes: string[] = []
    if (somPctDispo > 20) {
      alertes.push('Objectif An 1 irréaliste (>20% du marché libre).')
    } else if (somPctDispo > 5) {
      alertes.push("Objectif An 1 très ambitieux. Risque d'exécution élevé.")
    }

    // Si le SAM dépasse le marché disponible
    if (samPctDispo > 100) {
      alertes.push('Le SAM dépasse le marché disponible — vérifiez vos hypothèses.')
    }

    return {
      type_cible: typeCible,
      base_totale: baseTotale,
      source_base: typeCible === 'B2C' ? 'GEOSERVICE' : 'DECLARATIF',
      occupee_concurrents: occupee,
      disponible,
      sam_pct_disponible: Math.round(samPctDispo * 100) / 100,
      som_pct_disponible: Math.round(somPctDispo * 100) / 100,
      alertes_ignorees: alertes,
    } satisfies CalculsStade3
  }, [typeCible, baseTotale, partsConcurrents, samValeur, somValeur])
}
