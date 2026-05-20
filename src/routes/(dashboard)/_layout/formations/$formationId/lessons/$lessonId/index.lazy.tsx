import { createLazyFileRoute } from '@tanstack/react-router'
import LessonViewerPage from './index.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/formations/$formationId/lessons/$lessonId/')({
  component: LessonViewerPage,
})
