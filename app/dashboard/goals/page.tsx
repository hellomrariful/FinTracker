import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GoalsClient } from './client-goals';

export const metadata = {
  title: 'Goals - Fintracker',
  description: 'Set and track your financial goals',
};

export default function GoalsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <GoalsClient />
      </DashboardLayout>
    </ProtectedRoute>
  );
}