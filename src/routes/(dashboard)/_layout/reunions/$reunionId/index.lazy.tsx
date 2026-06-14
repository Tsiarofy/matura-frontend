import { createLazyFileRoute } from '@tanstack/react-router';
import ReunionDetailPage from './index.page';

export const Route = createLazyFileRoute('/(dashboard)/_layout/reunions/$reunionId/')({
  component: ReunionDetailPage,
});
