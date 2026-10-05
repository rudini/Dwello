# Dwello API Specification

**Version:** 1.0
**Framework:** SvelteKit BFF + ElysiaJS on Bun
**Date:** January 23, 2026

---

## Overview

Dwello uses a **Backend for Frontend (BFF)** architecture:

- **SvelteKit Server Routes** (`/auth/*`, `/api/*`) handle OAuth, cookies, and XSRF protection
- **ElysiaJS Backend** (`/api/v1/*`) handles all business logic
- **Cookie-Based Sessions** using HTTPOnly cookies for security
- **Double-Submit XSRF Protection** using cookie + header validation

**Frontend Base URL:** `/api` (SvelteKit BFF layer)
**Backend Base URL:** `/api/v1` (ElysiaJS, internal only)

**Authentication:** OAuth 2.0 with HTTPOnly cookies + XSRF tokens

**Response Format:** JSON

**Error Handling:** Standard HTTP status codes with detailed error messages

---

## API Architecture

### Request/Response Pattern

**Standard Request:**

```
GET /api/v1/buildings
Authorization: Bearer {access_token}
```

**Standard Response (Success):**

```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

**Standard Response (Error):**

```json
{
	"success": false,
	"error": "VALIDATION_ERROR",
	"message": "Invalid input",
	"details": [{ "field": "postal_code", "message": "Must be 4 digits" }]
}
```

### Status Codes

| Code | Usage                                      |
| ---- | ------------------------------------------ |
| 200  | Successful GET, PUT, DELETE                |
| 201  | Successful POST (resource created)         |
| 204  | Successful DELETE (no content)             |
| 400  | Bad request (validation error)             |
| 401  | Unauthorized (missing/invalid token)       |
| 403  | Forbidden (insufficient permissions)       |
| 404  | Resource not found                         |
| 409  | Conflict (duplicate, constraint violation) |
| 500  | Server error                               |

---

## Authentication & Authorization (BFF Pattern)

### OAuth 2.0 Flow with HTTPOnly Cookies

**Architecture:**

- OAuth providers: Google, Microsoft Azure AD, Swiss eID (future)
- Session storage: HTTPOnly cookies (not client-side)
- XSRF protection: Double-submit cookie pattern
- All OAuth handling: SvelteKit BFF layer (no client-side OAuth code)

### Login Endpoint

**Initiates OAuth flow:**

```
GET /auth/login?provider=google|microsoft|swiss-eid

Query Parameters:
  - provider: string (required) - OAuth provider

Response: 302 Redirect
Redirect to: {oauth_provider_login_url}
Sets-Cookie: oauth_state={uuid}; HttpOnly; SameSite=Lax; Max-Age=600
```

**Example:**

```bash
curl http://localhost:5173/auth/login?provider=google
# Redirects to Google OAuth login page
```

### OAuth Callback Endpoint

**Handles OAuth provider callback:**

```
GET /auth/callback?code={code}&state={state}

Query Parameters:
  - code: string (from OAuth provider)
  - state: string (CSRF protection)

Response: 302 Redirect
Redirect to: /dashboard

Sets-Cookie Headers:
  - session={jwt}; HttpOnly; Secure; SameSite=Lax; Max-Age=3600; Path=/
  - xsrf-token={uuid}; Secure; SameSite=Lax; Max-Age=3600; Path=/
  - Deleted: oauth_state
```

**Flow:**

1. BFF validates state parameter (CSRF protection)
2. BFF exchanges authorization code for access token with OAuth provider
3. BFF fetches user profile from OAuth provider
4. BFF generates JWT: {sub, email, name, iat, exp: +1hour}
5. BFF sets session cookie (HTTPOnly, Secure, SameSite=Lax)
6. BFF sets xsrf-token cookie (readable by JS, Secure, SameSite=Lax)
7. BFF redirects to /dashboard

### Get Current User Endpoint

**Returns authenticated user info:**

```
GET /auth/me

Request Headers:
  Cookie: session={jwt}

Response: 200 OK
{
  "sub": "google-12345",
  "email": "user@example.com",
  "name": "John Doe",
  "iat": 1705953000,
  "exp": 1705956600
}

