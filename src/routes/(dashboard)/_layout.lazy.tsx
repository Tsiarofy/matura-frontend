import { createLazyFileRoute } from '@tanstack/react-router'
import DashboardLayout from './_layout.page'

export const Route = createLazyFileRoute('/(dashboard)/_layout')({
  component: DashboardLayout
})

