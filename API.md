# PharmaNest BD &mdash; API Reference

> 40+ RESTful endpoints &mdash; standard JSON responses with pagination

## Authentication &mdash; 5 routes

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Login & receive JWT cookie |
| `POST` | `/api/auth/logout` | Clear auth cookie |
| `GET` | `/api/auth/me` | Get current user profile |
| `POST` | `/api/auth/forgot-password` | Request password reset |

## Products &mdash; 7 routes

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| `GET` | `/api/products` | List with filters (category, brand, price, stock) | Public |
| `GET` | `/api/products/featured` | Get featured products | Public |
| `GET` | `/api/products/search?q=` | Full-text search | Public |
| `GET` | `/api/products/[slug]` | Product details | Public |
| `POST` | `/api/products` | Create product | Admin |
| `PUT` | `/api/products/[slug]` | Update product | Admin |
| `DELETE` | `/api/products/[slug]` | Delete product | Admin |

## Categories &mdash; 5 routes

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| `GET` | `/api/categories` | List with parent/children hierarchy | Public |
| `GET` | `/api/categories/[slug]` | Category details | Public |
| `POST` | `/api/categories` | Create category | Admin |
| `PUT` | `/api/categories/[slug]` | Update category | Admin |
| `DELETE` | `/api/categories/[slug]` | Delete category | Admin |

## Cart &mdash; 5 routes (Auth required)

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/cart` | Get cart items |
| `POST` | `/api/cart/items` | Add / update item (upsert) |
| `PUT` | `/api/cart/items/[productId]` | Update quantity |
| `DELETE` | `/api/cart/items/[productId]` | Remove item |
| `DELETE` | `/api/cart/clear` | Clear entire cart |

## Wishlist &mdash; 3 routes (Auth required)

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/wishlist` | Get wishlist |
| `POST` | `/api/wishlist` | Toggle product (add / remove) |
| `DELETE` | `/api/wishlist/[productId]` | Remove from wishlist |

## Addresses &mdash; 4 routes (Auth required)

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/addresses` | List saved addresses |
| `POST` | `/api/addresses` | Create address |
| `PUT` | `/api/addresses/[id]` | Update address |
| `DELETE` | `/api/addresses/[id]` | Delete address |

## Orders &mdash; 3 routes (Auth required)

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/orders` | List user's orders (paginated) |
| `POST` | `/api/orders` | Place order from cart |
| `GET` | `/api/orders/[id]` | Order details with status timeline |

## Prescriptions &mdash; 5 routes (Auth required)

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/prescriptions` | List prescriptions |
| `POST` | `/api/prescriptions` | Upload prescription |
| `GET` | `/api/prescriptions/[id]` | Prescription details |
| `PUT` | `/api/prescriptions/[id]` | Update prescription |
| `DELETE` | `/api/prescriptions/[id]` | Delete prescription |

## Payments &mdash; 3 routes (Auth required)

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/payments` | Submit payment (bKash / Nagad / Rocket / COD) |
| `GET` | `/api/payments/[id]` | Payment details |
| `PUT` | `/api/payments/[id]` | Update payment |

## Admin &mdash; 20+ routes (Admin role required)

| Area | Operations | Capabilities |
|:-----|:-----------|:-------------|
| **Dashboard** | `GET` | Revenue, order count, pending items, low stock alerts |
| **Products** | `GET` `POST` `PUT` `DELETE` | Full CRUD with medicine-specific fields |
| **Categories** | `GET` `POST` `PUT` `DELETE` | Hierarchical category management |
| **Orders** | `GET` `PUT` `DELETE` | View, update status, manage orders |
| **Prescriptions** | `GET` `PUT` `DELETE` | Review, approve/reject, pharmacist notes |
| **Payments** | `GET` `PUT` | View & verify/reject payments |
| **Customers** | `GET` `PUT` `DELETE` | Search, view, manage customers |
| **Settings** | `GET` `PUT` | Store config, delivery charges, merchant numbers |

## Response Format

```json
// Success
{ "success": true, "data": { ... } }

// Paginated
{ "success": true, "data": [...], "total": 40, "page": 1, "pageSize": 12, "totalPages": 4 }

// Error
{ "success": false, "error": "Error message" }
```
