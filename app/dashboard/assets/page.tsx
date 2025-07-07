import { Suspense } from 'react';
import { ClientAssets } from './client-assets';
import { DashboardSkeleton } from '@/components/loading-skeletons';

export default function AssetsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ClientAssets />
    </Suspense>
  );
}