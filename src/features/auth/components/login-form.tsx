'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validators';
import { authService } from '@/services/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { ShieldCheck, LogIn } from 'lucide-react';

const demoAccounts = [
  { label: 'Admin', email: 'admin@pharmacy.com', password: 'admin123' },
  { label: 'Customer (Rahim)', email: 'rahim@gmail.com', password: '123456' },
  { label: 'Customer (Fatema)', email: 'fatema@gmail.com', password: '123456' },
];

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setError('');
    try {
      const session = await authService.login(data);
      if (session.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <LogIn className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your PharmaNest account</p>
      </div>

      <Card padding="lg">
        {error && (
          <Alert variant="danger" className="mb-4">{error}</Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">Create Account</Link>
        </div>
      </Card>

      {/* Demo accounts */}
      <Card padding="md" className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Demo Accounts</span>
        </div>
        <div className="space-y-2">
          {demoAccounts.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => fillDemo(acc.email, acc.password)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left"
            >
              <span className="font-medium">{acc.label}</span>
              <span className="text-muted-foreground font-mono">{acc.email}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
