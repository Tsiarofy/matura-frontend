import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {type UtilisateurPublic} from '@matura/shared'

// interface UtilisateurPublic {
//   id: string;
//   prenom: string;
//   email?: string;
//   role: RoleUtilisateur
// }

interface AuthState {
  token: string | null;
  utilisateur: UtilisateurPublic | null;
  isAuthenticated: boolean;
  refresh_token:string|null

  setAuth: (token: string, utilisateur: UtilisateurPublic) => void;
  setToken: (token: string) => void;
  logout: () => void;

  // // Compatibilité minimale pour les appels existants de refresh token
  // setRefreshToken: (refreshToken: string | null) => void;
  // loadStoredRefreshToken: () => string | null;
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      utilisateur: null,
      isAuthenticated: false,
      refresh_token:null,

      // Appelé lors de la connexion réussie
      setAuth: (token, utilisateur) => set({token,utilisateur, isAuthenticated: true }),

      setToken: (token) => set({ token }),

      logout: () => set({ token: null, utilisateur: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // Nom de la clé dans le localStorage
    }
  )
);