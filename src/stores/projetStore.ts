import { create } from 'zustand'
import {type ProjetResume,type ProjetDetail } from '@matura/shared'

export interface ProjetStore {
  // État
  projets: ProjetResume[]
  projetActuel: ProjetDetail | null
  isLoading: boolean
  error: string | null

  // Pagination
  page: number
  total: number
  pages: number

  // Actions
  setProjets: (projets: ProjetResume[], pagination: { total: number; page: number; pages: number }) => void
  setProjetActuel: (projet: ProjetDetail | null) => void
  ajouterProjet: (projet: ProjetResume) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  projets: [],
  projetActuel: null,
  isLoading: false,
  error: null,
  page: 1,
  total: 0,
  pages: 0,
}

export const useProjetStore = create<ProjetStore>((set) => ({
  ...initialState,

  setProjets: (projets, pagination) =>
    set({
      projets,
      total: pagination.total,
      page: pagination.page,
      pages: pagination.pages,
      isLoading: false,
      error: null,
    }),

  setProjetActuel: (projet) =>
    set({
      projetActuel: projet,
      isLoading: false,
      error: null,
    }),

  ajouterProjet: (projet) =>
    set((state) => ({
      projets: [projet, ...state.projets],
      total: state.total + 1,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  reset: () => set(initialState),
}))
