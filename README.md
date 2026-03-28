<div align="center">

<img src="https://img.icons8.com/3d-fluency/94/pill.png" alt="PharmaNest BD" width="80" />

# PharmaNest BD

### Bangladesh's Full-Stack Online Pharmacy Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

A production-ready pharmacy e-commerce platform with **prescription validation**, **mobile wallet payments** (bKash, Nagad, Rocket), **Bangla language support**, and a complete **admin dashboard** — purpose-built for the Bangladesh market.

[Live Demo](#) &nbsp;&middot;&nbsp; [API Docs](API.md) &nbsp;&middot;&nbsp; [Report Bug](../../issues)

</div>

---

## Why This Project?

Most e-commerce templates are generic. PharmaNest BD solves **real problems specific to Bangladesh's pharmacy industry**:

- **Prescription workflow** — customers upload prescriptions, pharmacists review and approve before Rx medicines are dispensed
- **Bangladesh address system** — Division > District > Upazila > Postcode, not a generic address form
- **Mobile wallet payments** — bKash, Nagad, Rocket with manual verification (how BD pharmacies actually operate)
- **Bangla language toggle** — full UI translation for accessibility across demographics
- **DGDA compliance** — built with pharmacy licensing and regulatory requirements in mind

---

## Key Features

<table>
<tr>
<td width="50%">

**Customer Experience**
- Full-text medicine search by name, brand, or generic name
- Advanced filters (category, price, manufacturer, Rx/OTC)
- Prescription upload with pharmacist review workflow
- Prescription refill requests from order history
- Cart, wishlist, and multiple saved addresses
- Order tracking with status timeline
- Product reviews and star ratings
- Coupon/promo code system at checkout
- Downloadable order invoices (PDF)
- In-app notifications (orders, prescriptions, promos)
- WhatsApp live chat support
- Bangla / English language toggle

</td>
<td width="50%">

**Admin Dashboard**
- Revenue analytics and order metrics
- Product and category management (full CRUD)
- Prescription review, approve/reject with notes
- Payment verification system
- Customer management and search
- Order status management with timeline
- Store settings (delivery charges, merchant numbers)
- Low stock alerts

**Technical**
- 40+ RESTful API endpoints
- JWT auth with HTTP-only cookies
- Role-based access control
- Zod schema validation
- Responsive design (mobile-first)
- Dark mode support

</td>
</tr>
</table>

---

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Framework** | Next.js (App Router, Turbopack) |
| **Language** | TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Styling** | Tailwind CSS |
| **Auth** | JWT + bcryptjs |
| **Validation** | Zod |
| **State** | Zustand |
| **Forms** | React Hook Form |
| **i18n** | Custom translation system (EN/BN) |
| **Hosting** | Vercel |

---

## Architecture

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

> 11 models, 4 enums &mdash; see [`prisma/schema.prisma`](prisma/schema.prisma) for full details

```
pharma-nest-bd/
├── prisma/             # Database schema, migrations, seed data
├── src/
│   ├── app/            # Next.js pages + 40 API routes
│   ├── components/     # Reusable UI components
│   ├── features/       # Feature-specific page content
│   ├── lib/            # Auth, DB, validators, i18n, utilities
│   ├── services/       # Business logic layer
│   ├── repositories/   # Data access layer (swappable local/API)
│   ├── store/          # Zustand state management
│   └── types/          # TypeScript type definitions
└── public/             # Static assets
```

---

## Order & Payment Flow

```
  Customer                                     Admin
  ────────                                     ─────

  1. Browse & search products
  2. Add to cart + apply coupon
  3. Checkout (select address + payment)
  4. Place order ───────────────────────────────────────┐
           │                                            │
           ├── Rx items? ── YES ──> Prescription review │
           │                           │                │
           │                  Admin approves/rejects ───┘
           │
  5. Submit payment (bKash/Nagad/Rocket/COD)
           │                           │
           │                  Admin verifies payment ───┘
           │
  6. Track: pending > approved > processing > packed
              > shipped > out_for_delivery > delivered
```

---

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/tanjilahmed12345/pharma-nest-bd.git
cd pharma-nest-bd
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# 3. Set up database
npm run db:migrate
npm run db:seed          # Optional: load sample data

# 4. Start developing
npm run dev              # Visit http://localhost:3000
```

<details>
<summary><b>Environment variables</b></summary>

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pharmanest"
JWT_SECRET="your-secret-key"
```

</details>

<details>
<summary><b>All scripts</b></summary>

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:reset` | Reset DB (drop + migrate + seed) |

</details>

---

## Deployment

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add `DATABASE_URL` and `JWT_SECRET` to environment variables
4. Deploy &mdash; `prisma generate` runs automatically

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push and open a Pull Request

---

## License

MIT License &mdash; see [`LICENSE`](LICENSE) for details.

---

<div align="center">

**Built with care for Bangladesh**

[Next.js](https://nextjs.org/) &middot; [Prisma](https://prisma.io/) &middot; [Tailwind CSS](https://tailwindcss.com/) &middot; [Vercel](https://vercel.com/)

</div>
