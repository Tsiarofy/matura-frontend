// src/routes/__root.tsx
import { createRootRoute, Outlet,redirect } from '@tanstack/react-router'

export const Route = createRootRoute({
beforeLoad: ({ location }) => {
    // Si l'utilisateur arrive sur la racine "/", on le redirige vers le login
    if (location.pathname === '/') {
      throw redirect({
        to: '/register',   // ← change en /(auths)/login si ton dossier s'appelle (auths)
      })
    }
  },

  component: () => (
    <div className="min-h-screen bg-gray-200">
      <Outlet />
    </div>
  ),
})