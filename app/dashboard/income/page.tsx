import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export const metadata = {
  title: 'Income - Fintracker',
  description: 'Track and manage your income sources',
};

export default function IncomePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Income</h1>
            <p className="mt-2 text-muted-foreground">
              Track and manage all your income sources and revenue streams.
            </p>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Income Management</h2>
          <p className="text-muted-foreground">
            This page is under development. Income tracking features will be available soon.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}