import axios from 'axios';
import { authStore } from '@/stores/authStore';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';  

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
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

// 2. Intercepteur de Réponse : Gère le rafraîchissement
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Vérifie si c'est une 401 et qu'on n'a pas déjà essayé de rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // APPEL AU REFRESH
        // Note : On utilise axios (l'instance globale) ou on évite l'intercepteur 
        // pour ne pas boucler si le refresh lui-même renvoie 401
        const { data } = await axios.post(`${BASE_URL}/api/auth/rafraichir`, {}, { withCredentials: true });
        console.log(data)

        // Mise à jour du store Zustand
        authStore.getState().setToken(data.token);

        // Mise à jour de la requête initiale et relance
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si le rafraîchissement échoue (Refresh Token expiré ou invalide)
        authStore.getState().logout(); // Nettoie le store
        window.location.href = '/login'; // Redirige l'utilisateur
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { apiClient };