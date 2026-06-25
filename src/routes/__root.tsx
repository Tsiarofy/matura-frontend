import { createRootRoute, Outlet,redirect } from '@tanstack/react-router'

export const Route = createRootRoute({
beforeLoad: ({ location }) => {
    // Si l'utilisateur arrive sur la racine "/", on le redirige vers le login
    if (location.pathname === '/') {
      throw redirect({
        to: '/login',   
      })
    }
  },

  component: () => (
    <div className="min-h-screen bg-[var(--color-bg-app)]">
      <Outlet />
    </div>
  ),
})
