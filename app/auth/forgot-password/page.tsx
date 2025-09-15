import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata = {
  title: 'Forgot Password - Fintracker',
  description: 'Reset your Fintracker account password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14">
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <ForgotPasswordForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}