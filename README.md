# Dwello - Swiss Property Management System

**Status:** In Development
**Version:** 0.1.0
**Architecture:** SvelteKit BFF + ElysiaJS Backend + PostgreSQL

---

## Overview

Dwello is a comprehensive web application for managing residential properties in Switzerland, specifically designed for property managers (Liegenschaftsverwalter). The system handles building management, tenant relationships, rental contracts, invoice management, and most importantly, complex utility cost statement generation (Nebenkostenabrechnungen) with Swiss legal compliance.

### Target Users
- Property managers managing 1-5 buildings with <50 apartments
- Single user initially (no multi-user support in MVP)

### Key Features
1. Building & Apartment Management
2. Tenant & Contract Management
3. Invoice Management with LLM-powered categorization
4. Utility Cost Statement Generation with complex prorating
5. Swiss QR-bill Generation
6. Multi-language Support (German, French, Italian, Romansh, English)

---

## Technology Stack

- **Frontend:** SvelteKit + TypeScript + TailwindCSS
- **Backend:** ElysiaJS on Bun + PostgreSQL + Drizzle ORM
- **Authentication:** BFF Pattern with OAuth 2.0 / SSO
- **LLM:** Ollama (self-hosted Mistral/Llama)
- **Deployment:** Docker Compose
- **Maps:** OpenStreetMap + Leaflet
- **Internationalization:** svelte-i18n

---

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- Bun >= 1.0.0 (for backend)
- PostgreSQL >= 15
- Docker & Docker Compose (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dwello
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Start the development servers**

   **Frontend (SvelteKit):**
   ```bash
   npm run dev
   # Runs on http://localhost:3000
   ```

   **Backend (ElysiaJS):**
   ```bash
   cd backend
   bun run dev
   # Runs on http://localhost:3001
   ```

6. **Run database migrations**
   ```bash
   # Coming soon
   ```

---

## Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run check` - Check Svelte files
- `npm run type-check` - TypeScript type checking
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

**Backend:**
- `bun run dev` - Start backend dev server (hot reload)
- `bun run build` - Build backend
- `bun run start` - Start production server
- `bun test` - Run tests
- `bun run type-check` - TypeScript type checking

### Project Structure

```
dwello/
├── src/                    # Frontend (SvelteKit)
│   ├── routes/            # SvelteKit routes
│   │   ├── auth/         # Authentication server routes
│   │   ├── api/          # API proxy routes (BFF)
│   │   └── [pages]/      # UI pages
│   ├── lib/              # Shared libraries
│   │   ├── server/       # Server-only utilities
│   │   ├── components/   # Svelte components
│   │   └── utils/        # Utility functions
│   └── styles/           # Global styles
├── backend/               # Backend (ElysiaJS)
│   └── src/
│       ├── routes/       # API endpoints
│       ├── middleware/   # Middleware
│       ├── schema/       # Database schema
│       └── services/     # Business logic
├── docs/                 # Documentation
├── migrations/           # Database migrations
└── docker-compose.yml    # Docker setup
```

---

## Documentation

- **Product Requirements:** [docs/PRD-Dwello.md](./docs/PRD-Dwello.md)
- **Data Model:** [docs/data-model.md](./docs/data-model.md)
- **API Specification:** [docs/api-specification.md](./docs/api-specification.md)
- **Tech Stack:** [docs/tech-stack.md](./docs/tech-stack.md)
- **Implementation Plan:** [implementation_plan.md](./implementation_plan.md)
- **Project Context:** [CLAUDE.md](./CLAUDE.md)

---

## Testing

### Unit Tests (Vitest)
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

The E2E run starts its own stack (backend on 3101, frontend on 3100) against its own database `dwello_e2e`,
recreated from `backend/migrations` before every run (`cd backend && bun run e2e-db`). The development
servers and database are never touched; only PostgreSQL on 5432 is required. Override the database with
`E2E_DATABASE_URL`.

### Coverage
```bash
npm run test -- --coverage
```

---

## Deployment

### Docker Compose

**Development:**
```bash
docker-compose -f docker-compose.dev.yml up
```

**Production:**
```bash
docker-compose -f docker-compose.prod.yml up
```

### Environment Variables

See [.env.example](./.env.example) for all required environment variables.

---

## Contributing

This is a private project. For questions or issues, contact the project owner.

---

## License

Proprietary - All rights reserved

---

## Contact

**Project Owner:** Roger Rudin
**Project:** Dwello - Swiss Property Management System

---

**Last Updated:** January 23, 2026
**Status:** Phase 0 - Project Initialization Complete
