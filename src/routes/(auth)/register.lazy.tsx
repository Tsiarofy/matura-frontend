// src/routes/(auth)/register.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router'
import RegisterPage from './register.page'   // ← on importe le composant

export const Route = createLazyFileRoute('/(auth)/register')({
  component: RegisterPage,
})