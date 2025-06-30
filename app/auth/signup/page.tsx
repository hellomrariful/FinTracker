import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata = {
  title: 'Sign Up - Fintracker',
  description: 'Create your Fintracker account',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14">
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <SignupForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}