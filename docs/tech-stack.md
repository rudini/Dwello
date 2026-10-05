# Dwello Technology Stack & Architecture

**Version:** 1.0
**Date:** January 23, 2026

---

## Executive Summary

Dwello uses a modern, full-stack TypeScript architecture optimized for performance, developer experience, and deployment simplicity. All components are containerized with Docker for easy deployment anywhere.

**Stack Overview:**

- **Frontend:** SvelteKit (React-free, lightweight, reactive)
- **Backend:** ElysiaJS on Bun (ultra-fast, modern framework)
- **Database:** PostgreSQL (proven, ACID-compliant)
- **LLM:** Open source (Ollama with Llama/Mistral)
- **Deployment:** Docker Compose
- **Maps:** OpenStreetMap + Leaflet
- **Auth:** OAuth 2.0 / SSO

---

## Architecture Diagram (BFF Pattern)

```
┌─────────────────────────────────────────────┐
│         Client (Web Browser)                 │
│  SvelteKit + TypeScript + TailwindCSS       │
│  ├─ Building Management UI                   │
│  ├─ Invoice Management                       │
│  ├─ Statement Generation Wizard              │
│  ├─ Map Visualization                        │
│  └─ Analytics Dashboard                      │
│                                              │
│  Cookies: session={jwt}; xsrf-token={token} │
│  Headers: X-XSRF-TOKEN={token}              │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTPS/TLS (Cookies + Headers)
                   │
┌──────────────────▼──────────────────────────┐
│   SvelteKit BFF Layer (Port 5173)           │
│  ├─ Auth Routes:                            │
│  │  ├─ GET  /auth/login (OAuth initiation) │
│  │  ├─ GET  /auth/callback (OAuth callback)│
│  │  ├─ POST /auth/refresh (Token refresh)  │
│  │  ├─ POST /auth/logout (Logout)          │
│  │  └─ GET  /auth/me (Current user)        │
│  ├─ Cookie Management:                      │
│  │  ├─ HTTPOnly session cookie              │
│  │  └─ XSRF token cookie                    │
│  ├─ XSRF Validation (double-submit)        │
│  └─ API Proxy Routes:                       │
│     ├─ GET/POST/PUT/DELETE /api/*          │
│     └─ Forwards to ElysiaJS with JWT       │
└──────────────────┬──────────────────────────┘
                   │
                   │ Internal network
                   │ Authorization: Bearer {jwt}
                   │
┌──────────────────▼──────────────────────────┐
│  Backend API (ElysiaJS on Bun, Port 3001)   │
│  ├─ JWT Validation Middleware               │
│  ├─ Building CRUD                           │
│  ├─ Apartment CRUD                          │
│  ├─ Tenant CRUD                             │
│  ├─ Contract Management                     │
│  ├─ Invoice Management                      │
│  ├─ Statement Generation                    │
│  ├─ PDF/QR Generation                       │
│  ├─ LLM Integration                         │
│  └─ External API Integration                │
│      (OpenPLZ)                              │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐    ┌─────────────────────┐
│ PostgreSQL    │    │ Ollama (LLM)        │
│ Database      │    │ - Llama 3.1         │
│               │    │ - Mistral 7B        │
│ ├─ Buildings  │    │ - Mixtral           │
│ ├─ Apartments │    │                     │
│ ├─ Tenants    │    │ Local deployment    │
│ ├─ Contracts  │    │ Port: 11434         │
│ ├─ Invoices   │    └─────────────────────┘
│ ├─ Statements │
│ └─ Config     │
└───────────────┘

┌─────────────────────────────────────────────┐
│    External Services (API Calls)            │
│  ├─ OpenPLZ: Address search & validation    │
│  ├─ OAuth Providers: Authentication         │
│  │  ├─ Google OAuth                         │
│  │  ├─ Microsoft Azure AD                   │
│  │  └─ Swiss eID (future)                   │
│  └─ SMTP (future): Email notifications      │
└─────────────────────────────────────────────┘
```

### Key Architectural Improvements (BFF Pattern)

**Before:** Bearer tokens stored in localStorage/memory

- ❌ JWT exposed to JavaScript (XSS vulnerability)
- ❌ Client manages token lifecycle
- ❌ No built-in XSRF protection

**After:** HTTPOnly cookies + BFF layer

