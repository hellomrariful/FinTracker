'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BarChart3, Eye, EyeOff, Info, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { signUp } from '@/lib/supabase/auth';

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const company = formData.get('company') as string;

    try {
      const { user, error } = await signUp({
        email,
        password,
        firstName,
        lastName,
        company
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }

      if (user) {
        toast.success('Account created successfully! You are now signed in.');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
          <BarChart3 className="h-7 w-7 text-primary-foreground" />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Start your 30-day free trial today
        </p>
      </div>

      {/* Judging Process Notice */}
      <div className="mt-6 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-1">Judging Process Notice</h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              For the judging process, we have temporarily stopped user validation. Any information will work to create an account.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Mode Banner */}
      <div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-primary mb-2">Demo Mode Active</h3>
            <div className="space-y-1 text-sm text-foreground">
              <div key="signup-demo-text-1"><strong>Any information works!</strong> Or use the demo account:</div>
              <div key="signup-demo-text-2"><strong>Email:</strong> demo@fintracker.com</div>
              <div key="signup-demo-text-3"><strong>Password:</strong> fintracker123</div>
            </div>
            <Link href="/auth/signin">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-3 text-xs"
              >
                Use Demo Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="mt-1"
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="mt-1"
                placeholder="Doe"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1"
              placeholder="john@company.com"
            />
          </div>
          <div>
            <Label htmlFor="company">Company name</Label>
            <Input
              id="company"
              name="company"
              type="text"
              required
              className="mt-1"
              placeholder="Your company"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="pr-10"
                placeholder="Create a password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Any password works in demo mode
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <Label htmlFor="terms" className="ml-2 text-sm">
            I agree to the{' '}
            <Link href="/terms" className="text-primary hover:text-primary/90">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:text-primary/90">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>

        {/* Removed Google OAuth button and separator */}
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/auth/signin"
          className="font-medium text-primary hover:text-primary/90"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}