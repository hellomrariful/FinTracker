import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VerifyEmailForm } from '@/components/auth/verify-email-form';

export const metadata = {
  title: 'Verify Email - Fintracker',
  description: 'Verify your email address to activate your Fintracker account',
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14">
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <Suspense fallback={<div>Loading...</div>}>
              <VerifyEmailForm />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}