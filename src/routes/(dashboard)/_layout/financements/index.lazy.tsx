import { createLazyFileRoute } from '@tanstack/react-router'
import FinancementsPage from './index.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/financements/')({
  component: FinancementsPage,
})