- ✅ JWT hidden from JavaScript (XSS protected)
- ✅ BFF manages token lifecycle and OAuth flow
- ✅ XSRF protection via double-submit cookie pattern
- ✅ Centralized security logic on server
- ✅ Simplified client code (no token management)

---

## Frontend Stack

### Framework: SvelteKit

**Why SvelteKit?**

- **Compilation:** Svelte compiles to vanilla JavaScript, resulting in smaller bundles
- **Reactivity:** Fine-grained reactivity without VDOM overhead
- **DX:** Excellent developer experience with hot module reloading
- **Performance:** Faster than React/Vue alternatives
- **Full-Stack:** Integrated backend API routes for simple use cases
- **Ecosystem:** Growing, but stable and mature

**Version:** 2.0+ (latest stable)

**Alternatives Considered:**

- React (Vue): Heavier, more verbose, larger bundle sizes
- Astro: Better for static sites, less dynamic UI needed
- Qwik: Promising but less mature

**Selected: SvelteKit ✓**

### UI Framework: TailwindCSS

**Why TailwindCSS?**

- **Utility-First:** Rapid UI development with utility classes
- **Responsive:** Built-in responsive design utilities
- **Customization:** Easy theming and dark mode
- **Bundle Size:** Purges unused styles
- **Multi-Language:** Works perfectly with i18n

**Features:**

- Tailwind CSS 3+
- Custom Dwello design tokens
- Dark mode support (future)
- Accessibility plugins

### Styling Architecture

```
styles/
├─ tailwind.config.js (theme configuration)
├─ globals.css (global utilities)
└─ components/
   ├─ Button.svelte
   ├─ Form.svelte
   ├─ Card.svelte
   └─ ...
```

### Type Safety: TypeScript

**Configuration:**

- Strict mode enabled
- Target: ES2020
- Module: ESNext

### State Management: SvelteKit Stores + Context

**Why Not Redux/Pinia?**

- SvelteKit's built-in stores are sufficient for single-user application
- Simpler than Redux, less boilerplate than Pinia
- Context API for component-level state

**Store Structure:**

```typescript
// src/lib/stores.ts
export const user = writable(null);
export const buildings = writable([]);
export const selectedBuilding = writable(null);
export const statements = writable([]);
```

### Form Validation: Zod + SvelteKit Forms

**Why Zod?**

- TypeScript-native schema validation
- Works server-side and client-side
- Excellent error messages
- Small bundle size

**Example:**

```typescript
import { z } from 'zod';

const BuildingSchema = z.object({
	address: z.string().min(5),
	postal_code: z.string().regex(/^\d{4}$/),
	city: z.string().min(2),
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180)
});
```

### HTTP Client: Fetch API + Custom Wrapper (BFF Pattern)

**Why Not Axios/SWR?**

- Fetch API is now standard and sufficient
- Smaller bundle size
- Custom wrapper for cookie + XSRF token handling
- Automatic credential forwarding

**Wrapper (Cookie-Based, XSRF-Protected):**

```typescript
// src/lib/api.ts - No token management, BFF handles all auth
import { browser } from '$app/environment';

function getXsrfToken(): string | null {
	if (!browser) return null;
	// Read xsrf-token from cookie (JavaScript readable)
	const cookies = document.cookie.split('; ');
	const xsrfCookie = cookies.find((c) => c.startsWith('xsrf-token='));
	return xsrfCookie ? xsrfCookie.split('=')[1] : null;
}

export async function apiCall(path: string, options: RequestInit = {}) {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>)
	};

	// Add XSRF token for state-changing requests (POST, PUT, DELETE, PATCH)
	if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method)) {
		const xsrfToken = getXsrfToken();
		if (xsrfToken) {
			headers['X-XSRF-TOKEN'] = xsrfToken;
		}
	}

	const response = await fetch(`/api${path}`, {
		...options,
		headers,
		credentials: 'same-origin' // Include cookies automatically
	});

	if (!response.ok) {
		if (response.status === 401) {
			// Unauthorized - redirect to login
			window.location.href = '/auth/login';
			throw new Error('Unauthorized');
		}
		throw new Error(`API error: ${response.status}`);
	}

	return response.json();
}

// Usage examples:
// Read: const buildings = await apiCall('/buildings')
// Create: await apiCall('/buildings', { method: 'POST', body: JSON.stringify(data) })
// Update: await apiCall('/buildings/123', { method: 'PUT', body: JSON.stringify(data) })
// Delete: await apiCall('/buildings/123', { method: 'DELETE' })
```

