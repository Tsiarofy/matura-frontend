import { useQuery } from '@tanstack/react-query'
import { type ProjetResume } from '@matura/shared'
import { apiClient } from '@/lib/apiClient'

// On garde les interfaces pour le typage TypeScript
interface GetProjetsParams {
  statut?: string
  page?: number
  limite?: number
}

interface GetProjetsResponse {
  projets: ProjetResume[]
  total: number
  page: number
  pages: number
}

/**
 * Hook pour récupérer la liste des projets
 * - Gestion du cache et des états (loading/error) via TanStack Query
 * - Requêtes via apiClient (Axios)
 */
export function useProjets(params: GetProjetsParams = { page: 1, limite: 5 }) {
  return useQuery({
    // La clé de requête inclut les paramètres. 
    // Si la page ou le statut change, React Query relance l'appel automatiquement.
    queryKey: ['projets', params],
    
    queryFn: async (): Promise<GetProjetsResponse> => {
      // On retire les setLoading/setError de Zustand
      try {
      const response = await apiClient.get<GetProjetsResponse>('/projets/mes-projets', {
        params,
      })
      
      return response.data
      } catch (error:any) {
        console.error('Erreur lors de la récupération des projets:', error)
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des projets')
      }

    },
    
    // Options de cache
    staleTime: 5 * 60 * 1000, // Les données sont considérées "fraîches" pendant 5 min
    retry: 0,                 // Tentatives automatiques en cas d'échec réseau
  })
}