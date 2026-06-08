import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute(
  '/(dashboard)/_layout/financements/mes-financements/misplaced/bak/mes-financements/candidatures',
)({
  component: () =>
    import('./candidatures.page').then((m) => m.default),
});
