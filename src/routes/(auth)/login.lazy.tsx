import { createLazyFileRoute } from '@tanstack/react-router'
import LoginPage from './login.page'   // ← on importe le composant

export const Route = createLazyFileRoute('/(auth)/login')({
  component:LoginPage,
})

