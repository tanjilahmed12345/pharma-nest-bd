import { StoreLayoutShell } from '@/components/layout/store-layout-shell';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <StoreLayoutShell>{children}</StoreLayoutShell>;
}
