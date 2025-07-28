import { Suspense } from "react";
import { ClientExpenses } from "./client-expenses";
import { DashboardSkeleton } from "@/components/loading-skeletons";

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const showAddDialog = params?.add === "true";

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ClientExpenses initialShowAddDialog={!!showAddDialog} />
    </Suspense>
  );
}
