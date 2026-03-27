'use client';

import { useEffect, useState } from 'react';
import { StoreSettings } from '@/types';
import { settingsService } from '@/services/settings';
import { AdminPageHeader } from './admin-page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Save, Store, Wallet, Truck } from 'lucide-react';

export function AdminSettingsContent() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    settingsService.getSettings().then(setSettings).finally(() => setIsLoading(false));
  }, []);

  const update = (key: keyof StoreSettings, value: string | number) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    setSuccess(false);
    try {
      await settingsService.updateSettings(settings);
      setSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) return <div className="space-y-4"><Skeleton className="h-8 w-40" /><Skeleton className="h-96 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Settings" description="Manage store configuration" />

      {success && <Alert variant="success">Settings saved successfully!</Alert>}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Store info */}
        <Card padding="lg">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Store className="h-4 w-4 text-primary" /> Store Information</h3>
          <div className="space-y-4">
            <Input label="Store Name" value={settings.storeName} onChange={(e) => update('storeName', e.target.value)} />
            <Input label="Email" value={settings.storeEmail} onChange={(e) => update('storeEmail', e.target.value)} />
            <Input label="Phone" value={settings.storePhone} onChange={(e) => update('storePhone', e.target.value)} />
            <Input label="Address" value={settings.storeAddress} onChange={(e) => update('storeAddress', e.target.value)} />
          </div>
        </Card>

        {/* Payment */}
        <Card padding="lg">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" /> Payment Settings</h3>
          <div className="space-y-4">
            <Input label="bKash Merchant Number" value={settings.bkashMerchant} onChange={(e) => update('bkashMerchant', e.target.value)} />
            <Input label="Nagad Merchant Number" value={settings.nagadMerchant} onChange={(e) => update('nagadMerchant', e.target.value)} />
            <Input label="Rocket Merchant Number" value={settings.rocketMerchant} onChange={(e) => update('rocketMerchant', e.target.value)} />
          </div>
        </Card>

        {/* Delivery */}
        <Card padding="lg">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Delivery Settings</h3>
          <div className="space-y-4">
            <Input label="Delivery Charge (BDT)" type="number" value={settings.deliveryCharge} onChange={(e) => update('deliveryCharge', Number(e.target.value))} />
            <Input label="Free Delivery Threshold (BDT)" type="number" value={settings.freeDeliveryThreshold} onChange={(e) => update('freeDeliveryThreshold', Number(e.target.value))} />
            <Input label="Currency Symbol" value={settings.currencySymbol} onChange={(e) => update('currencySymbol', e.target.value)} />
          </div>
        </Card>
      </div>

      <Button onClick={handleSave} isLoading={isSaving} size="lg">
        <Save className="h-4 w-4" /> Save Settings
      </Button>
    </div>
  );
}
