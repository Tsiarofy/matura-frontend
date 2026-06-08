import { createLazyFileRoute } from '@tanstack/react-router'
import CandidaturesOffrePage from './candidatures.page'

export const Route = createLazyFileRoute(
  '/(dashboard)/_layout/mes-financements/$offreId/candidatures',
)({
  component: CandidaturesOffrePage,
})