**No Client-Side Token Storage:**

- ✅ JWT never touched by JavaScript (stored in HTTPOnly cookie only)
- ✅ No localStorage/sessionStorage tokens to manage
- ✅ No token refresh logic in client
- ✅ Automatic cookie handling by browser
- ✅ Simplified component code

### Internationalization: svelte-i18n

**Languages:** German, French, Italian, Romansh, English

**Structure:**

```
locales/
├─ de.json (German)
├─ fr.json (French)
├─ it.json (Italian)
├─ rm.json (Romansh)
└─ en.json (English)
```

**Usage:**

```svelte
<h1>{$_('buildings.title')}</h1>
```

### Date/Time: date-fns

**Why date-fns?**

- Tree-shakeable (smaller bundle than Moment.js)
- Excellent locale support
- FP-style API
- No timezone issues

```typescript
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

format(new Date(), 'PPPP', { locale: de });
```

### Map Library: Leaflet + OpenStreetMap

**Why Leaflet?**

- Lightweight (39 KB)
- Open source
- No API key required
- Excellent mobile support

**Installation:**

```
npm install leaflet svelte-leaflet
```

**Usage:**

```svelte
<Map center={[51.505, -0.09]} zoom={13}>
	<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
	<Marker latLng={[51.5, -0.09]} />
</Map>
```

### PDF Generation (Client-Side): PDFKit or Puppeteer

**For Statements:** Server-side generation (see Backend)

**For Simple Docs:** Client-side optional

```javascript
import PDFDocument from 'pdfkit';
const doc = new PDFDocument();
```

### Build & Tooling

**Package Manager:** npm or pnpm (recommended for monorepo-like structure)

**Build Command:**

```bash
npm run build
# Output: .svelte-kit/build/
```

**Dev Server:**

```bash
npm run dev
# Runs on http://localhost:5173
```

**Environment Variables:**

```
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_OAUTH_CLIENT_ID=xxx
VITE_OAUTH_PROVIDER=google
```

---

## Backend Stack

### Framework: ElysiaJS on Bun

**Why ElysiaJS + Bun?**

- **Performance:** Bun is 2-3x faster than Node.js
- **TypeScript Native:** First-class TypeScript support
- **DX:** ElysiaJS is lightweight and fast to develop with
- **Ecosystem:** Excellent compatibility with Bun's built-in APIs
- **Modern:** Built with modern JS features (no legacy baggage)

**Alternatives Considered:**

- Express.js: Mature but slow, lots of middleware
- Fastify: Fast but complex, more ceremony
- NestJS: Powerful but overkill for simple API
- Go/Rust: Different language, learning curve

**Selected: ElysiaJS on Bun ✓**

### Database: PostgreSQL 15+

**Why PostgreSQL?**

- **Reliability:** ACID compliance for financial data
- **JSON Support:** JSONB type for flexible schemas
- **Proven:** 25+ years of production use
- **Performance:** Excellent for complex queries
- **Extensions:** uuid, full-text search, etc.

**Connection Pool:** pgBouncer or node-postgres pooling

**Migrations:** Bun's native migration support or custom SQL files

### ORM / Query Builder: Drizzle ORM

**Why Drizzle ORM?**

- **Type-Safe:** TypeScript-first, fully typed queries
- **Lightweight:** 6 KB package, no runtime overhead
- **Modern:** ESM-only, works perfectly with Bun
- **Flexible:** Raw SQL when needed
- **Performance:** No abstraction overhead

**Alternative:** Using raw node-postgres with typed results

**Example:**

```typescript
import { db } from './db';
import { buildings } from './schema';

const allBuildings = await db.select().from(buildings);

const zurichBuildings = await db.select().from(buildings).where(eq(buildings.city, 'Zurich'));
```

### Authentication: BFF Pattern with OAuth 2.0 + HTTPOnly Cookies

**Architecture Pattern:** Backend for Frontend (BFF) with SvelteKit server routes

**OAuth Providers:**

1. **Google OAuth** (primary, widely used)
2. **Microsoft Azure AD** (enterprise option)
3. **Swiss eID** (future, government standard)

**Token Storage:** Stateless JWT stored in HTTPOnly cookies (not client-side)

**Session Management:**

