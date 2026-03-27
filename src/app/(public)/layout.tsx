import { StoreLayoutShell } from '@/components/layout/store-layout-shell';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <StoreLayoutShell>{children}</StoreLayoutShell>;
}
