import { createLazyFileRoute } from '@tanstack/react-router'
import CreerFormationPage from './creer.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/mes-formations/creer')({
  component: CreerFormationPage,
})