- **HTTPOnly Cookie:** `session={jwt}`
  - HttpOnly: true (prevents JavaScript access, XSS protection)
  - Secure: true (HTTPS only in production)
  - SameSite: Lax (CSRF protection + usability)
  - MaxAge: 3600 seconds (1 hour)

- **XSRF Token Cookie:** `xsrf-token={uuid}`
  - HttpOnly: false (client must read for header)
  - Secure: true (HTTPS only in production)
  - SameSite: Lax (CSRF protection)

**Security Flow:**

```
1. User clicks "Login with Google"
   Browser → GET /auth/login?provider=google

2. SvelteKit BFF generates OAuth request
   - Creates state parameter (CSRF protection)
   - Redirects to Google OAuth

3. User authorizes on Google
   Google → GET /auth/callback?code=xxx&state=yyy

4. SvelteKit validates state & exchanges code for token
   - Validates state parameter
   - Exchanges authorization code for access_token
   - Fetches user profile from Google
   - Generates JWT: {sub, email, name, iat, exp}
   - Sets HTTPOnly cookie: session={jwt}
   - Sets XSRF cookie: xsrf-token={uuid}
   - Redirects to /dashboard

5. Client makes API calls
   Browser → POST /api/buildings
   - Reads xsrf-token from cookie (JavaScript readable)
   - Sends X-XSRF-TOKEN header
   - Browser auto-sends cookies (credentials: 'same-origin')

6. SvelteKit BFF validates request
   - Validates: cookie[xsrf-token] === header[X-XSRF-TOKEN]
   - Extracts JWT from session cookie
   - Forwards to ElysiaJS: Authorization: Bearer {jwt}

7. ElysiaJS validates JWT
   - Verifies JWT signature and expiration
   - Processes request with authenticated user
```

**BFF Implementation:**

Server routes (src/routes/auth/)

```typescript
// src/routes/auth/login/+server.ts
export async function GET({ url, cookies }) {
	const provider = url.searchParams.get('provider') || 'google';
	const state = crypto.randomUUID();

	// Store state in secure cookie (short-lived)
	cookies.set('oauth_state', state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 600 // 10 minutes
	});

	const oauthUrl = generateOAuthUrl(provider, state);
	return redirect(302, oauthUrl);
}

// src/routes/auth/callback/+server.ts
export async function GET({ url, cookies }) {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('oauth_state');

	if (state !== storedState) throw new Error('Invalid state');

	const tokenResponse = await exchangeCodeForToken(code);
	const user = await fetchUserProfile(tokenResponse.access_token);

	const jwt = await generateJwt({
		sub: user.id,
		email: user.email,
		name: user.name
	});

	const xsrfToken = crypto.randomUUID();

	// Set session cookie (HTTPOnly)
	cookies.set('session', jwt, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 3600
	});

	// Set XSRF cookie (readable by JS)
	cookies.set('xsrf-token', xsrfToken, {
		httpOnly: false,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 3600
	});

	return redirect(302, '/dashboard');
}

// src/routes/auth/me/+server.ts
export async function GET({ cookies }) {
	const jwt = cookies.get('session');
	if (!jwt) return json({ error: 'Unauthorized' }, { status: 401 });

	const user = await verifyJwt(jwt);
	return json(user);
}
```

API proxy routes (src/routes/api/)

```typescript
// src/routes/api/buildings/+server.ts
import { validateXsrfToken, getJwtFromCookie } from '$lib/server/auth';

export async function GET({ request, cookies }) {
	const jwt = getJwtFromCookie(cookies);
	if (!jwt) return json({ error: 'Unauthorized' }, { status: 401 });

	const response = await fetch('http://localhost:3001/api/v1/buildings', {
		headers: {
			Authorization: `Bearer ${jwt}`,
			'Content-Type': 'application/json'
		}
	});

	return json(await response.json(), { status: response.status });
}

export async function POST({ request, cookies }) {
	// Validate XSRF for state-changing requests
	const xsrfValid = await validateXsrfToken(request, cookies);
	if (!xsrfValid) return json({ error: 'Invalid XSRF token' }, { status: 403 });

	const jwt = getJwtFromCookie(cookies);
	if (!jwt) return json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json();
	const response = await fetch('http://localhost:3001/api/v1/buildings', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${jwt}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	return json(await response.json(), { status: response.status });
}
```

Client-side API helper (src/lib/api.ts)

