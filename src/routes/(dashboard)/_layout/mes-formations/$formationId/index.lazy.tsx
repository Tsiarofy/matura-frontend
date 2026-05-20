import { createLazyFileRoute } from '@tanstack/react-router'
import MesFormationsDetailPage from './index.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/mes-formations/$formationId/')({
  component: MesFormationsDetailPage,
})
