'use client';

import { useEffect, useState } from 'react';
import { PaymentSubmission, PaymentStatus } from '@/types';
import { adminPaymentService } from '@/services/admin';
import { formatPrice, formatDate } from '@/lib/utils';
import { PAYMENT_STATUS_LABELS } from '@/lib/constants';
import { AdminPageHeader } from './admin-page-header';
import { Tabs, Tab } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusPill } from '@/components/common/status-pill';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Wallet, Check, X } from 'lucide-react';

const tabs: Tab[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'verified', label: 'Verified' },
  { id: 'rejected', label: 'Rejected' },
];

const methodLabels: Record<string, string> = { bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', cod: 'COD' };

export function AdminPaymentsContent() {
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [reviewTarget, setReviewTarget] = useState<PaymentSubmission | null>(null);
  const [note, setNote] = useState('');
  const [isActioning, setIsActioning] = useState(false);

  const load = async () => {
    const data = await adminPaymentService.getAllPayments();
    setPayments(data);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = activeTab === 'all' ? payments : payments.filter((p) => p.status === activeTab);

  const handleVerify = async () => {
    if (!reviewTarget) return;
    setIsActioning(true);
    try {
      await adminPaymentService.verifyPayment(reviewTarget.id, note || undefined);
      setReviewTarget(null);
      setNote('');
      load();
    } finally { setIsActioning(false); }
  };

  const handleReject = async () => {
    if (!reviewTarget) return;
    setIsActioning(true);
    try {
      await adminPaymentService.rejectPayment(reviewTarget.id, note || 'Payment rejected');
      setReviewTarget(null);
      setNote('');
      load();
    } finally { setIsActioning(false); }
  };

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}</div>;

  return (
    <div>
      <AdminPageHeader title="Payments" description="Verify wallet payment submissions" />
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />

      {filtered.length === 0 ? (
        <EmptyState icon={<Wallet className="h-12 w-12" />} title="No payments found" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Method</TableHead>
              <TableHead className="hidden sm:table-cell">Sender</TableHead>
              <TableHead className="hidden md:table-cell">TxnID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Badge variant="primary">{methodLabels[p.method] || p.method}</Badge>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(p.createdAt)}</p>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm font-mono">{p.senderNumber || '-'}</TableCell>
                <TableCell className="hidden md:table-cell text-sm font-mono">{p.transactionId || '-'}</TableCell>
                <TableCell className="font-medium text-sm">{formatPrice(p.amount)}</TableCell>
                <TableCell><StatusPill status={p.status} label={PAYMENT_STATUS_LABELS[p.status] || p.status} /></TableCell>
                <TableCell>
                  {(p.status === PaymentStatus.PENDING || p.status === PaymentStatus.SUBMITTED) && (
                    <Button variant="outline" size="sm" onClick={() => { setReviewTarget(p); setNote(''); }}>Review</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={!!reviewTarget} onClose={() => setReviewTarget(null)} title="Review Payment">
        {reviewTarget && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Method:</span> <span className="font-medium">{methodLabels[reviewTarget.method]}</span></div>
              <div><span className="text-muted-foreground">Amount:</span> <span className="font-medium">{formatPrice(reviewTarget.amount)}</span></div>
              <div><span className="text-muted-foreground">Sender:</span> <span className="font-mono">{reviewTarget.senderNumber || '-'}</span></div>
              <div><span className="text-muted-foreground">Txn ID:</span> <span className="font-mono">{reviewTarget.transactionId || '-'}</span></div>
            </div>
            <Textarea label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
            <div className="flex gap-2">
              <Button onClick={handleVerify} isLoading={isActioning} className="bg-secondary hover:bg-secondary/90">
                <Check className="h-4 w-4" /> Verify
              </Button>
              <Button variant="danger" onClick={handleReject} isLoading={isActioning}>
                <X className="h-4 w-4" /> Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
