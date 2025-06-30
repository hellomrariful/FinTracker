import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';

export const metadata = {
  title: 'Dashboard - Fintracker',
  description: 'Your financial overview and insights',
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}