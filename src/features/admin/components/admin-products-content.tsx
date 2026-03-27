'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, Category } from '@/types';
import { adminProductService } from '@/services/admin';
import { formatPrice } from '@/lib/utils';
import { AdminPageHeader } from './admin-page-header';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { PrescriptionBadge } from '@/components/product/prescription-badge';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';

export function AdminProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    const [prodRes, cats] = await Promise.all([
      adminProductService.getProducts({ pageSize: 200 }),
      adminProductService.getCategories(),
    ]);
    setProducts(prodRes.data);
    setCategories(cats);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || '-';

  const filtered = search
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.genericName.toLowerCase().includes(search.toLowerCase()))
    : products;

  const handleToggleActive = async (id: string) => {
    await adminProductService.toggleProductActive(id);
    load();
  };

  const handleToggleFeatured = async (id: string) => {
    await adminProductService.toggleProductFeatured(id);
    load();
  };

  const handleDelete = async (id: string) => {
    await adminProductService.deleteProduct(id);
    load();
  };

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}</div>;

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description={`${products.length} products`}
        actions={<Link href="/admin/products/new"><Button size="sm"><Plus className="h-4 w-4" /> Add Product</Button></Link>}
      />

      <AdminTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search products..."
      />

      {filtered.length === 0 ? (
        <EmptyState title="No products found" description={search ? 'Try a different search term' : 'Add your first product'} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden sm:table-cell">Stock</TableHead>
              <TableHead className="hidden lg:table-cell">Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.genericName}</p>
                    <div className="flex gap-1 mt-0.5">
                      {p.isPrescriptionRequired && <PrescriptionBadge />}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">{getCategoryName(p.categoryId)}</TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{formatPrice(p.discountPrice || p.price)}</span>
                  {p.discountPrice && <span className="text-xs text-muted-foreground line-through ml-1">{formatPrice(p.price)}</span>}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className={p.stockQty <= 10 ? 'text-danger font-medium text-sm' : 'text-sm'}>{p.stockQty}</span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex gap-1">
                    <Badge variant={p.isActive ? 'success' : 'default'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
                    {p.isFeatured && <Badge variant="warning">Featured</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/products/${p.id}/edit`}>
                      <Button variant="ghost" size="icon"><Pencil className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleToggleActive(p.id)}>
                      {p.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleToggleFeatured(p.id)}>
                      <Star className={`h-3.5 w-3.5 ${p.isFeatured ? 'fill-warning text-warning' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
