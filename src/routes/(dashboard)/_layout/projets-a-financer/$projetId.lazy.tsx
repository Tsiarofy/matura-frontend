import { createLazyFileRoute } from '@tanstack/react-router'
import FicheProjetInvestisseurPage from './$projetId.page'

export const Route = createLazyFileRoute(
  '/(dashboard)/_layout/projets-a-financer/$projetId',
)({ component: FicheProjetInvestisseurPage })
