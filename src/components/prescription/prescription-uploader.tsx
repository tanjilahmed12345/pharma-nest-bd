'use client';

import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PrescriptionUploaderProps {
  onSubmit: (data: {
    patientName: string;
    doctorName: string;
    issueDate: string;
    notes: string;
    fileName: string;
  }) => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export function PrescriptionUploader({ onSubmit, isLoading, errors }: PrescriptionUploaderProps) {
  const [fileName, setFileName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ patientName, doctorName, issueDate, notes, fileName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Upload area */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Prescription Image/PDF</label>
        <label
          className={cn(
            'flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
            fileName ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/50'
          )}
        >
          <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
          {fileName ? (
            <div className="flex items-center gap-2 text-primary">
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">{fileName}</span>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setFileName(''); }}
                className="p-0.5 hover:bg-primary/10 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">JPG, PNG or PDF (max 5MB)</p>
            </>
          )}
        </label>
        {errors?.fileName && <p className="mt-1 text-xs text-danger">{errors.fileName}</p>}
      </div>

      <Input
        label="Patient Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        placeholder="Enter patient name"
        error={errors?.patientName}
      />

      <Input
        label="Doctor Name"
        value={doctorName}
        onChange={(e) => setDoctorName(e.target.value)}
        placeholder="Enter doctor name"
        error={errors?.doctorName}
      />

      <Input
        label="Issue Date"
        type="date"
        value={issueDate}
        onChange={(e) => setIssueDate(e.target.value)}
        error={errors?.issueDate}
      />

      <Textarea
        label="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any additional information..."
        rows={3}
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        <Upload className="h-4 w-4" />
        Upload Prescription
      </Button>
    </form>
  );
}
