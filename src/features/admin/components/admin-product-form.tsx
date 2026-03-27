'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '@/lib/validators';
import { Product, Category, DosageForm } from '@/types';
import { adminProductService } from '@/services/admin';
import { slugify, nowISO } from '@/lib/utils';
import { AdminPageHeader } from './admin-page-header';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const dosageFormOptions = Object.values(DosageForm).map((v) => ({
  label: v.charAt(0).toUpperCase() + v.slice(1),
  value: v,
}));

interface AdminProductFormProps {
  productId?: string; // undefined = create, string = edit
}

export function AdminProductForm({ productId }: AdminProductFormProps) {
  const router = useRouter();
  const isEdit = !!productId;
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Cast needed: z.coerce.number() infers as `unknown` which conflicts with react-hook-form resolver types
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      isPrescriptionRequired: false,
      isFeatured: false,
      isActive: true,
      stockQty: 0,
      price: 0,
    },
  });

  useEffect(() => {
    async function load() {
      const cats = await adminProductService.getCategories();
      setCategories(cats);

      if (productId) {
        const product = await adminProductService.getProductById(productId);
        if (product) {
          reset({
            name: product.name,
            genericName: product.genericName,
            brand: product.brand,
            manufacturer: product.manufacturer,
            categoryId: product.categoryId,
            dosageForm: product.dosageForm,
            strength: product.strength,
            packSize: product.packSize,
            price: product.price,
            discountPrice: product.discountPrice || undefined,
            shortDescription: product.shortDescription,
            description: product.description,
            indications: product.indications,
            dosageInstructions: product.dosageInstructions,
            sideEffects: product.sideEffects,
            warnings: product.warnings,
            storageInfo: product.storageInfo,
            stockQty: product.stockQty,
            isPrescriptionRequired: product.isPrescriptionRequired,
            isFeatured: product.isFeatured,
            isActive: product.isActive,
            tags: product.tags.join(', '),
          });
        }
      }
      setIsLoading(false);
    }
    load();
  }, [productId, reset]);

  const categoryOptions = categories.map((c) => ({ label: c.name, value: c.id }));

  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true);
    setError('');
    try {
      const productData = {
        name: data.name,
        slug: slugify(data.name),
        genericName: data.genericName,
        brand: data.brand,
        manufacturer: data.manufacturer,
        categoryId: data.categoryId,
        dosageForm: data.dosageForm as DosageForm,
        strength: data.strength,
        packSize: data.packSize,
        price: data.price,
        discountPrice: data.discountPrice || undefined,
        image: '/images/products/placeholder.jpg',
        gallery: [] as string[],
        shortDescription: data.shortDescription,
        description: data.description || '',
        indications: data.indications || '',
        dosageInstructions: data.dosageInstructions || '',
        sideEffects: data.sideEffects || '',
        warnings: data.warnings || '',
        storageInfo: data.storageInfo || '',
        stockQty: data.stockQty,
        isPrescriptionRequired: data.isPrescriptionRequired,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        tags: (data.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      };

      if (isEdit && productId) {
        await adminProductService.updateProduct(productId, productData);
      } else {
        await adminProductService.createProduct(productData as any);
      }
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96 rounded-xl" /></div>;

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? 'Edit Product' : 'Add New Product'}
        actions={<Link href="/admin/products"><Button variant="outline" size="sm"><ArrowLeft className="h-3.5 w-3.5" /> Back</Button></Link>}
      />

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-4">
            <Card padding="lg">
              <h3 className="text-sm font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Product Name" error={errors.name?.message} {...register('name')} />
                  <Input label="Generic Name" error={errors.genericName?.message} {...register('genericName')} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Brand" error={errors.brand?.message} {...register('brand')} />
                  <Input label="Manufacturer" error={errors.manufacturer?.message} {...register('manufacturer')} />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Select label="Category" options={categoryOptions} placeholder="Select" error={errors.categoryId?.message} {...register('categoryId')} />
                  <Select label="Dosage Form" options={dosageFormOptions} placeholder="Select" error={errors.dosageForm?.message} {...register('dosageForm')} />
                  <Input label="Strength" error={errors.strength?.message} {...register('strength')} />
                </div>
                <Input label="Pack Size" error={errors.packSize?.message} {...register('packSize')} />
                <Textarea label="Short Description" rows={2} error={errors.shortDescription?.message} {...register('shortDescription')} />
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="text-sm font-semibold mb-4">Detailed Information</h3>
              <div className="space-y-4">
                <Textarea label="Description" rows={3} {...register('description')} />
                <Textarea label="Indications" rows={2} {...register('indications')} />
                <Textarea label="Dosage Instructions" rows={2} {...register('dosageInstructions')} />
                <Textarea label="Side Effects" rows={2} {...register('sideEffects')} />
                <Textarea label="Warnings" rows={2} {...register('warnings')} />
                <Textarea label="Storage Info" rows={2} {...register('storageInfo')} />
                <Input label="Tags (comma separated)" {...register('tags')} />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card padding="lg">
              <h3 className="text-sm font-semibold mb-4">Pricing & Stock</h3>
              <div className="space-y-4">
                <Input label="Price (BDT)" type="number" step="0.01" error={errors.price?.message} {...register('price')} />
                <Input label="Discount Price (BDT)" type="number" step="0.01" {...register('discountPrice')} />
                <Input label="Stock Quantity" type="number" error={errors.stockQty?.message} {...register('stockQty')} />
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="text-sm font-semibold mb-4">Settings</h3>
              <div className="space-y-3">
                <Checkbox label="Active" {...register('isActive')} />
                <Checkbox label="Featured" {...register('isFeatured')} />
                <Checkbox label="Prescription Required" {...register('isPrescriptionRequired')} />
              </div>
            </Card>

            <Button type="submit" fullWidth isLoading={isSaving} size="lg">
              <Save className="h-4 w-4" /> {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
