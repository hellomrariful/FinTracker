import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SigninForm } from '@/components/auth/signin-form';

export const metadata = {
  title: 'Sign In - Fintracker',
  description: 'Sign in to your Fintracker account',
};

export default function SigninPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14">
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <SigninForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}