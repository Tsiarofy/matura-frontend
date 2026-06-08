import { createLazyFileRoute } from '@tanstack/react-router'
import DefinirMissionsPage from './definir-missions.page'

export const Route = createLazyFileRoute(
  '/(dashboard)/_layout/projets/$projetId/stades/$numStade/definir-missions',
)({
  component: DefinirMissionsPage,
})
