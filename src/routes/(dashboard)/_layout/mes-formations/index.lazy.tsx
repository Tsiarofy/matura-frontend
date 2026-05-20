import { createLazyFileRoute } from '@tanstack/react-router'
import MesFormationsPage from './index.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/mes-formations/')({
  component: MesFormationsPage,
})