```typescript
// No token management needed - cookies handled automatically
import { browser } from '$app/environment';

function getXsrfToken(): string | null {
	if (!browser) return null;
	const cookies = document.cookie.split('; ');
	const xsrfCookie = cookies.find((c) => c.startsWith('xsrf-token='));
	return xsrfCookie ? xsrfCookie.split('=')[1] : null;
}

export async function apiCall(path: string, options: RequestInit = {}) {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>)
	};

	// Add XSRF token for state-changing requests
	if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method)) {
		const xsrfToken = getXsrfToken();
		if (xsrfToken) {
			headers['X-XSRF-TOKEN'] = xsrfToken;
		}
	}

	const response = await fetch(`/api${path}`, {
		...options,
		headers,
		credentials: 'same-origin' // Include cookies
	});

	if (!response.ok) {
		if (response.status === 401) {
			window.location.href = '/login';
			throw new Error('Unauthorized');
		}
		throw new Error(`API error: ${response.status}`);
	}

	return response.json();
}

// Usage:
// const buildings = await apiCall('/buildings')
// await apiCall('/buildings', { method: 'POST', body: JSON.stringify(data) })
```

**XSRF Protection (Double-Submit Cookie Pattern):**

1. On login, BFF sets two cookies with identical tokens
2. One cookie is readable by JavaScript (`xsrf-token`)
3. One cookie is HTTPOnly (`session`, but includes XSRF data)
4. Client reads `xsrf-token` and sends as `X-XSRF-TOKEN` header
5. BFF validates: `cookie[xsrf-token] === header[X-XSRF-TOKEN]`
6. Attacker cannot read cross-origin cookie → cannot set header → CSRF fails

**Token Refresh:**

```typescript
// src/routes/auth/refresh/+server.ts
export async function POST({ cookies }) {
	const jwt = cookies.get('session');
	if (!jwt) return json({ error: 'Unauthorized' }, { status: 401 });

	const user = await verifyJwt(jwt);
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	const newJwt = await generateJwt(user);
	const newXsrfToken = crypto.randomUUID();

	cookies.set('session', newJwt, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 3600
	});

	cookies.set('xsrf-token', newXsrfToken, {
		httpOnly: false,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 3600
	});

	return json({ success: true });
}
```

Client automatic refresh (src/routes/+layout.svelte)

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		// Refresh token every 50 minutes (before 1-hour expiry)
		setInterval(
			async () => {
				await fetch('/auth/refresh', {
					method: 'POST',
					credentials: 'same-origin'
				});
			},
			50 * 60 * 1000
		);
	});
</script>
```

### LLM Integration: Ollama

**Why Ollama?**

- **Self-Hosted:** No vendor lock-in, complete privacy
- **Free:** No API costs
- **Offline:** Works without internet
- **Models:** Llama, Mistral, Mixtral available
- **Performance:** Reasonable speed on modern hardware

**Deployment:**

```bash
# Docker Compose includes Ollama service
ollama run llama2
ollama run mistral
```

**Integration:**

```typescript
async function categorizeInvoice(description: string): Promise<{
	category: string;
	confidence: number;
}> {
	const response = await fetch('http://ollama:11434/api/generate', {
		method: 'POST',
		body: JSON.stringify({
			model: 'mistral',
			prompt: `Categorize this invoice: ${description}.
               Categories: Heating, Water, Electricity, Maintenance...`,
			stream: false
		})
	});

	const result = await response.json();
	return parseResponse(result.response);
}
```

**Model Selection:**

- **Mistral 7B:** Balanced, good for categorization
- **Llama 3.1 8B:** Slightly better quality
- **Mixtral 8x7B:** Higher quality, more compute needed

**Selected: Mistral 7B (default) with Llama option**

### PDF Generation: PDFKit + qrcode

**Why PDFKit?**

- Pure JavaScript, no external dependencies
- Swiss QR-bill support (custom code)
- Fast, good performance
- Works in containers without extra libraries

**Alternative:** Puppeteer for HTML → PDF (more flexible, slower)

**Swiss QR-Bill Generation:**

```typescript
import QRCode from 'qrcode';

