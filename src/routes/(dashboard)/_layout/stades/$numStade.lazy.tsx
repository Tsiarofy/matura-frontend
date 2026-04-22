import { createLazyFileRoute } from '@tanstack/react-router'

import StadePage from './$numStade.page'
export const Route = createLazyFileRoute('/(dashboard)/_layout/stades/$numStade')({
  component: StadePage,
})


