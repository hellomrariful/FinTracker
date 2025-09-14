import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { BudgetsClient } from './client-budgets';

export const metadata = {
  title: 'Budgets - Fintracker',
  description: 'Manage your financial budgets and spending limits',
};

export default function BudgetsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <BudgetsClient />
      </DashboardLayout>
    </ProtectedRoute>
  );
}