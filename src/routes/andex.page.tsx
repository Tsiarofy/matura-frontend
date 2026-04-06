import { redirect } from '@tanstack/react-router'

export default function IndexRedirect() {
  throw redirect({ to: '/register' })
}