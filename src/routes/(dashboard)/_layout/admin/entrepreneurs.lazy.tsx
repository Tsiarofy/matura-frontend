import { createLazyFileRoute } from '@tanstack/react-router'
import EntrepreneursPage from './entrepreneurs.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/admin/entrepreneurs')({
  component: EntrepreneursPage,
})
