import { createLazyFileRoute } from '@tanstack/react-router'
import MesFinancementsPage from './index.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/mes-financements/')({
  component: MesFinancementsPage,
})
