import { createLazyFileRoute } from '@tanstack/react-router'
import StadeNumPage from './$numStade.page'

// Route : /projets/:projetId/stades/:numStade
// Fichier physique : src/routes/(dashboard)/_layout/projets/$projetId/stades/$numStade.lazy.tsx
export const Route = createLazyFileRoute(
  '/(dashboard)/_layout/projets/$projetId/stades/$numStade',
)({
  component: StadeNumPage,
})
