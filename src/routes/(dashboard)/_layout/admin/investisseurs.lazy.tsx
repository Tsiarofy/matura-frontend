import { createLazyFileRoute } from '@tanstack/react-router'
import InvestisseursPage from './investisseurs.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/admin/investisseurs')({
  component: InvestisseursPage,
})
