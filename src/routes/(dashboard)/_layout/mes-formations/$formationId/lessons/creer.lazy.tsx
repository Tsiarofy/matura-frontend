import { createLazyFileRoute } from '@tanstack/react-router'
import CreerLessonPage from './creer.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/mes-formations/$formationId/lessons/creer')({
  component: CreerLessonPage,
})
