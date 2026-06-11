import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  candidatureId: z.string().optional(),
  offreId: z.string().optional(),
})

export const Route = createFileRoute(
  '/(dashboard)/_layout/projets-a-financer/$projetId',
)({
  validateSearch: (search) => searchSchema.parse(search),
})
