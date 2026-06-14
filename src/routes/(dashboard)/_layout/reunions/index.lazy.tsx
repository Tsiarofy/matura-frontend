import { createLazyFileRoute } from '@tanstack/react-router'
import ReunionsPage from './index.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout/reunions/')({
  component: ReunionsPage,
})
