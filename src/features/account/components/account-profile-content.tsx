'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks';
import { userService } from '@/services/user';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { User, LogOut, Save } from 'lucide-react';

export function AccountProfileContent() {
  const { session, userId } = useCurrentUser();
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    userService.getUserById(userId).then((user) => {
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone);
      }
      setIsLoading(false);
    });
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    setSuccess(false);
    try {
      const updated = await userService.updateUser(userId, { name, phone });
      // Sync auth session
      if (session) {
        setSession({ ...session, name: updated.name });
      }
      setSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-40" /><Skeleton className="h-60 rounded-xl" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <Card padding="lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg">{name}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        {success && <Alert variant="success" className="mb-4">Profile updated successfully!</Alert>}

        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" value={email} disabled hint="Email cannot be changed" />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />

          <Button type="submit" isLoading={isSaving}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </form>
      </Card>

      <Card padding="lg">
        <h3 className="text-base font-semibold mb-2">Account Actions</h3>
        <Button variant="danger" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </Card>
    </div>
  );
}
