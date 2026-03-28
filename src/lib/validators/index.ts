import { z } from 'zod';

// Phone validation for Bangladesh numbers
const bdPhone = z
  .string()
  .regex(/^(?:\+?880|0)1[3-9]\d{8}$/, 'Enter a valid Bangladesh phone number');

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    phone: bdPhone,
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: bdPhone,
  alternatePhone: z.string().optional(),
  division: z.string().min(1, 'Division is required'),
  district: z.string().min(1, 'District is required'),
  upazila: z.string().min(1, 'Upazila is required'),
  postcode: z.string().min(4, 'Postcode is required'),
  area: z.string().min(1, 'Area is required'),
  addressLine: z.string().min(1, 'Address is required'),
  houseFlat: z.string().min(1, 'House/Flat is required'),
  landmark: z.string().optional(),
  deliveryNote: z.string().optional(),
});

export const prescriptionUploadSchema = z.object({
  patientName: z.string().min(2, 'Patient name is required'),
  doctorName: z.string().min(2, 'Doctor name is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  notes: z.string().optional(),
});

export const walletPaymentSchema = z.object({
  senderNumber: bdPhone,
  transactionId: z.string().min(4, 'Transaction ID is required'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  genericName: z.string().min(2, 'Generic name is required'),
  brand: z.string().min(1, 'Brand is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  categoryId: z.string().min(1, 'Category is required'),
  dosageForm: z.string().min(1, 'Dosage form is required'),
  strength: z.string().min(1, 'Strength is required'),
  packSize: z.string().min(1, 'Pack size is required'),
  price: z.coerce.number().positive('Price must be positive'),
  discountPrice: z.coerce.number().optional(),
  shortDescription: z.string().min(1, 'Short description is required'),
  description: z.string().optional(),
  indications: z.string().optional(),
  dosageInstructions: z.string().optional(),
  sideEffects: z.string().optional(),
  warnings: z.string().optional(),
  storageInfo: z.string().optional(),
  stockQty: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  isPrescriptionRequired: z.boolean(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  tags: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(0),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type PrescriptionUploadFormData = z.infer<typeof prescriptionUploadSchema>;
export type WalletPaymentFormData = z.infer<typeof walletPaymentSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
