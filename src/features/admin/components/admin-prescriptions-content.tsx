'use client';

import { useEffect, useState } from 'react';
import { Prescription, PrescriptionStatus } from '@/types';
import { adminPrescriptionService } from '@/services/admin';
import { formatDate } from '@/lib/utils';
import { AdminPageHeader } from './admin-page-header';
import { Tabs, Tab } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PrescriptionStatusBadge } from '@/components/prescription/prescription-status-badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { FileText, Check, X, HelpCircle } from 'lucide-react';

const tabs: Tab[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'needs_clarification', label: 'Needs Info' },
];

export function AdminPrescriptionsContent() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [reviewTarget, setReviewTarget] = useState<Prescription | null>(null);
  const [note, setNote] = useState('');
  const [isActioning, setIsActioning] = useState(false);

  const load = async () => {
    const data = await adminPrescriptionService.getAllPrescriptions();
    setPrescriptions(data);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = activeTab === 'all' ? prescriptions : prescriptions.filter((p) => p.status === activeTab);

  const handleAction = async (action: 'approve' | 'reject' | 'clarify') => {
    if (!reviewTarget) return;
    setIsActioning(true);
    try {
      if (action === 'approve') await adminPrescriptionService.approvePrescription(reviewTarget.id, note || undefined);
      else if (action === 'reject') await adminPrescriptionService.rejectPrescription(reviewTarget.id, note || 'Rejected by pharmacist');
      else await adminPrescriptionService.requestClarification(reviewTarget.id, note || 'Additional information needed');
      setReviewTarget(null);
      setNote('');
      load();
    } finally {
      setIsActioning(false);
    }
  };

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}</div>;

  return (
    <div>
      <AdminPageHeader title="Prescriptions" description="Review uploaded prescriptions" />
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />

      {filtered.length === 0 ? (
        <EmptyState icon={<FileText className="h-12 w-12" />} title="No prescriptions" description={`No ${activeTab === 'all' ? '' : activeTab} prescriptions found`} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead className="hidden sm:table-cell">Doctor</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <p className="font-medium text-sm">{p.patientName}</p>
                  <p className="text-xs text-muted-foreground">{p.fileName}</p>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{p.doctorName}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{formatDate(p.createdAt)}</TableCell>
                <TableCell><PrescriptionStatusBadge status={p.status} /></TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => { setReviewTarget(p); setNote(p.pharmacistNote || ''); }}>
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Review modal */}
      <Modal isOpen={!!reviewTarget} onClose={() => setReviewTarget(null)} title="Review Prescription" size="lg">
        {reviewTarget && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Patient:</span> <span className="font-medium">{reviewTarget.patientName}</span></div>
              <div><span className="text-muted-foreground">Doctor:</span> <span className="font-medium">{reviewTarget.doctorName}</span></div>
              <div><span className="text-muted-foreground">Issue Date:</span> <span className="font-medium">{reviewTarget.issueDate}</span></div>
              <div><span className="text-muted-foreground">File:</span> <span className="font-medium">{reviewTarget.fileName}</span></div>
              {reviewTarget.orderId && <div className="col-span-2"><span className="text-muted-foreground">Linked Order:</span> <span className="font-mono font-medium">{reviewTarget.orderId}</span></div>}
            </div>
            {reviewTarget.notes && (
              <div className="text-sm"><span className="text-muted-foreground">Patient Notes:</span> <p className="mt-1">{reviewTarget.notes}</p></div>
            )}
            <Textarea label="Pharmacist Note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Add a note..." />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleAction('approve')} isLoading={isActioning} className="bg-secondary hover:bg-secondary/90">
                <Check className="h-4 w-4" /> Approve
              </Button>
              <Button variant="danger" onClick={() => handleAction('reject')} isLoading={isActioning}>
                <X className="h-4 w-4" /> Reject
              </Button>
              <Button variant="outline" onClick={() => handleAction('clarify')} isLoading={isActioning}>
                <HelpCircle className="h-4 w-4" /> Needs Clarification
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
