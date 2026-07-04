import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

// -- Types
export interface AdminStats {
  nb_entrepreneurs: number;
  nb_mentors_approuves: number;
  nb_mentors_en_attente: number;
  nb_investisseurs_approuves: number;
  nb_investisseurs_en_attente: number;
  nb_projets: number;
  nb_projets_diplomes: number;
}

export interface AdminUser {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  statut_compte: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE' | 'SUSPENDU';
  profil: any;
  cree_le: string;
  url_avatar: string | null;
  _count?: {
    projets_possedes: number;
  };
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/stats');
      return data;
    },
  });
}

export function useAdminMentors() {
  return useQuery<AdminUser[]>({
    queryKey: ['admin', 'mentors'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/mentors');
      return data;
    },
  });
}

export function useAdminInvestisseurs() {
  return useQuery<AdminUser[]>({
    queryKey: ['admin', 'investisseurs'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/investisseurs');
      return data;
    },
  });
}

export function useAdminEntrepreneurs() {
  return useQuery<AdminUser[]>({
    queryKey: ['admin', 'entrepreneurs'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/entrepreneurs');
      return data;
    },
  });
}

export function useMajStatutCompte() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: 'APPROUVE' | 'REJETE' | 'SUSPENDU' }) => {
      const { data } = await apiClient.patch(`/admin/utilisateurs/${id}/statut`, { statut });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'mentors'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'investisseurs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}
