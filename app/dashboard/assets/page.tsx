import { Suspense } from "react";
import { ClientAssets } from "./client-assets";
import { DashboardSkeleton } from "@/components/loading-skeletons";

export default async function AssetsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const showAddDialog = params?.add === "true";

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ClientAssets initialShowAddDialog={!!showAddDialog} />
    </Suspense>
  );
}