async function generateQRBill(statement: UtilityStatement) {
	const qrData = {
		version: '004',
		coding: '1',
		amount: statement.balance_chf,
		currency: 'CHF',
		creditor: {
			name: 'Property Manager Ltd',
			address: '...',
			country: 'CH'
		},
		creditorAccount: config.iban,
		reference: statement.statement_number,
		debtor: {
			name: statement.tenant.name,
			address: statement.tenant.address,
			country: 'CH'
		}
	};

	const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
	// Embed in PDF
}
```

### External API Integration

**OpenPLZ API:**

```typescript
async function searchAddress(query: string) {
	const response = await fetch(`https://api.openplz.org/v1/autocomplete?q=${query}`, {
		headers: { Accept: 'application/json' }
	});
	return response.json();
}
```

**Caching:**

```typescript
const cache = new Map();

export async function searchAddressWithCache(query: string) {
	if (cache.has(query)) return cache.get(query);

	const result = await searchAddress(query);
	cache.set(query, result);
	return result;
}
```

### Validation: Zod

Same as frontend, shared schemas across client and server:

```typescript
// src/lib/schemas.ts (shared)
export const BuildingSchema = z.object({...})

// Backend uses for validation
export async function createBuilding(body: unknown) {
  const data = BuildingSchema.parse(body)
  // Process validated data
}
```

### Error Handling & Logging

**Custom Error Classes:**

```typescript
export class APIError extends Error {
	constructor(
		public code: string,
		public status: number,
		message: string,
		public details?: any
	) {
		super(message);
	}
}

export class ValidationError extends APIError {
	constructor(message: string, details: any) {
		super('VALIDATION_ERROR', 400, message, details);
	}
}
```

**Logging:**

```typescript
// Development: Console
// Production: Structured JSON logging

interface LogEntry {
	timestamp: string;
	level: 'debug' | 'info' | 'warn' | 'error';
	message: string;
	context: any;
}

function log(level: string, message: string, context?: any) {
	const entry: LogEntry = {
		timestamp: new Date().toISOString(),
		level: level as any,
		message,
		context
	};

	if (process.env.NODE_ENV === 'production') {
		// Send to logging service or write to file
		console.log(JSON.stringify(entry));
	} else {
		console.log(entry);
	}
}
```

### Performance Optimization

**Database Connection Pool:**

```typescript
import pg from 'pg';

const pool = new pg.Pool({
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000
});

export const db = drizzle(pool);
```

**Caching:**

```typescript
// Simple in-memory cache
const cache = new Map();

function memoize(fn: Function, ttl: number = 60000) {
	return async function (...args: any[]) {
		const key = JSON.stringify(args);
		if (cache.has(key)) {
			return cache.get(key);
		}

		const result = await fn(...args);
		cache.set(key, result);
		setTimeout(() => cache.delete(key), ttl);
		return result;
	};
}
```

**Async Processing:**

```typescript
// Statement generation runs in background
import { Queue } from 'queue';

const statementQueue = new Queue({
	concurrency: 2
});

