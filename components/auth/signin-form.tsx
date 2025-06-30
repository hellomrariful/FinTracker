'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BarChart3, Eye, EyeOff, Info } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { signIn } from '@/lib/supabase/auth';

export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { user, error } = await signIn({ email, password });
      
      if (error) {
        toast.error(error.message);
        return;
      }

      if (user) {
        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    if (emailInput) emailInput.value = 'demo@fintracker.com';
    if (passwordInput) passwordInput.value = 'fintracker123';
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
          <BarChart3 className="h-7 w-7 text-primary-foreground" />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to your Fintracker account
        </p>
      </div>

      {/* Demo Mode Banner */}
      <div className="mt-6 bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-primary mb-2">Demo Mode Active</h3>
            <div className="space-y-1 text-sm text-foreground">
              <div key="demo-text-1"><strong>Any credentials work!</strong> Try the demo account:</div>
              <div key="demo-text-2"><strong>Email:</strong> demo@fintracker.com</div>
              <div key="demo-text-3"><strong>Password:</strong> fintracker123</div>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-3 text-xs"
              onClick={fillDemoCredentials}
            >
              Use Demo Credentials
            </Button>
          </div>
        </div>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1"
              placeholder="Enter any email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="pr-10"
                placeholder="Enter any password"
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
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <Label htmlFor="remember-me" className="ml-2 text-sm">
              Remember me
            </Label>
          </div>

          <Link
            href="/auth/reset-password"
            className="text-sm font-medium text-primary hover:text-primary/90"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>

        {/* Removed Google OAuth button */}
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link
          href="/auth/signup"
          className="font-medium text-primary hover:text-primary/90"
        >
          Sign up for free
        </Link>
      </p>
    </div>
  );
}