import { Suspense } from "react";
import { ClientIncome } from "./client-income";
import { DashboardSkeleton } from "@/components/loading-skeletons";

export default async function IncomePage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const showAddDialog = params?.add === "true";

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ClientIncome initialShowAddDialog={!!showAddDialog} />
    </Suspense>
  );
}
