import { createLazyFileRoute } from '@tanstack/react-router'
import FinancementDetailPage from './$financementId.page'

export const Route = createLazyFileRoute(
  '/(dashboard)/_layout/financements/$financementId',
)({
  component: FinancementDetailPage,
})
