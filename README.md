<div align="center">

# 💊 PharmaNest BD

### Your Trusted Online Pharmacy in Bangladesh

[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

<br />

**A full-stack, production-ready pharmacy e-commerce platform** built for the Bangladesh market with prescription management, mobile wallet payments (bKash, Nagad, Rocket), and a complete admin dashboard.

<br />

[Live Demo](#) &nbsp;&bull;&nbsp; [Report Bug](../../issues) &nbsp;&bull;&nbsp; [Request Feature](../../issues)

</div>

---

<br />

## 🌟 Highlights

<table>
<tr>
<td width="50%">

**🛒 Customer Experience**
- Browse & search medicines by name, brand, or generic name
- Filter by category, price range, prescription type
- Cart, wishlist & saved addresses
- Upload prescriptions for Rx medicines
- Real-time order tracking
- Mobile wallet & COD payments

</td>
<td width="50%">

**🔐 Admin Dashboard**
- Revenue analytics & order metrics
- Product & category management (CRUD)
- Prescription review & approval workflow
- Payment verification system
- Customer management
- Store settings configuration

</td>
</tr>
</table>

<br />

## 🏗️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL + Prisma ORM 7.6 |
| **Styling** | Tailwind CSS 4 |
| **Auth** | JWT (HTTP-only cookies) + bcryptjs |
| **Validation** | Zod 4 |
| **State** | Zustand 5 |
| **Forms** | React Hook Form 7 |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

<br />

## 📁 Project Structure

```
pharma-nest-bd/
├── prisma/
│   ├── schema.prisma          # Database schema (11 models)
│   └── seed.ts                # Sample data seeder
├── src/
│   ├── app/
│   │   ├── (public)/          # 🌐 Public pages
│   │   │   ├── page.tsx       #    Homepage
│   │   │   ├── shop/          #    Product listing
│   │   │   ├── product/[slug] #    Product details
│   │   │   ├── category/[slug]#    Category page
│   │   │   ├── search/        #    Search results
│   │   │   ├── otc/           #    OTC medicines
│   │   │   ├── rx/            #    Prescription medicines
│   │   │   ├── offers/        #    Discounted products
│   │   │   ├── upload-prescription/
│   │   │   ├── about/         #    About us
│   │   │   ├── contact/       #    Contact page
│   │   │   ├── faq/           #    FAQ
│   │   │   ├── terms/         #    Terms & conditions
│   │   │   └── privacy/       #    Privacy policy
│   │   ├── (auth)/            # 🔑 Authentication
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (account)/         # 👤 Customer account
│   │   │   └── account/
│   │   │       ├── orders/
│   │   │       ├── prescriptions/
│   │   │       ├── addresses/
│   │   │       ├── wishlist/
│   │   │       └── profile/
│   │   ├── admin/             # ⚙️ Admin dashboard
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── prescriptions/
│   │   │   ├── payments/
│   │   │   ├── customers/
│   │   │   └── settings/
│   │   ├── cart/              # 🛒 Shopping cart
│   │   ├── checkout/          # 💳 Checkout
│   │   ├── order-success/     # ✅ Order confirmation
│   │   ├── track-order/       # 📦 Order tracking
│   │   └── api/               # 🔌 40 API routes (see below)
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Core utilities
│   │   ├── auth.ts            #    JWT & password helpers
│   │   ├── db.ts              #    Prisma client
│   │   ├── api-utils.ts       #    Response formatters
│   │   ├── validators/        #    Zod schemas
│   │   ├── constants/         #    App constants
│   │   ├── utils/             #    Helper functions
│   │   └── api/               #    API client & endpoints
│   └── stores/                # Zustand state stores
└── package.json
```

<br />

## 🗄️ Database Schema

> **11 Models** &bull; **4 Enums** &bull; PostgreSQL

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│     User     │────<│   CartItem   │     │    Category       │
│              │────<│ WishlistItem │     │  (self-referential│
│  - customer  │────<│   Address    │     │   parent/children)│
│  - admin     │────<│    Order     │     └────────┬─────────┘
│              │────<│ Prescription │              │
│              │────<│   Payment    │     ┌────────┴─────────┐
└──────────────┘     └──────────────┘     │    Product        │
                                          │  - medicine info  │
┌──────────────┐     ┌──────────────┐     │  - pricing        │
│    Order     │────<│  OrderItem   │<────│  - stock          │
│              │────<│OrderStatusLog│     │  - Rx required?   │
│              │────<│   Payment    │     └──────────────────┘
└──────────────┘     └──────────────┘
                                          ┌──────────────────┐
                                          │  StoreSetting     │
                                          │  (single record)  │
                                          └──────────────────┘
```

<details>
<summary><b>📋 View all models & fields</b></summary>

<br />

| Model | Key Fields |
|:------|:-----------|
| **User** | email, password, name, phone, role (`customer`/`admin`), isActive |
| **Category** | name, slug, image, parentId (hierarchical) |
| **Product** | name, slug, genericName, brand, manufacturer, dosageForm, strength, packSize, price, discountPrice, stockQty, isPrescriptionRequired, isFeatured, indications, sideEffects, warnings |
| **CartItem** | userId, productId, quantity (unique per user+product) |
| **WishlistItem** | userId, productId (unique per user+product) |
| **Address** | fullName, phone, division, district, upazila, postcode, area, isDefault |
| **Order** | orderNumber, paymentMethod, paymentStatus, orderStatus, subtotal, deliveryCharge, discount, total |
| **OrderItem** | productName, price, quantity (denormalized snapshot) |
| **OrderStatusLog** | status, note, timestamp (audit trail) |
| **Prescription** | imageUrl, patientName, doctorName, status, pharmacistNote |
| **PaymentSubmission** | method, senderNumber, transactionId, amount, screenshotUrl |
| **StoreSetting** | storeName, deliveryCharge, freeDeliveryThreshold, merchant numbers |

</details>

<details>
<summary><b>📋 View enums</b></summary>

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

## 🔌 API Reference

> **40 RESTful endpoints** organized by domain

<details>
<summary><b>🔑 Authentication</b> &mdash; 5 routes</summary>

<br />

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Login & receive JWT cookie |
| `POST` | `/api/auth/logout` | Clear auth cookie |
| `GET` | `/api/auth/me` | Get current user profile |
| `POST` | `/api/auth/forgot-password` | Request password reset |

</details>

<details>
<summary><b>💊 Products</b> &mdash; 7 routes</summary>

<br />

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| `GET` | `/api/products` | List with filters (category, brand, price, stock) | Public |
| `GET` | `/api/products/featured` | Get featured products | Public |
| `GET` | `/api/products/search?q=` | Full-text search | Public |
| `GET` | `/api/products/[slug]` | Product details | Public |
| `POST` | `/api/products` | Create product | Admin |
| `PUT` | `/api/products/[slug]` | Update product | Admin |
| `DELETE` | `/api/products/[slug]` | Delete product | Admin |

</details>

<details>
<summary><b>📂 Categories</b> &mdash; 5 routes</summary>

<br />

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| `GET` | `/api/categories` | List with parent/children hierarchy | Public |
| `GET` | `/api/categories/[slug]` | Category details | Public |
| `POST` | `/api/categories` | Create category | Admin |
| `PUT` | `/api/categories/[slug]` | Update category | Admin |
| `DELETE` | `/api/categories/[slug]` | Delete category | Admin |

</details>

<details>
<summary><b>🛒 Cart</b> &mdash; 5 routes</summary>

<br />

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/cart` | Get cart items |
| `POST` | `/api/cart/items` | Add/update item (upsert) |
| `PUT` | `/api/cart/items/[productId]` | Update quantity |
| `DELETE` | `/api/cart/items/[productId]` | Remove item |
| `DELETE` | `/api/cart/clear` | Clear entire cart |

> All cart routes require authentication

</details>

<details>
<summary><b>❤️ Wishlist</b> &mdash; 3 routes</summary>

<br />

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/wishlist` | Get wishlist |
| `POST` | `/api/wishlist` | Toggle product (add/remove) |
| `DELETE` | `/api/wishlist/[productId]` | Remove from wishlist |

</details>

<details>
<summary><b>📍 Addresses</b> &mdash; 4 routes</summary>

<br />

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/addresses` | List saved addresses |
| `POST` | `/api/addresses` | Create address |
| `PUT` | `/api/addresses/[id]` | Update address |
| `DELETE` | `/api/addresses/[id]` | Delete address |

> Supports Bangladesh divisions, districts, upazilas

</details>

<details>
<summary><b>📦 Orders</b> &mdash; 3 routes</summary>

<br />

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/orders` | List user's orders (paginated) |
| `POST` | `/api/orders` | Create order from cart |
| `GET` | `/api/orders/[id]` | Order details with timeline |

</details>

<details>
<summary><b>📋 Prescriptions</b> &mdash; 5 routes</summary>

<br />

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/prescriptions` | List user's prescriptions |
| `POST` | `/api/prescriptions` | Upload prescription |
| `GET` | `/api/prescriptions/[id]` | Prescription details |
| `PUT` | `/api/prescriptions/[id]` | Update prescription |
| `DELETE` | `/api/prescriptions/[id]` | Delete prescription |

</details>

<details>
<summary><b>💳 Payments</b> &mdash; 3 routes</summary>

<br />

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/payments` | Submit payment (bKash/Nagad/Rocket/COD) |
| `GET` | `/api/payments/[id]` | Payment details |
| `PUT` | `/api/payments/[id]` | Update payment |

</details>

<details>
<summary><b>⚙️ Admin</b> &mdash; 20+ routes</summary>

<br />

All admin routes require the `admin` role.

| Area | Endpoints | Capabilities |
|:-----|:----------|:-------------|
| **Dashboard** | `GET /api/admin/dashboard` | Revenue, order count, pending items, low stock alerts |
| **Products** | `GET` `POST` `PUT` `DELETE` | Full CRUD with all medicine fields |
| **Categories** | `GET` `POST` `PUT` `DELETE` | Hierarchical category management |
| **Orders** | `GET` `PUT` `DELETE` | View, update status, manage orders |
| **Prescriptions** | `GET` `PUT` `DELETE` | Review, approve/reject, add pharmacist notes |
| **Payments** | `GET` `PUT` | View & verify/reject payments |
| **Customers** | `GET` `PUT` `DELETE` | Search, view, manage customers |
| **Settings** | `GET` `PUT` | Store name, delivery charges, merchant numbers |

</details>

<br />

## 🔐 Authentication & Security

```
┌─────────────┐    POST /login     ┌─────────────┐    Set Cookie     ┌──────────┐
│   Client    │ ─────────────────> │   Server    │ ────────────────> │  Browser │
│  (email +   │                    │  (verify    │    httpOnly       │  (stores │
│   password) │                    │   bcrypt)   │    secure         │   JWT)   │
└─────────────┘                    └──────┬──────┘    sameSite=lax   └──────────┘
                                          │
                                   Sign JWT token
                                   { userId, email, role }
                                   Expiry: 7 days
```

| Feature | Implementation |
|:--------|:---------------|
| Password hashing | bcryptjs (12 salt rounds) |
| Token | JWT with 7-day expiry |
| Storage | HTTP-only cookie (no JS access) |
| CSRF protection | `sameSite: lax` |
| HTTPS | `secure: true` in production |
| Role-based access | `requireAuth()` / `requireAdmin()` guards |

<br />

## 🛍️ Order & Payment Flow

```
 Customer Journey                          Admin Actions
 ─────────────────                         ─────────────

 1. Browse & Search Products
         │
 2. Add to Cart
         │
 3. Checkout
         │
 4. Create Order ──────────────────────────────────────────┐
         │                                                 │
         ├── Has Rx items? ── YES ──> prescription_review  │
         │                            pending              │
         │                               │                 │
         │                    Admin reviews prescription ──┘
         │                               │
         │                         approved / rejected
         │
 5. Submit Payment
    (bKash / Nagad / Rocket / COD)
         │                               │
         │                    Admin verifies payment ──────┘
         │
 6. Track Order Status:
    pending ─> approved ─> processing ─> packed
         ─> shipped ─> out_for_delivery ─> delivered ✅
```

**Supported Payment Methods:**

| Method | Type | Details |
|:-------|:-----|:--------|
| 💜 **bKash** | Mobile Wallet | Merchant number + transaction ID |
| 🧡 **Nagad** | Mobile Wallet | Merchant number + transaction ID |
| 💙 **Rocket** | Mobile Wallet | Merchant number + transaction ID |
| 💵 **COD** | Cash on Delivery | Pay when delivered |

<br />

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** database
- **npm** or **yarn**

### 1. Clone the repository

```bash
git clone https://github.com/tanjilahmed12345/pharma-nest-bd.git
cd pharma-nest-bd
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pharmanest?schema=public"

# Authentication
JWT_SECRET="your-super-secret-key-change-this-in-production"

# Environment
NODE_ENV="development"
```

### 4. Set up the database

```bash
# Run migrations
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

<br />

## 📜 Available Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:reset` | Reset database (drop + migrate + seed) |

<br />

## 🌐 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add these environment variables in Vercel project settings:

   | Variable | Value |
   |:---------|:------|
   | `DATABASE_URL` | Your PostgreSQL connection string |
   | `JWT_SECRET` | A strong random secret |
   | `NODE_ENV` | `production` |

4. Deploy!

> The `postinstall` script automatically runs `prisma generate` during deployment.

<br />

## 🇧🇩 Bangladesh-Specific Features

- **Currency**: Bengali Taka (৳ BDT)
- **Phone validation**: Bangladesh mobile numbers (`01X-XXXXXXXX`)
- **Address structure**: Division > District > Upazila > Postcode
- **Payment methods**: bKash, Nagad, Rocket (popular mobile wallets)
- **Delivery**: Configurable charges with free delivery threshold
- **Prescription system**: Required for controlled/Rx medicines
- **Date formatting**: Localized to `en-BD`

<br />

## 📊 Feature Checklist

- [x] User registration & login
- [x] JWT authentication with HTTP-only cookies
- [x] Role-based access control (Customer / Admin)
- [x] Product catalog with advanced filtering & search
- [x] Category management (hierarchical)
- [x] Shopping cart (persistent, server-side)
- [x] Wishlist
- [x] Address management (Bangladesh format)
- [x] Order placement & tracking
- [x] Prescription upload & review workflow
- [x] Mobile wallet payments (bKash, Nagad, Rocket)
- [x] Cash on delivery (COD)
- [x] Admin dashboard with analytics
- [x] Admin CRUD for all resources
- [x] Payment verification system
- [x] Store settings management
- [x] Responsive UI with Tailwind CSS
- [x] Form validation with Zod
- [x] Pagination across all listings
- [x] Database seeding with sample data

<br />

---

<div align="center">

**Built with ❤️ for Bangladesh**

Made with [Next.js](https://nextjs.org/) &bull; [Prisma](https://prisma.io/) &bull; [Tailwind CSS](https://tailwindcss.com/)

</div>
