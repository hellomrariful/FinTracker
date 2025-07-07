import { Suspense } from 'react';
import { ClientAssets } from './client-assets';
import { DashboardSkeleton } from '@/components/loading-skeletons';

export default function AssetsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const showAddDialog = searchParams?.add === 'true';

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ClientAssets initialShowAddDialog={!!showAddDialog} />
    </Suspense>
  );
}