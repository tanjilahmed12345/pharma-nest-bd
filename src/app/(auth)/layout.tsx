import { Logo } from '@/components/common/logo';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-14 flex items-center px-4 border-b border-border bg-header-bg">
        <Logo />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
        <p>&copy; {new Date().getFullYear()} PharmaNest BD. <Link href="/" className="text-primary hover:underline">Back to Store</Link></p>
      </footer>
    </div>
  );
}
