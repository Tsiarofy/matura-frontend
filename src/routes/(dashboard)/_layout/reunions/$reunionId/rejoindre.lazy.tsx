import { createLazyFileRoute } from '@tanstack/react-router'
import RejoindrePage from './rejoindre.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/reunions/$reunionId/rejoindre')({
  component: RejoindrePage,
})
