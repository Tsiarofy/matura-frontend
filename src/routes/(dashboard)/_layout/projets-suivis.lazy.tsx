import { createLazyFileRoute } from '@tanstack/react-router'
import ProjetsSuivisPage from './projets-suivis.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/projets-suivis')({
  component: ProjetsSuivisPage,
})
