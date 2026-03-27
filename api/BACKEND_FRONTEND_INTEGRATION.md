# Frontend-Backend Integration Guide

## Base URL
- Development: `http://localhost:3001/api/v1`
- All endpoints are prefixed with `/api/v1`

## Authentication
- Login/register returns `accessToken` and `refreshToken`
- Send access token as `Authorization: Bearer <token>` header
- Refresh via `POST /auth/refresh` with `{ refreshToken }` body
- Token expiry: access 15m, refresh 7d

## Response Format
All responses follow this shape:
```json
{
  "success": true,
  "message": "Request successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["validation error 1", "..."],
  "statusCode": 400,
  "timestamp": "...",
  "path": "/api/v1/..."
}
```

## Pagination Convention
Paginated endpoints return:
```json
{
  "items": [...],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

Query params: `?page=1&limit=12`

## File Upload Flow

### Prescription Upload
1. `POST /api/v1/uploads/prescriptions` with `multipart/form-data` (field: `file`)
2. Returns `{ fileName, originalName, mimeType, size, url }`
3. Use returned `url` in `POST /api/v1/prescriptions` as `fileUrl`

### Payment Proof Upload
1. `POST /api/v1/uploads/payments` with `multipart/form-data` (field: `file`)
2. Returns file metadata with `url`
3. Use returned `url` in `POST /api/v1/payments/submit` as `screenshotUrl`

Allowed types: JPEG, PNG, WebP, PDF. Max size: 5MB.

## Frontend Repository Replacement Order

Replace local data repositories with API calls in this order:

1. **Auth** — `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/me`, `/auth/logout`
2. **User Profile** — `/users/profile` (GET, PATCH)
3. **Addresses** — `/addresses` (CRUD)
4. **Categories** — `/categories` (GET list, GET by slug)
5. **Brands** — `/brands` (GET list)
6. **Products** — `/products` (list with filters), `/products/:slug` (detail)
7. **Search** — `/search?q=...`
8. **Cart** — `/cart` (GET), `/cart/items` (POST, PATCH, DELETE), `/cart/clear`
9. **Wishlist** — `/wishlist` (GET), `/wishlist/items` (POST, DELETE), `/wishlist/check/:productId`
10. **Checkout** — `/checkout/preview` (POST), `/checkout/place-order` (POST)
11. **Orders** — `/orders` (GET list), `/orders/:id` (GET detail), `/orders/track` (POST)
12. **Prescriptions** — `/prescriptions` (POST, GET list, GET detail)
13. **Payments** — `/payments/submit` (POST), `/payments/order/:orderId` (GET)
14. **Admin** — all `/admin/*` endpoints

## Key Endpoint Reference

### Public (no auth)
- `GET /categories`, `GET /categories/:slug`
- `GET /brands`, `GET /brands/:slug`
- `GET /products`, `GET /products/:slug`
- `GET /products/featured/list`, `/offers/list`, `/otc/list`, `/rx/list`
- `GET /products/:slug/related`
- `GET /search?q=...`
- `POST /orders/track`
- `GET /health`

### Auth Required
- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
- `GET/PATCH /users/profile`
- `/addresses` CRUD
- `/cart` operations
- `/wishlist` operations
- `/checkout/preview`, `/checkout/place-order`
- `/orders` (user list/detail)
- `/prescriptions` (create/list/detail)
- `/payments/submit`, `/payments/order/:orderId`
- `/uploads/prescriptions`, `/uploads/payments`

### Admin (ADMIN/STAFF/PHARMACIST)
- `GET /admin/dashboard`
- `/admin/products` CRUD
- `/admin/categories` CRUD
- `/admin/brands` CRUD
- `/admin/orders` list/detail/status
- `/admin/prescriptions` list/detail/review
- `/admin/payments` list/detail/verify
- `GET /admin/customers`
- `GET/PATCH /admin/settings`
