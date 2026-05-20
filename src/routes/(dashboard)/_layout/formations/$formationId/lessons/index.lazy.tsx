import { createLazyFileRoute } from '@tanstack/react-router'
import FormationLessonPage from "./index.page"


export const Route = createLazyFileRoute(
  '/(dashboard)/_layout/formations/$formationId/lessons/',
)({
  component: FormationLessonPage,
})



