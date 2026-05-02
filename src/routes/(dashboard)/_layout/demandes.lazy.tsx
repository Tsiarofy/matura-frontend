import { createLazyFileRoute } from '@tanstack/react-router'
import DemandesPage from './demandes.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/demandes')({
  component: DemandesPage,
})
