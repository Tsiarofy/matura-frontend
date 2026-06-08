import { createLazyFileRoute } from '@tanstack/react-router'
import ProjetsAFinancerPage from './index.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/projets-a-financer/')({
  component: ProjetsAFinancerPage,
})