export async function generateStatements(params: any) {
	return new Promise((resolve, reject) => {
		statementQueue.push(async () => {
			try {
				const result = await generateStatementsInternal(params);
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	});
}
```

---

## Database Stack

### PostgreSQL Configuration

**Version:** 15+ (tested on 15, 16)

**Key Settings:**

```postgresql
-- Performance
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB
maintenance_work_mem = 64MB

-- Query planning
random_page_cost = 1.1
effective_io_concurrency = 200

-- Logging
log_min_duration_statement = 1000
log_statement = 'all'

-- Connections
max_connections = 200
```

**Extensions:**

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";  -- For search
```

**Indexes:** See data-model.md

---

## Deployment & Infrastructure

### Docker Compose

**Services:**

1. **app** (SvelteKit + ElysiaJS)
2. **postgres** (Database)
3. **ollama** (LLM service)
4. **nginx** (Reverse proxy, TLS termination)

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/dwello
      OLLAMA_API_URL: http://ollama:11434
      NODE_ENV: production
    depends_on:
      - postgres
      - ollama
    volumes:
      - app-logs:/var/log/app

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: dwello
      POSTGRES_USER: dwello
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama-models:/root/.ollama
    ports:
      - '11434:11434'
    environment:
      OLLAMA_MODELS: mistral,llama2

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - app

volumes:
  postgres-data:
  ollama-models:
  app-logs:
```

### Deployment Methods

**Local Development:**

```bash
docker-compose up
# Runs on http://localhost:80
```

**Cloud Deployment:**

- **Docker Hub:** Push image to Docker Hub
- **AWS ECS/Fargate:** Container orchestration
- **DigitalOcean App Platform:** Simple deployment
- **Render:** Easy deployment with CLI
- **Heroku:** (Limited free tier, but possible)
- **Self-hosted VPS:** Ubuntu + Docker + Docker Compose

### Environment Configuration

**Development (.env.development):**

```
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/dwello
OAUTH_CLIENT_ID=google_dev_client_id
OAUTH_CLIENT_SECRET=google_dev_secret
OLLAMA_API_URL=http://localhost:11434
```

**Production (.env.production):**

```
NODE_ENV=production
DATABASE_URL=postgresql://dwello:password@postgres.prod:5432/dwello
OAUTH_CLIENT_ID=google_prod_client_id
OAUTH_CLIENT_SECRET=google_prod_secret
OLLAMA_API_URL=http://ollama:11434
JWT_SECRET=long-random-secret-key
HTTPS=true
```

---

## Development Workflow

### Local Setup

**Requirements:**

- Node.js 18+ (or Bun 1.0+)
- Docker & Docker Compose
- Git

**Installation:**

```bash
# Clone repository
git clone https://github.com/user/dwello.git
cd dwello

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start dev environment
docker-compose -f docker-compose.dev.yml up
npm run dev

# Backend dev: npm run dev:api
# Frontend dev: npm run dev:web
```

### Project Structure

```
dwello/
├── src/
│   ├── routes/              # SvelteKit routes
│   │   ├── +page.svelte
│   │   ├── api/            # ElysiaJS backend
│   │   │   ├── buildings.ts
│   │   │   ├── apartments.ts
│   │   │   └── ...
│   │   └── auth/
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   ├── stores.ts       # State management
│   │   ├── api.ts          # HTTP wrapper
│   │   ├── schemas.ts      # Zod schemas
│   │   └── utils/
│   └── styles/
│       ├── globals.css
│       └── tailwind.config.js
├── migrations/             # Database migrations
│   ├── 001_initial.sql
│   └── ...
├── docs/                   # Documentation
│   ├── PRD-Dwello.md
│   ├── data-model.md
│   ├── api-specification.md
│   └── tech-stack.md
├── docker-compose.yml
├── Dockerfile
├── svelte.config.js
├── vite.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Code Quality

**Linting:**

```bash
npm run lint  # ESLint
```

**Formatting:**

```bash
npm run format  # Prettier
```

**Type Checking:**

```bash
npm run type-check  # TypeScript
```

**Testing:**

```bash
npm run test      # Unit tests
npm run test:e2e  # End-to-end tests
```

### CI/CD Pipeline

**GitHub Actions (.github/workflows/ci.yml):**

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint
      - run: bun run type-check
      - run: bun run test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/dwello:${{ github.sha }}
```

---

## Performance Targets & Benchmarks

### Frontend Performance

| Metric                   | Target | Optimization                     |
| ------------------------ | ------ | -------------------------------- |
| First Contentful Paint   | <1.5s  | Critical CSS, lazy loading       |
| Time to Interactive      | <2.5s  | Code splitting, async routes     |
| Largest Contentful Paint | <2.5s  | Image optimization, font loading |
| Bundle Size              | <150KB | Tree-shaking, compression        |

### Backend Performance

| Metric                         | Target       | Optimization                       |
| ------------------------------ | ------------ | ---------------------------------- |
| API Response Time              | <500ms (p95) | Query optimization, caching        |
| PDF Generation                 | <5s          | Async processing, pre-generation   |
| Statement Generation (50 apts) | <60s         | Batch processing, parallel queries |
| LLM Categorization             | <2s          | Caching, batching                  |

### Database Performance

| Metric                     | Target       | Optimization                          |
| -------------------------- | ------------ | ------------------------------------- |
| Query Latency              | <100ms (p95) | Indexing, connection pooling          |
| Statement Generation Query | <5s          | Composite indexes, query optimization |
| Concurrent Connections     | 20+          | Connection pooling, load balancing    |

---

## Security Best Practices

### Authentication & Session Security (BFF Pattern)

**HTTPOnly Cookies:**

- ✅ JWT stored in HTTPOnly cookie (not client-side)
- ✅ Prevents XSS attacks from stealing tokens
- ✅ Browser automatically includes in requests
- ✅ 1-hour expiration with automatic refresh

**XSRF Protection (Double-Submit Cookie Pattern):**

- ✅ XSRF token in readable cookie
- ✅ Same token validated in X-XSRF-TOKEN header
- ✅ Attacker cannot read cross-origin cookies
- ✅ Attacker cannot set cross-origin headers
- ✅ SameSite=Lax provides additional protection

**Cookie Attributes:**

```
session cookie:
  ├─ HttpOnly: true (prevents JS access)
  ├─ Secure: true (HTTPS only)
  ├─ SameSite: Lax (CSRF + usability)
  ├─ Path: /
  └─ MaxAge: 3600 (1 hour)

xsrf-token cookie:
  ├─ HttpOnly: false (JS must read)
  ├─ Secure: true (HTTPS only)
  ├─ SameSite: Lax (CSRF protection)
  ├─ Path: /
  └─ MaxAge: 3600 (1 hour)
```

**OAuth Security:**

- ✅ State parameter validates OAuth callback (CSRF protection)
- ✅ All OAuth handling on server-side (BFF layer)
- ✅ PKCE support for enhanced security
- ✅ No client-side OAuth token exposure

### Code Security

- **Dependency Scanning:** npm audit, Dependabot
- **SAST:** SonarCloud for code quality
- **DAST:** OWASP ZAP for runtime security

### Deployment Security

- **TLS 1.2+:** All communications encrypted
- **Secret Management:** Environment variables, not in git
- **CORS:** Configured to specific origins (only BFF layer can call backend)
- **Rate Limiting:** Prevent abuse
- **SQL Injection:** Parameterized queries via Drizzle ORM
- **XSS:** Input validation, output encoding, HTTPOnly cookies

### Compliance

- **PCI DSS:** Not needed (no credit card processing)
- **GDPR:** Data privacy by design
- **Swiss SDPA:** Data residency, encryption
- **SOC 2:** Audit logging, access controls

### Attack Mitigation

**Cross-Site Request Forgery (CSRF):**

- Prevented by double-submit cookie pattern
- SameSite=Lax cookies don't send on cross-site POST
- XSRF token mismatch detected by BFF layer

**Cross-Site Scripting (XSS):**

- HTTPOnly cookies prevent token theft
- Input validation on all form inputs
- Output encoding in templates

**Session Hijacking:**

- Short expiration (1 hour)
- HTTPS only (Secure flag)
- SameSite cookies prevent cross-origin use

**Token Exposure:**

- JWT never stored in localStorage
- JWT never appears in HTTP headers (XSS cannot steal)
- Automatic refresh before expiration

---

## Monitoring & Observability (Future)

**Monitoring Stack:**

- **Metrics:** Prometheus
- **Logging:** ELK Stack or Datadog
- **APM:** New Relic or similar
- **Uptime:** Uptime Robot or Pingdom

**Key Metrics:**

- API endpoint latencies
- Database query performance
- PDF generation times
- LLM categorization accuracy
- Backup success rates
- Error rates and types

---

## Scaling Strategy

### Horizontal Scaling

**Phase 1 (Current):** Single container, all services

**Phase 2:** Separate services

```
- Frontend (SvelteKit) → CDN (Vercel, Netlify)
- Backend (ElysiaJS) → Multiple instances + Load Balancer
- Database → Managed PostgreSQL (AWS RDS)
- LLM → Dedicated instance or cloud service
```

**Phase 3:** Advanced scaling

- Read replicas for database
- Redis caching layer
- Job queue (Bull, Temporal) for async processing
- Kubernetes orchestration

---

## Technology Decisions Summary

| Component  | Choice           | Why                          | Confidence |
| ---------- | ---------------- | ---------------------------- | ---------- |
| Framework  | ElysiaJS + Bun   | Performance, DX, modern      | 95%        |
| Frontend   | SvelteKit        | Lightweight, reactive, fast  | 90%        |
| Database   | PostgreSQL       | Reliable, ACID, JSON support | 98%        |
| LLM        | Ollama (Mistral) | Self-hosted, privacy, cost   | 85%        |
| Auth       | OAuth 2.0        | Secure, standard, flexible   | 99%        |
| Maps       | Leaflet + OSM    | Lightweight, open-source     | 90%        |
| Deployment | Docker Compose   | Simple, portable, standard   | 95%        |
| i18n       | svelte-i18n      | Lightweight, easy            | 90%        |
| ORM        | Drizzle          | Type-safe, lightweight       | 85%        |

---

**Tech Stack Document Status:** APPROVED
**Last Updated:** January 23, 2026
