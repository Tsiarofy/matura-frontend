import { createLazyFileRoute } from '@tanstack/react-router'
import FormationRedirectPage from './index.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/formations/$formationId/')({
  component: FormationRedirectPage,
})
