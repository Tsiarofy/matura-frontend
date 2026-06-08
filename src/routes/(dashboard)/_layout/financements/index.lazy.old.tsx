import { createFileRoute } from '@tanstack/react-router'
import FinancementsPage from './index.page'

export const Route = createFileRoute('/(dashboard)/_layout/financements/index/lazy/old')({
  component: FinancementsPage,
})
