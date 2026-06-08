// (dashboard)/_layout.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { authStore } from '@/stores/authStore'

export const Route = createFileRoute('/(dashboard)/_layout')({
  beforeLoad: () => {
    const isAuthenticated = authStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  // On pointe vers le fichier lazy pour le rendu
})