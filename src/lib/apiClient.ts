import axios from 'axios';
import { authStore } from '@/stores/authStore';
import { toast } from 'sonner';

export const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;  


const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 300000, // 5 minutes (300000ms) pour éviter les erreurs d'upload vidéo (canceled après 10s)
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 1. Intercepteur de Requête : Ajoute le token automatiquement
apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// 2. Intercepteur de Réponse : Gère le rafraîchissement
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!error.response) {
      toast.error("Erreur réseau", { description: "Impossible de contacter le serveur. Vérifiez votre connexion." });
    }
    const originalRequest = error.config;

    // Gère si c'est une 401 et qu'on n'a pas déjà essayé de rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/api/auth/rafraichir`, {}, { withCredentials: true })
          .then(({ data }) => {
            authStore.getState().setToken(data.token);
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            processQueue(null, data.token);
            resolve(apiClient(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            authStore.getState().logout();
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(error);
  }
);

export { apiClient };