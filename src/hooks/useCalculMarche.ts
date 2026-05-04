import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'

interface CalculMarcheParams {
  typeClient: 'B2C' | 'B2B'
  codeZone: string
  niveauZone: string
  pctUtilisateurs: number
  partsConcurrents: Array<{ nom: string; part_globale_pct: number; part_zone_pct: number }>
  tam_valeur: number
  sam_valeur: number
  som_valeur: number
}

interface CalculMarcheResult {
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
}

export function useCalculMarche(params: CalculMarcheParams) {
  return useQuery({
    queryKey: ['calcul-marche', params],
    queryFn: async (): Promise<CalculMarcheResult> => {
      const response = await apiClient.post('/geo/calcul-marche', params)
      return response.data
    },
    enabled: !!params.codeZone && !!params.niveauZone,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
