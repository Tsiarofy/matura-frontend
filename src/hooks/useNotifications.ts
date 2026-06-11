import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'

export interface NotificationItem {
  id: string
  utilisateur_id: string
  type: string
  titre: string
  corps: string
  lien_relatif: string | null
  lue: boolean
  cree_le: string
}

export function useNotifications() {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await apiClient.get('/notifications/miennes')
      return data
    },
    refetchInterval: 30_000, // Polling toutes les 30s
  })
}

export function useNonLues() {
  return useQuery<{ count: number }>({
    queryKey: ['notifications-count'],
    queryFn: async () => {
      const { data } = await apiClient.get('/notifications/miennes/non-lues')
      return data
    },
    refetchInterval: 30_000,
  })
}

export function useMarquerToutesLues() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await apiClient.patch('/notifications/miennes/tout-lire')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.invalidateQueries({ queryKey: ['notifications-count'] })
    },
  })
}

export function useMarquerLue() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/notifications/${id}/lire`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.invalidateQueries({ queryKey: ['notifications-count'] })
    },
  })
}
