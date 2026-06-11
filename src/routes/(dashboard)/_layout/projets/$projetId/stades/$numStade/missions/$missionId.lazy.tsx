import { createLazyFileRoute } from '@tanstack/react-router'
import MissionDetailPage from './$missionId.page'

export const Route = createLazyFileRoute(
  '/(dashboard)/_layout/projets/$projetId/stades/$numStade/missions/$missionId',
)({
  component: MissionDetailPage,
})
