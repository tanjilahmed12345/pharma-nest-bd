<div align="center">

<img src="https://img.icons8.com/3d-fluency/94/pill.png" alt="PharmaNest BD Logo" width="80" />

# PharmaNest BD

### Your Trusted Online Pharmacy in Bangladesh

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br />

A **full-stack pharmacy e-commerce platform** purpose-built for the Bangladesh market — featuring prescription management, mobile wallet payments (bKash, Nagad, Rocket), and a powerful admin dashboard.

<br />

[Live Demo](#) &nbsp;&middot;&nbsp; [Report Bug](../../issues) &nbsp;&middot;&nbsp; [Request Feature](../../issues)

---

</div>

<br />

## At a Glance

<table>
<tr>
<td width="50%">

### Storefront
- Browse & search medicines by name, brand or generic name
- Filter by category, brand, price & prescription type
- Persistent cart, wishlist & saved addresses
- Upload prescriptions for Rx-only medicines
- Pay via **bKash / Nagad / Rocket / COD**
- Real-time order tracking

</td>
<td width="50%">

### Admin Panel
- Revenue & order analytics dashboard
- Full product & category management
- Prescription review & approval workflow
- Payment verification system
- Customer management
- Configurable store settings

</td>
</tr>
</table>

<br />

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL + Prisma ORM 7.6 |
| **Styling** | Tailwind CSS 4 |
| **Auth** | JWT + bcryptjs |
| **Validation** | Zod 4 |
| **State** | Zustand 5 |
| **Forms** | React Hook Form 7 |
| **Icons** | Lucide React |
| **Hosting** | Vercel |

<br />

## Pages & Routes

### Public Pages

| Page | Path | Description |
|:-----|:-----|:------------|
| Home | `/` | Hero, featured products, categories, trust badges |
| Shop | `/shop` | Full product listing with filters & sorting |
| Product | `/product/[slug]` | Details, gallery, specs, related products |
| Category | `/category/[slug]` | Category-specific listing |
| Search | `/search` | Full-text search results |
| OTC Medicines | `/otc` | Over-the-counter products |
| Rx Medicines | `/rx` | Prescription-required products |
| Offers | `/offers` | Discounted products |
| Upload Prescription | `/upload-prescription` | Prescription image upload |
| About / Contact / FAQ | `/about` `/contact` `/faq` | Informational pages |
| Terms / Privacy | `/terms` `/privacy` | Legal pages |

### Customer Account

| Page | Path |
|:-----|:-----|
| Dashboard | `/account` |
| My Orders | `/account/orders` |
| Order Details | `/account/orders/[id]` |
| Prescriptions | `/account/prescriptions` |
| Addresses | `/account/addresses` |
| Wishlist | `/account/wishlist` |
| Profile | `/account/profile` |
| Track Order | `/track-order` |

### Admin Dashboard

| Page | Path |
|:-----|:-----|
| Analytics | `/admin/dashboard` |
| Products | `/admin/products` |
| Add / Edit Product | `/admin/products/new` &middot; `/admin/products/[id]/edit` |
| Categories | `/admin/categories` |
| Orders | `/admin/orders` &middot; `/admin/orders/[id]` |
| Prescriptions | `/admin/prescriptions` |
| Payments | `/admin/payments` |
| Customers | `/admin/customers` |
| Settings | `/admin/settings` |

<br />

## API Overview

> **40 RESTful endpoints** &mdash; standard JSON responses with pagination support

| Domain | Routes | Public | Auth | Admin |
|:-------|:------:|:------:|:----:|:-----:|
| **Auth** | 5 | &mdash; | register, login, logout, me, forgot-password | &mdash; |
| **Products** | 7 | list, search, featured, detail | &mdash; | create, update, delete |
| **Categories** | 5 | list, detail | &mdash; | create, update, delete |
| **Cart** | 5 | &mdash; | get, add, update, remove, clear | &mdash; |
| **Wishlist** | 3 | &mdash; | list, toggle, remove | &mdash; |
| **Addresses** | 4 | &mdash; | list, create, update, delete | &mdash; |
| **Orders** | 3 | &mdash; | list, create, detail | &mdash; |
| **Prescriptions** | 5 | &mdash; | list, upload, detail, update, delete | &mdash; |
| **Payments** | 3 | &mdash; | submit, detail, update | &mdash; |
| **Admin** | 20+ | &mdash; | &mdash; | dashboard, products, categories, orders, prescriptions, payments, customers, settings |

<br />

## Database Schema

> **11 Models** &middot; **4 Enums** &middot; PostgreSQL

```
┌──────────────┐       ┌──────────────┐       ┌───────────────────┐
│     User     │──────<│   CartItem   │       │    Category        │
│              │──────<│ WishlistItem │       │  (self-referential │
│  - customer  │──────<│   Address    │       │   parent/children) │
│  - admin     │──────<│    Order     │       └─────────┬─────────┘
│              │──────<│ Prescription │                 │
│              │──────<│   Payment    │       ┌─────────┴─────────┐
└──────────────┘       └──────────────┘       │     Product        │
                                              │  - medicine info   │
┌──────────────┐       ┌──────────────┐       │  - pricing/stock   │
│    Order     │──────<│  OrderItem   │<──────│  - Rx required?    │
│              │──────<│OrderStatusLog│       └───────────────────┘
│              │──────<│   Payment    │
└──────────────┘       └──────────────┘       ┌───────────────────┐
                                              │   StoreSetting     │
                                              │   (single record)  │
                                              └───────────────────┘
```

<details>
<summary><b>View all models & fields</b></summary>

<br />

| Model | Key Fields |
|:------|:-----------|
| **User** | email, name, phone, role (`customer` / `admin`), isActive |
| **Category** | name, slug, image, parentId (hierarchical) |
| **Product** | name, slug, genericName, brand, manufacturer, dosageForm, strength, packSize, price, discountPrice, stockQty, isPrescriptionRequired, isFeatured, indications, sideEffects, warnings |
| **CartItem** | userId, productId, quantity &mdash; unique per user + product |
| **WishlistItem** | userId, productId &mdash; unique per user + product |
| **Address** | fullName, phone, division, district, upazila, postcode, area, isDefault |
| **Order** | orderNumber, paymentMethod, paymentStatus, orderStatus, subtotal, deliveryCharge, discount, total |
| **OrderItem** | productName, price, quantity &mdash; denormalized snapshot |
| **OrderStatusLog** | status, note, timestamp &mdash; audit trail |
| **Prescription** | imageUrl, patientName, doctorName, status, pharmacistNote |
| **PaymentSubmission** | method, senderNumber, transactionId, amount, screenshotUrl |
| **StoreSetting** | storeName, deliveryCharge, freeDeliveryThreshold, merchant numbers |

</details>

<details>
<summary><b>View enums</b></summary>

<br />

| Enum | Values |
|:-----|:-------|
| **UserRole** | `customer` `admin` |
| **OrderStatus** | `pending` `prescription_review_pending` `approved` `processing` `packed` `shipped` `out_for_delivery` `delivered` `cancelled` `rejected` |
| **PaymentMethod** | `bkash` `nagad` `rocket` `cod` |
| **PaymentStatus** | `pending` `cod_pending` `submitted` `verified` `rejected` |
| **PrescriptionStatus** | `pending` `approved` `rejected` `needs_clarification` |

</details>

<br />

## Project Structure

```
pharma-nest-bd/
├── prisma/
│   ├── schema.prisma              # 11 models, 4 enums
│   ├── seed.ts                    # Sample data seeder
│   └── migrations/                # Database migrations
├── src/
│   ├── app/
│   │   ├── (public)/              # Storefront pages (13 pages)
│   │   ├── (auth)/                # Login, register, forgot-password
│   │   ├── (account)/             # Customer dashboard (7 pages)
│   │   ├── admin/                 # Admin panel (11 pages)
│   │   ├── cart/                  # Shopping cart
│   │   ├── checkout/              # Checkout flow
│   │   ├── order-success/         # Order confirmation
│   │   ├── track-order/           # Order tracking
│   │   └── api/                   # 40 REST API routes
│   ├── components/
│   │   ├── ui/                    # Base UI (button, input, modal, table...)
│   │   ├── layout/                # Header, footer, sidebar, nav
│   │   ├── product/               # Cards, grid, filters, gallery
│   │   ├── cart/                  # Cart drawer, item card, summary
│   │   ├── checkout/              # Steps, address, payment
│   │   ├── order/                 # Status badge, timeline, cards
│   │   ├── prescription/          # Upload, status, alerts
│   │   ├── account/               # Sidebar, stat cards
│   │   ├── admin/                 # Topbar, sidebar, table toolbar
│   │   ├── home/                  # Hero, categories, featured, CTA
│   │   └── common/                # Logo, theme toggle, utilities
│   ├── lib/
│   │   ├── auth.ts                # Authentication & role guards
│   │   ├── db.ts                  # Database connection
│   │   ├── api-utils.ts           # Response helpers & pagination
│   │   ├── validators/            # Zod validation schemas
│   │   ├── constants/             # App-wide constants
│   │   ├── utils/                 # Helpers (formatting, slugify...)
│   │   └── api/                   # API client & endpoint map
│   ├── stores/                    # Zustand state stores
│   └── types/                     # TypeScript type definitions
├── public/                        # Static assets
├── package.json
├── next.config.ts
└── tsconfig.json
```

<br />

## Order & Payment Flow

```
  Customer                                     Admin
  ────────                                     ─────

  1. Browse & search products
           │
  2. Add to cart
           │
  3. Proceed to checkout
           │
  4. Place order ─────────────────────────────────────────┐
           │                                              │
           ├── Rx items? ─ YES ──> prescription_review    │
           │                       pending                │
           │                          │                   │
           │               Admin reviews prescription ────┘
           │                          │
           │                    approved / rejected
           │
  5. Submit payment
     (bKash / Nagad / Rocket / COD)
           │                          │
           │               Admin verifies payment ────────┘
           │
  6. Track status:
     pending > approved > processing > packed
           > shipped > out_for_delivery > delivered
```

| Method | Type | How it works |
|:-------|:-----|:-------------|
| **bKash** | Mobile Wallet | Send to merchant number, submit transaction ID |
| **Nagad** | Mobile Wallet | Send to merchant number, submit transaction ID |
| **Rocket** | Mobile Wallet | Send to merchant number, submit transaction ID |
| **COD** | Cash on Delivery | Pay when your order arrives |

<br />

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [PostgreSQL](https://www.postgresql.org/) database
- npm or yarn

### 1. Clone & install

```bash
git clone https://github.com/tanjilahmed12345/pharma-nest-bd.git
cd pharma-nest-bd
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pharmanest"
JWT_SECRET="your-secret-key"
```

### 3. Set up database

```bash
npm run db:migrate    # Run migrations
npm run db:seed       # Load sample data (optional)
```

### 4. Start developing

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

<br />

## Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:reset` | Reset DB (drop + migrate + seed) |

<br />

## Deployment (Vercel)

1. Push code to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add environment variables (`DATABASE_URL`, `JWT_SECRET`)
4. Deploy &mdash; `prisma generate` runs automatically via `postinstall`

<br />

## Built for Bangladesh

| Feature | Details |
|:--------|:--------|
| **Currency** | BDT (Bengali Taka) |
| **Phone validation** | BD mobile format (`01X-XXXXXXXX`) |
| **Address system** | Division > District > Upazila > Postcode |
| **Payments** | bKash, Nagad, Rocket, Cash on Delivery |
| **Delivery** | Configurable charges + free delivery threshold |
| **Prescriptions** | Upload & pharmacist review for Rx medicines |

<br />

## Features

- [x] User registration & login
- [x] Role-based access (Customer / Admin)
- [x] Product catalog with filters & search
- [x] Hierarchical categories
- [x] Server-side cart & wishlist
- [x] Address management (BD format)
- [x] Order placement & tracking
- [x] Prescription upload & review
- [x] Mobile wallet payments (bKash, Nagad, Rocket)
- [x] Cash on delivery
- [x] Admin dashboard & analytics
- [x] Admin CRUD for all resources
- [x] Payment verification
- [x] Store settings
- [x] Responsive design
- [x] Form validation
- [x] Pagination
- [x] Database seeding

<br />

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<br />

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

<br />

---

<div align="center">

**Built with care for Bangladesh**

[Next.js](https://nextjs.org/) &middot; [Prisma](https://prisma.io/) &middot; [Tailwind CSS](https://tailwindcss.com/) &middot; [Vercel](https://vercel.com/)

</div>
