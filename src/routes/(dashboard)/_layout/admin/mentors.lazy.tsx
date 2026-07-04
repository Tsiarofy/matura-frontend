import { createLazyFileRoute } from '@tanstack/react-router'
import MentorsPage from './mentors.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/admin/mentors')({
  component: MentorsPage,
})
