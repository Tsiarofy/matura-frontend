import { createLazyFileRoute } from '@tanstack/react-router'
import MentorLessonViewerPage from './index.page'

export const Route = createLazyFileRoute(
  '/(dashboard)/_layout/mes-formations/$formationId/lessons/$lessonId/'
)({
  component: MentorLessonViewerPage,
})
