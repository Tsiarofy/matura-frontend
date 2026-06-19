import { createLazyFileRoute } from '@tanstack/react-router'
import NotificationsPage from './index.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/notifications/')({
  component: NotificationsPage,
})
