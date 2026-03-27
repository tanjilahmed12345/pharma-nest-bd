'use client';

import { useEffect, useState } from 'react';
import { Category } from '@/types';
import { adminProductService } from '@/services/admin';
import { AdminPageHeader } from './admin-page-header';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function AdminCategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    const cats = await adminProductService.getCategories();
    setCategories(cats);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditingId(null);
    setFormName('');
    setFormDesc('');
    setFormActive(true);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormDesc(cat.description);
    setFormActive(cat.isActive);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setIsSaving(true);
    try {
      if (editingId) {
        await adminProductService.updateCategory(editingId, { name: formName, description: formDesc, isActive: formActive });
      } else {
        await adminProductService.createCategory({
          name: formName,
          slug: formName.toLowerCase().replace(/\s+/g, '-'),
          description: formDesc,
          image: '',
          isActive: formActive,
          sortOrder: categories.length + 1,
        });
      }
      setShowForm(false);
      load();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await adminProductService.deleteCategory(id);
    load();
  };

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}</div>;

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description={`${categories.length} categories`}
        actions={<Button size="sm" onClick={openNew}><Plus className="h-4 w-4" /> Add Category</Button>}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>
                <p className="font-medium text-sm">{cat.name}</p>
                {cat.description && <p className="text-xs text-muted-foreground line-clamp-1">{cat.description}</p>}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-xs font-mono text-muted-foreground">{cat.slug}</TableCell>
              <TableCell><Badge variant={cat.isActive ? 'success' : 'default'}>{cat.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}><Trash2 className="h-3.5 w-3.5 text-danger" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <Input label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
          <Textarea label="Description" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2} />
          <Checkbox label="Active" checked={formActive} onChange={(e) => setFormActive((e.target as HTMLInputElement).checked)} />
          <div className="flex gap-2">
            <Button onClick={handleSave} isLoading={isSaving}>Save</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
