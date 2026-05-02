// maturproj-frontend/src/hooks/useGeo.ts
// Hook de chargement des données géographiques depuis l'API.
// Pattern identique à useStades.ts : apiClient + @tanstack/react-query
// Source de vérité : table donnees_geographiques (Prisma : DonneesGeographiques)

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'

export interface ZoneItem {
  code: string
  nom: string
}

export interface StatistiquesZone {
  population_2018: number
  projection_actuelle: number
  nb_fokontany: number
}

export interface SousZones {
  tout_selectionner: boolean
  items: ZoneItem[]
}

// ── Toutes les régions Madagascar (22 régions) ───────────────────────────────
// Utilisé comme point d'entrée du GeoSelector (niveau REGION)
export function useRegions() {
  return useQuery<ZoneItem[]>({
    queryKey: ['geo', 'regions'],
    queryFn: async () => {
      const { data } = await apiClient.get<ZoneItem[]>('/geo/regions')
      return data
    },
    staleTime: 60 * 60 * 1000, // 1h — données géo très stables
  })
}

// ── Zones enfants d'une zone parente ─────────────────────────────────────────
// niveau=REGION,   code=<code_region>   → retourne les districts
// niveau=DISTRICT, code=<code_district> → retourne les communes
// niveau=COMMUNE,  code=<code_commune>  → retourne les fokontany
// niveau=FOKONTANY                      → retourne [] (terminal, désactivé)
export function useEnfantsGeo(niveau: string, code: string) {
  return useQuery<ZoneItem[]>({
    queryKey: ['geo', 'enfants', niveau, code],
    queryFn: async () => {
      const { data } = await apiClient.get<ZoneItem[]>('/geo/enfants', {
        params: { niveau, code },
      })
      return data
    },
    // Ne charge que si une zone parente est sélectionnée et que ce n'est pas un niveau terminal
    enabled: !!niveau && !!code && niveau !== 'FOKONTANY',
    staleTime: 60 * 60 * 1000,
  })
}

// ── Calcul de population en temps réel ─────────────────────────────────────────
// Retourne les statistiques de population pour une zone donnée
// Utilisé dans GeoSelector pour afficher la population lors de la sélection
export function usePopulationCalcul(
  niveau: string,
  code: string,
  sousZones: SousZones
) {
  return useQuery<StatistiquesZone>({
    queryKey: ['geo', 'population', niveau, code, JSON.stringify(sousZones)],
    queryFn: async () => {
      const { data } = await apiClient.post<StatistiquesZone>('/geo/population', {
        niveau,
        code,
        sousZones,
      })
      return data
    },
    enabled: !!niveau && !!code,
    staleTime: 60 * 60 * 1000,
  })
}
