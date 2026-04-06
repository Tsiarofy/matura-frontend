// src/routes/index.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router'
import IndexRedirect from './andex.page'
export const Route = createLazyFileRoute('/andex')({
  component: IndexRedirect
})