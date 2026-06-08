import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { type CreationProjetDto, type ProjetDetail } from '@matura/shared'
import { apiClient } from '@/lib/apiClient'
import { toast } from 'sonner'

/**
 * Hook pour créer un nouveau projet
 * - Appelle POST /api/projets
 * - Invalide le cache pour forcer un rafraîchissement
 * - Redirige vers le nouveau projet
 */

export function useCreateProjet() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (dto: CreationProjetDto): Promise<ProjetDetail> => {
      const response = await apiClient.post<ProjetDetail>('/projets', dto)
      return response.data
    },

    onSuccess: (projet) => {
      // 1. On dit à React Query que la liste 'projets' n'est plus à jour
      queryClient.invalidateQueries({ queryKey: ['projets'] })

      // 2. Notification de succès
      toast.success('Projet créé avec succès', {
        description: `${projet.titre} a été créé. Commencez par le Stade 1.`,
      })

      // 3. Redirection immédiate
      navigate({
        to: '/projets/$projetId',
        params: { projetId: projet.id },
      })
    },

    onError: (error:any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création'
      toast.error('Erreur', { description: message })
    },
  })
}