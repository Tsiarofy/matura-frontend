import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface DocumentEv {
  id: string;
  stade_id: string;
  nom: string;
  url: string;
  type_fichier: string;
  description?: string | null;
  type_preuve?: string | null;
  taille_octets?: number | null;
  uploade_le: string;
}

export function useDocuments(stadeId: string) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['documents', stadeId],
    queryFn: async () => {
      const { data } = await apiClient.get<DocumentEv[]>(`/documents/stade/${stadeId}`);
      return data;
    },
    enabled: !!stadeId,
  });

  const uploadDoc = useMutation({
    mutationFn: async (vars: { file: File; description?: string; type_preuve?: string }) => {
      const formData = new FormData();
      formData.append('file', vars.file);
      if (vars.description) formData.append('description', vars.description);
      if (vars.type_preuve) formData.append('type_preuve', vars.type_preuve);

      const { data } = await apiClient.post<DocumentEv>(`/documents/stade/${stadeId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents', stadeId] });
    },
  });

  const deleteDoc = useMutation({
    mutationFn: async (docId: string) => {
      await apiClient.delete(`/documents/${docId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents', stadeId] });
    },
  });

  return {
    documents: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    uploadDoc,
    deleteDoc,
  };
}
