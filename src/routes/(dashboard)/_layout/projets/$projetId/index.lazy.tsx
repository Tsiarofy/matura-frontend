import { createLazyFileRoute } from '@tanstack/react-router'
import projetPage from './index.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/projets/$projetId/')({
  component: projetPage,
})