Response: 401 Unauthorized (if no valid session cookie)
{
  "error": "Unauthorized",
  "message": "No valid session"
}
```

### Token Refresh Endpoint

**Refreshes session before expiration:**

```
POST /auth/refresh

Request Headers:
  Cookie: session={jwt}

Response: 200 OK
{
  "success": true
}

Sets-Cookie Headers:
  - session={new_jwt}; HttpOnly; Secure; SameSite=Lax; Max-Age=3600; Path=/
  - xsrf-token={new_uuid}; Secure; SameSite=Lax; Max-Age=3600; Path=/
```

**Note:** Called automatically by client every 50 minutes (before 1-hour expiry)

### Logout Endpoint

**Clears session:**

```
POST /auth/logout

Request Headers:
  Cookie: session={jwt}; xsrf-token={token}
  X-XSRF-TOKEN: {token}

Response: 200 OK
{
  "success": true
}

Sets-Cookie Headers (delete):
  - session=; Max-Age=0; Path=/
  - xsrf-token=; Max-Age=0; Path=/
```

### Cookie Specification

**Session Cookie (`session`):**

```
Name: session
Value: {JWT}
HttpOnly: true (prevents JavaScript access)
Secure: true (HTTPS only in production)
SameSite: Lax (CSRF protection)
Path: /
Max-Age: 3600 (1 hour)
Domain: (not set, same-origin only)
```

**XSRF Token Cookie (`xsrf-token`):**

```
Name: xsrf-token
Value: {UUID}
HttpOnly: false (JavaScript must read for header)
Secure: true (HTTPS only in production)
SameSite: Lax (CSRF protection)
Path: /
Max-Age: 3600 (1 hour)
Domain: (not set, same-origin only)
```

### XSRF Protection (Double-Submit Cookie Pattern)

**For state-changing requests (POST, PUT, DELETE, PATCH):**

1. Client reads `xsrf-token` cookie (JavaScript readable)
2. Client includes in request header: `X-XSRF-TOKEN: {token}`
3. BFF validates: `cookie[xsrf-token] === header[X-XSRF-TOKEN]`
4. If mismatch → 403 Forbidden

**Example Request:**

```
POST /api/buildings
Cookie: session={jwt}; xsrf-token=550e8400-e29b-41d4-a716-446655440000
X-XSRF-TOKEN: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "address": "Hauptstrasse 123",
  "postal_code": "8000",
  "city": "Zurich"
}
```

**Why This Prevents CSRF:**

- Attacker site cannot read the `xsrf-token` cookie (cross-origin)
- Attacker site cannot set the `X-XSRF-TOKEN` header (cross-origin)
- `SameSite=Lax` prevents cookie being sent on cross-site POST
- Without both matching values → CSRF attack fails

### JWT Token Format

Stored in HTTPOnly cookie, never exposed to JavaScript:

```json
{
	"sub": "google-oauth-user-id",
	"email": "user@example.com",
	"name": "User Name",
	"iat": 1705953000,
	"exp": 1705956600
}
```

**Claims:**

- `sub`: Subject (unique user ID from OAuth provider)
- `email`: User email address
- `name`: User full name
- `iat`: Issued at timestamp (seconds since epoch)
- `exp`: Expiration timestamp (1 hour from issued)

---

## BFF API Proxy Layer

### Frontend to BFF Communication

**All frontend API calls go through SvelteKit server routes** (`/api/*`), which proxy to the ElysiaJS backend.

**Frontend Request:**

```
POST /api/buildings
Cookie: session={jwt}; xsrf-token={token}
X-XSRF-TOKEN: {token}
Content-Type: application/json

{
  "address": "Hauptstrasse 123",
  "postal_code": "8000",
  "city": "Zurich",
  "latitude": 47.3769,
  "longitude": 8.5472
}
```

**BFF Processing (SvelteKit Server Route):**

1. Extract JWT from `session` cookie
2. Validate XSRF token (for POST/PUT/DELETE/PATCH):
   - `cookie[xsrf-token] === header[X-XSRF-TOKEN]`
   - Return 403 if invalid
3. Forward to ElysiaJS backend:
   ```
   POST http://localhost:3001/api/v1/buildings
   Authorization: Bearer {jwt}
   Content-Type: application/json
   {
     "address": "Hauptstrasse 123",
     ...
   }
   ```
4. Receive response from ElysiaJS
5. Return response to client

**Backend Response:**

```json
{
	"success": true,
	"data": {
		"id": "550e8400-e29b-41d4-a716-446655440000",
		"address": "Hauptstrasse 123",
		"postal_code": "8000",
		"city": "Zurich",
		"created_at": "2024-01-23T15:30:00Z"
	}
}
```

### Frontend Client Code

**Using BFF API:**

```typescript
// src/lib/api.ts
export async function apiCall(path: string, options: RequestInit = {}) {
	// Read XSRF token from cookie
	const xsrfToken = getXsrfTokenFromCookie();

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>)
	};

	// Add XSRF token for state-changing requests
	if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method)) {
		if (xsrfToken) {
			headers['X-XSRF-TOKEN'] = xsrfToken;
		}
	}

	const response = await fetch(`/api${path}`, {
		...options,
		headers,
		credentials: 'same-origin' // Include cookies
	});

	if (response.status === 401) {
		window.location.href = '/auth/login';
		throw new Error('Unauthorized');
	}

	return response.json();
}

// Usage examples:
// const buildings = await apiCall('/buildings')
// await apiCall('/buildings', { method: 'POST', body: JSON.stringify(data) })
// await apiCall('/buildings/123', { method: 'PUT', body: JSON.stringify(data) })
// await apiCall('/buildings/123', { method: 'DELETE' })
```

### API Routes

All BFF routes follow the pattern: `GET|POST|PUT|DELETE /api/{endpoint}`

**Examples:**

- `GET /api/buildings` → proxies to `GET /api/v1/buildings`
- `POST /api/buildings` → proxies to `POST /api/v1/buildings`
- `GET /api/buildings/123` → proxies to `GET /api/v1/buildings/123`
- `PUT /api/buildings/123` → proxies to `PUT /api/v1/buildings/123`
- `DELETE /api/buildings/123` → proxies to `DELETE /api/v1/buildings/123`
- `GET /api/statements/123/pdf` → proxies to `GET /api/v1/statements/123/pdf`

---

## Core API Endpoints

### 1. Buildings

#### List Buildings

```
GET /api/v1/buildings
Query Parameters:
  - search: string (search by address or city)
  - limit: number (default: 20)
  - offset: number (default: 0)

Response:
{
  "success": true,
  "data": {
    "buildings": [
      {
        "id": "uuid",
        "address": "Hauptstrasse 123",
        "postal_code": "8000",
        "city": "Zurich",
        "latitude": 47.3769,
        "longitude": 8.5472,
        "country": "Switzerland",
        "building_name": "Building A",
        "building_type": "multi-family",
        "year_built": 1995,
        "apartment_count": 12,
        "occupied_apartments": 11,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-23T14:20:00Z"
      }
    ],
    "total": 5,
    "limit": 20,
    "offset": 0
  }
}
```

#### Create Building

```
POST /api/v1/buildings
Content-Type: application/json
{
  "address": "Hauptstrasse 123",
  "postal_code": "8000",
  "city": "Zurich",
  "latitude": 47.3769,
  "longitude": 8.5472,
  "building_name": "Building A",
  "building_type": "multi-family",
  "year_built": 1995
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "uuid",
    ...building data
  }
}
```

#### Get Building Detail

```
GET /api/v1/buildings/{id}

Response: 200 OK
{
  "success": true,
  "data": {
    ...building data,
    "apartments": [
      {id, floor, size_m2, room_count, current_tenant, occupancy_status}
    ],
    "recent_invoices": [
      {id, date, entity_name, category, amount, validity}
    ],
    "statements_pending": 3
  }
}
```

#### Update Building

```
PUT /api/v1/buildings/{id}
Content-Type: application/json
{
  "building_name": "Updated Name",
  "year_built": 2000
}

Response: 200 OK
```

#### Delete Building

```
DELETE /api/v1/buildings/{id}

Response: 204 No Content
```

---

### 2. Apartments

#### List Apartments (for Building)

```
GET /api/v1/buildings/{building_id}/apartments

Response:
{
  "success": true,
  "data": {
    "apartments": [
      {
        "id": "uuid",
        "building_id": "uuid",
        "floor": "1. Stock",
        "address_unit": "Wohnung 3",
        "size_m2": 82.5,
        "room_count": "3.5",
        "current_tenant": "John Doe",
        "is_occupied": true,
        "occupancy_days": 245,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### Create Apartment

```
POST /api/v1/buildings/{building_id}/apartments
{
  "floor": "1. Stock",
  "address_unit": "Wohnung 3",
  "size_m2": 82.5,
  "room_count": "3.5",
  "room_breakdown": "2 Zimmer, Küche, Bad"
}

Response: 201 Created
```

#### Update Apartment

```
PUT /api/v1/apartments/{id}
{
  "size_m2": 85.0,
  "room_count": "4.0"
}

Response: 200 OK
```

#### Delete Apartment

```
DELETE /api/v1/apartments/{id}

Response: 204 No Content
```

---

### 3. Tenants

#### List Tenants

```
GET /api/v1/tenants
Query Parameters:
  - search: string
  - status: "current" | "former" | "all" (default: all)
  - limit: number
  - offset: number

Response:
{
  "success": true,
  "data": {
    "tenants": [
      {
        "id": "uuid",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "+41 79 123 4567",
        "street": "Beispielstrasse 10",
        "postal_code": "8000",
        "city": "Zurich",
        "current_apartment": {
          "id": "uuid",
          "building_address": "Hauptstrasse 123",
          "floor": "1. Stock"
        },
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 45
  }
}
```

#### Create Tenant

```
POST /api/v1/tenants
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+41 79 123 4567",
  "date_of_birth": "1985-05-15",
  "street": "Beispielstrasse 10",
  "postal_code": "8000",
  "city": "Zurich",
  "nationality": "Swiss"
}

Response: 201 Created
```

#### Get Tenant Detail

```
GET /api/v1/tenants/{id}

Response:
{
  "success": true,
  "data": {
    ...tenant data,
    "apartment_history": [
      {
        "apartment_id": "uuid",
        "building_address": "...",
        "floor": "...",
        "occupancy_start": "2022-01-01",
        "occupancy_end": "2024-06-30"
      }
    ],
    "active_contracts": [...]
  }
}
```

#### Update Tenant

```
PUT /api/v1/tenants/{id}
{
  "phone": "+41 79 999 8888"
}

Response: 200 OK
```

#### Delete Tenant

```
DELETE /api/v1/tenants/{id}

Response: 204 No Content
(Note: Soft delete recommended to maintain audit trail)
```

---

### 4. Rental Contracts

#### Create Contract

```
POST /api/v1/contracts
Content-Type: multipart/form-data
{
  "apartment_id": "uuid",
  "tenant_id": "uuid",
  "start_date": "2024-02-01",
  "end_date": null,
  "base_rent_chf": 2500.00,
  "additional_rent_chf": 150.00,
  "additional_rent_breakdown": {
    "garage": 100,
    "parking": 50
  },
  "monthly_advance_payment_chf": 300.00,
  "rent_index_reference": "2024-01 Index=110.5",
  "agreed_utility_categories": ["uuid1", "uuid2"],
  "notes": "Standard contract with garage",
  "contract_pdf": <file>
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "uuid",
    ...contract data
  }
}
```

#### List Contracts

```
GET /api/v1/contracts
Query Parameters:
  - apartment_id: uuid
  - tenant_id: uuid
  - status: "active" | "expired" | "all"
  - limit: number
  - offset: number

Response:
{
  "success": true,
  "data": {
    "contracts": [...]
  }
}
```

#### Get Contract Detail

```
GET /api/v1/contracts/{id}

Response:
{
  "success": true,
  "data": {
    ...contract data,
    "tenant": {...},
    "apartment": {...},
    "modifications": [
      {
        "date": "2024-06-01",
        "type": "RENT_INCREASE",
        "old_value": 2500,
        "new_value": 2600
      }
    ],
    "statements_generated": 2
  }
}
```

#### Update Contract

```
PUT /api/v1/contracts/{id}
{
  "base_rent_chf": 2600.00,
  "rent_index_reference": "2024-06 Index=112.0"
}

Response: 200 OK
```

#### Add Contract Modification

```
POST /api/v1/contracts/{id}/modifications
{
  "modification_type": "RENT_INCREASE",
  "effective_date": "2024-06-01",
  "old_value": 2500.00,
  "new_value": 2600.00,
  "reason": "Annual indexation"
}

Response: 201 Created
```

#### Download Contract PDF

```
GET /api/v1/contracts/{id}/pdf

Response: 200 OK
Content-Type: application/pdf
<PDF binary data>
```

#### Delete Contract

```
DELETE /api/v1/contracts/{id}

Response: 204 No Content
```

---

### 5. Invoices

#### List Invoices

```
GET /api/v1/invoices
Query Parameters:
  - building_id: uuid (optional, multi-select)
  - category_id: uuid (optional, multi-select)
  - date_from: date (optional)
  - date_to: date (optional)
  - validity: "valid" | "invalid" | "all" (default: all)
  - distribution_key_id: uuid (optional)
  - search: string (search in description/entity)
  - limit: number
  - offset: number

Response:
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "uuid",
        "invoice_date": "2024-01-15",
        "billing_entity_name": "Swiss Gas AG",
        "category": "Heating",
        "category_id": "uuid",
        "amount_chf": 1250.50,
        "distribution_key": "Heating Costs",
        "is_valid_utility_cost": true,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 156,
    "statistics": {
      "total_amount": 45230.75,
      "valid_amount": 43980.25,
      "invalid_amount": 1250.50,
      "by_category": {...}
    }
  }
}
```

#### Create Invoice

```
POST /api/v1/invoices
{
  "building_id": "uuid",
  "invoice_date": "2024-01-15",
  "billing_entity_name": "Swiss Gas AG",
  "billing_entity_address": "Gasstrasse 1, 8000 Zurich",
  "work_description": "Heating oil delivery - Winter 2024",
  "amount_chf": 1250.50,
  "distribution_key_id": "uuid",
  "notes": "Delivery confirmed 2024-01-15"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "uuid",
    "category_id": "uuid",
    "category_name": "Heating",
    "llm_confidence": 0.95,
    "is_valid_utility_cost": true,
    ...invoice data
  }
}
```

**Note:** `category_id`, `is_valid_utility_cost`, and `category_name` are auto-populated by LLM.

#### LLM Categorization (Manual)

```
POST /api/v1/invoices/{id}/recategorize
{
  "category_id": "uuid",
  "override_reason": "User corrected LLM classification"
}

Response: 200 OK
```

#### Update Invoice

```
PUT /api/v1/invoices/{id}
{
  "amount_chf": 1300.00,
  "is_valid_utility_cost": false,
  "validity_reason": "Repair cost - not allowed"
}

Response: 200 OK
```

#### Delete Invoice

```
DELETE /api/v1/invoices/{id}

Response: 204 No Content
```

---

### 6. Categories

#### List Categories

```
GET /api/v1/categories
Query Parameters:
  - validity: "allowed" | "not_allowed" | "all" (default: all)
  - include_predefined: boolean (default: true)

Response:
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Heating",
        "name_de": "Heizkosten",
        "name_fr": "Frais de chauffage",
        "is_allowed_utility_cost": true,
        "is_predefined": true,
        "usage_count": 42
      }
    ]
  }
}
```

#### Create Category

```
POST /api/v1/categories
{
  "name": "Custom Maintenance",
  "name_de": "Wartung",
  "name_fr": "Maintenance",
  "is_allowed_utility_cost": false,
  "description": "Building maintenance costs"
}

Response: 201 Created
```

#### Update Category

```
PUT /api/v1/categories/{id}
{
  "name": "Updated Name",
  "is_allowed_utility_cost": true
}

Response: 200 OK
(Note: Cannot update predefined categories)
```

#### Delete Category

```
DELETE /api/v1/categories/{id}

Response: 204 No Content
(Note: Cannot delete if in use)
```

---

### 7. Distribution Keys

#### List Distribution Keys

```
GET /api/v1/distribution-keys

Response:
{
  "success": true,
  "data": {
    "distribution_keys": [
      {
        "id": "uuid",
        "name": "Heating Costs",
        "description": "Monthly distribution based on heating profile",
        "formula": null,
        "is_predefined": true
      }
    ]
  }
}
```

#### Create Custom Distribution Key

```
POST /api/v1/distribution-keys
{
  "name": "Area Plus Rooms",
  "description": "Weighted by area and room count",
  "formula": "{area} * 0.7 + {rooms} * 5"
}

Response: 201 Created
```

#### Test Formula

```
POST /api/v1/distribution-keys/test-formula
{
  "formula": "{area} * 0.7 + {rooms} * 5",
  "test_apartments": [
    {
      "id": "uuid",
      "area": 82.5,
      "rooms": 3.5,
      "volume": 412.5
    }
  ]
}

Response: 200 OK
{
  "success": true,
  "data": {
    "results": [
      {
        "apartment_id": "uuid",
        "calculated_value": 75.75
      }
    ]
  }
}
```

#### Update Distribution Key

```
PUT /api/v1/distribution-keys/{id}
{
  "formula": "{area} * 0.8 + {rooms} * 3"
}

Response: 200 OK
(Note: Cannot update predefined keys)
```

#### Delete Distribution Key

```
DELETE /api/v1/distribution-keys/{id}

Response: 204 No Content
(Note: Cannot delete if in use)
```

---

### 8. Heating Distribution Profiles

#### List Profiles

```
GET /api/v1/heating-profiles

Response:
{
  "success": true,
  "data": {
    "profiles": [
      {
        "id": "uuid",
        "name": "Heating + Hot Water",
        "name_de": "Heizkosten mit Warmwasser",
        "monthly_distribution": [
          {"month": "January", "percentage": 12},
          {"month": "February", "percentage": 10},
          ...
        ],
        "is_predefined": true
      }
    ]
  }
}
```

#### Create Custom Profile

```
POST /api/v1/heating-profiles
{
  "name": "Custom Mountain Region",
  "monthly_percentages": {
    "january": 16,
    "february": 14,
    "march": 10,
    ...
  }
}

Response: 201 Created
```

---

### 9. Configuration

#### Get Configuration

```
GET /api/v1/config

Response:
{
  "success": true,
  "data": {
    "accounting_period": "2024-07-01_2025-06-30",
    "management_cost_percentage": 2.5,
    "heating_profile_id": "uuid",
    "payment_deadline_days": 30,
    "reminder_deadline_days": 10,
    "iban": "CHxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "company_name": "Property Management Ltd",
    "company_address": "Hauptstrasse 1, 8000 Zurich"
  }
}
```

#### Update Configuration

```
PUT /api/v1/config
{
  "accounting_period": "2024-11-01_2025-10-31",
  "management_cost_percentage": 2.8,
  "heating_profile_id": "uuid",
  "iban": "CHxxxxxxxxxxxxxxxxxxxxxxxxxx"
}

Response: 200 OK
```

#### Validate IBAN

```
POST /api/v1/config/validate-iban
{
  "iban": "CHxxxxxxxxxxxxxxxxxxxxxxxxxx"
}

Response:
{
  "success": true,
  "data": {
    "is_valid": true,
    "country": "Switzerland",
    "bank_code": "0019"
  }
}
```

---

### 10. Utility Statements

#### Generate Statements

```
POST /api/v1/statements/generate
Content-Type: application/json
{
  "period_start": "2024-07-01",
  "period_end": "2025-06-30",
  "building_ids": ["uuid1", "uuid2"],
  "apartment_ids": null,
  "regenerate_existing": false
}

Response: 201 Created (Async)
{
  "success": true,
  "data": {
    "job_id": "uuid",
    "status": "processing",
    "estimated_statements": 45,
    "progress_url": "/api/v1/statements/generate/uuid"
  }
}
```

#### Check Generation Progress

```
GET /api/v1/statements/generate/{job_id}

Response:
{
  "success": true,
  "data": {
    "job_id": "uuid",
    "status": "completed",
    "created_statements": 45,
    "failed_statements": 0,
    "result": {
      "statements": [
        {
          "id": "uuid",
          "statement_number": "RdJ-2024-001",
          "apartment_id": "uuid",
          "tenant_name": "John Doe"
        }
      ]
    }
  }
}
```

#### List Statements

```
GET /api/v1/statements
Query Parameters:
  - period_start: date
  - period_end: date
  - building_id: uuid
  - tenant_id: uuid
  - status: "open" | "paid" | "all"
  - search: string
  - limit: number
  - offset: number

Response:
{
  "success": true,
  "data": {
    "statements": [
      {
        "id": "uuid",
        "statement_number": "RdJ-2024-001",
        "tenant_name": "John Doe",
        "apartment_id": "uuid",
        "period_start": "2024-07-01",
        "period_end": "2025-06-30",
        "total_costs_chf": 4250.50,
        "total_advance_payments_chf": 3600.00,
        "balance_chf": 650.50,
        "status": "open",
        "payment_deadline": "2024-07-30",
        "days_until_due": 5,
        "created_at": "2024-06-28T10:30:00Z"
      }
    ],
    "total": 127
  }
}
```

#### Get Statement Detail

```
GET /api/v1/statements/{id}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "statement_number": "RdJ-2024-001",
    "tenant": {...},
    "apartment": {...},
    "period_start": "2024-07-01",
    "period_end": "2025-06-30",
    "statement_date": "2024-06-28",
    "rental_days": 365,
    "total_costs_chf": 4250.50,
    "total_advance_payments_chf": 3600.00,
    "balance_chf": 650.50,
    "status": "open",
    "payment_deadline": "2024-07-30",
    "payment_date": null,
    "line_items": [
      {
        "category": "Heating",
        "distribution_key": "Heating Costs",
        "total_building_cost_chf": 12000.00,
        "tenant_percentage": 0.0425,
        "tenant_amount_chf": 510.00
      },
      ...
    ],
    "related_contracts": [...],
    "related_invoices": [...],
    "pdf_url": "/api/v1/statements/{id}/pdf"
  }
}
```

#### Download Statement PDF

```
GET /api/v1/statements/{id}/pdf

Response: 200 OK
Content-Type: application/pdf
<PDF with embedded QR-bill>
```

#### Download Multiple Statements (ZIP)

```
POST /api/v1/statements/download-batch
{
  "statement_ids": ["uuid1", "uuid2", "uuid3"]
}

Response: 200 OK
Content-Type: application/zip
<ZIP file containing all PDFs>
```

#### Mark Statement as Paid

```
PUT /api/v1/statements/{id}/mark-paid
{
  "payment_date": "2024-07-25",
  "payment_amount": 650.50
}

Response: 200 OK
```

#### Mark Statement as Unpaid

```
PUT /api/v1/statements/{id}/mark-unpaid

Response: 200 OK
```

#### Send Payment Reminder

```
POST /api/v1/statements/{id}/send-reminder

Response: 200 OK
{
  "success": true,
  "data": {
    "reminder_sent": true,
    "reminder_date": "2024-07-28T14:30:00Z",
    "tenant_email": "john@example.com"
  }
}
```

#### Regenerate Statement

```
POST /api/v1/statements/{id}/regenerate

Response: 200 OK
```

#### Delete Statement

```
DELETE /api/v1/statements/{id}

Response: 204 No Content
```

---

### 11. Dashboard & Analytics

#### Get Dashboard Data

```
GET /api/v1/dashboard

Response:
{
  "success": true,
  "data": {
    "portfolio_summary": {
      "total_buildings": 3,
      "total_apartments": 28,
      "total_tenants": 27,
      "occupancy_rate": 0.96
    },
    "financial_overview": {
      "total_monthly_advance": 8450.00,
      "outstanding_balance": 3250.50,
      "total_invoices_this_month": 12,
      "average_invoice_amount": 850.00
    },
    "outstanding_items": {
      "unpaid_statements": 5,
      "total_amount_due": 3250.50,
      "oldest_unpaid_days": 15,
      "reminders_due": 2
    },
    "cost_breakdown": {
      "Heating": 18500.00,
      "Water": 3200.00,
      "Electricity": 2800.00,
      ...
    },
    "trends": {
      "occupancy_30d": 0.94,
      "occupancy_90d": 0.95,
      "average_cost_per_apartment": 1850.00
    }
  }
}
```

#### Get Financial Analytics

```
GET /api/v1/analytics/financial
Query Parameters:
  - period_months: number (3, 6, 12)
  - building_id: uuid (optional)

Response:
{
  "success": true,
  "data": {
    "total_costs": 45230.75,
    "by_category": {...},
    "by_building": {...},
    "trend_chart": {
      "dates": ["2023-01", "2023-02", ...],
      "values": [3500, 3600, ...]
    }
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
	"success": false,
	"error": "ERROR_CODE",
	"message": "Human-readable error message",
	"details": [
		{
			"field": "postal_code",
			"message": "Must be exactly 4 digits"
		}
	]
}
```

### Common Error Codes

| Code               | Meaning                                | HTTP Status |
| ------------------ | -------------------------------------- | ----------- |
| VALIDATION_ERROR   | Input validation failed                | 400         |
| UNAUTHORIZED       | Missing or invalid token               | 401         |
| FORBIDDEN          | Insufficient permissions               | 403         |
| NOT_FOUND          | Resource not found                     | 404         |
| CONFLICT           | Constraint violation (duplicate)       | 409         |
| INVALID_STATE      | Operation not allowed in current state | 409         |
| PROCESSING_ERROR   | Server processing error                | 500         |
| EXTERNAL_API_ERROR | Error from external API                | 502         |

---

## Rate Limiting

- **Default Limit:** 100 requests per minute per user
- **Statement Generation:** 10 concurrent jobs per user
- **File Uploads:** Max 10 MB per file
- **Response Headers:** X-RateLimit-Limit, X-RateLimit-Remaining

---

## Pagination

All list endpoints support pagination:

```
Query Parameters:
  - limit: number (default: 20, max: 100)
  - offset: number (default: 0)

Response includes:
  - total: number (total available records)
  - limit: number
  - offset: number
```

---

## Filtering & Searching

### Date Range Filtering

```
date_from: ISO 8601 date (inclusive)
date_to: ISO 8601 date (inclusive)
```

### Multi-Select Filtering

```
category_id=uuid1&category_id=uuid2&category_id=uuid3
```

### Full-Text Search

```
search: string (searches across relevant fields)
```

---

## Sorting

Default: `-created_at` (newest first)

Supported sort fields:

- `+/-created_at`
- `+/-updated_at`
- `+/-amount_chf`
- `+/-date` (invoice_date, statement_date)
- `+/-name` (building, tenant, category)

---

## Webhooks (Future)

```
POST /api/v1/webhooks
{
  "event": "statement.generated",
  "url": "https://example.com/webhooks/statement",
  "active": true
}

Webhook Payload (delivered as POST to registered URL):
{
  "event": "statement.generated",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "statement_id": "uuid",
    "tenant_id": "uuid",
    "statement_number": "RdJ-2024-001"
  }
}
```

---

## Implementation Notes

### Database Connection

```typescript
// ElysiaJS setup
const app = new Elysia().connect(pgPool).use(authMiddleware).use(errorHandler);
```

### Request Validation

```typescript
// TypeScript types for validation
interface CreateBuildingRequest {
	address: string;
	postal_code: string;
	city: string;
	latitude: number;
	longitude: number;
	building_type?: string;
}
```

### Authentication Middleware

```typescript
app.derive(({ headers }) => {
	const token = headers.authorization?.split(' ')[1];
	if (!token) throw new UnauthorizedError();
	const user = verifyToken(token);
	return { user };
});
```

---

**API Specification Status:** APPROVED
**Last Updated:** January 23, 2026
