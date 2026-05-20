import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const filtresSchema = z.object({
  page: z.number().min(1).optional(),
})

export const Route = createFileRoute('/(dashboard)/_layout/mes-formations/')({
  validateSearch: filtresSchema,
})
