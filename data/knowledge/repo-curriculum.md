# Repository Curriculum & Practical Implementation Guide (`Zr1RAM/next.js-101`)

> **Ground Truth Note for AI Agent**:
> The conceptual points from external guides or PDFs describe the "what" and "why", but the code snippets in this repository represent the **modern, authoritative Next.js 16 implementation**. Always refer to this repository's architectural patterns when presenting practical use cases.

---

## Commit & Feature Milestone Map

### 1. Advanced Routing: Parallel Routes (`@slot`)
- **Key Commits**: `38e013f Parallel Routes`, `b335860 Marketing page setup for parallel routes example`
- **Location**: [`src/app/(marketing)/marketing`](file:///f:/Projects/NextJs/next.js-101/src/app/(marketing)/marketing)
- **Files**:
  - `layout.tsx`: Declares slots `{ children, metrics, audience, revenue }`.
  - `@metrics/page.tsx`, `@audience/page.tsx`, `@revenue/page.tsx`: Independent concurrent dashboard panels.
  - `default.tsx`: Fallbacks for slots.
- **Practical Use Case**: Rendering multiple sub-sections of a dashboard simultaneously with independent loading boundaries and isolated sub-routes.

---

### 2. Advanced Routing: Intercepting Routes (`(.)[slug]`) + Modals
- **Key Commits**: `0ca5251 Intercepting Routes`, `dcc9919 Blog pages rework to accomodate intercepting routes Implementation`
- **Location**: [`src/app/blog`](file:///f:/Projects/NextJs/next.js-101/src/app/blog)
- **Files**:
  - `layout.tsx`: Renders `{children}` alongside `{modal}`.
  - `@modal/(.)[slug]/page.tsx`: Intercepts route navigation to show post details in an overlay modal while keeping the blog feed visible in the background.
  - `@modal/default.tsx`: Renders `null` as fallback when no modal is open.
  - `[slug]/page.tsx`: Full standalone page when accessed directly or hard-refreshed.
- **Practical Use Case**: Instagram/Twitter-style feed overlays where clicking an item opens a modal overlay while updating the URL, but direct links or page refreshes load the full standalone page.

---

### 3. Middleware & Edge Auth with Proxy (`proxy.ts`)
- **Key Commits**: `b2eb5b6 Using proxy for auth middleware`, `5e6b784 proxy changes to secure more URLs`, `b04f05d updating proxy with blog and marketing links`
- **Location**: [`src/proxy.ts`](file:///f:/Projects/NextJs/next.js-101/src/proxy.ts)
- **Files**:
  - `src/proxy.ts`: Modern proxy middleware replacing legacy `middleware.ts`.
  - Configures `isPublicRoute` (e.g. `/login`, `/register`, `/blog`, `/marketing`, `/contact`, `/api/chat`).
  - Verifies JWT sessions for protected routes like `/profile`, `/tasks`, and API endpoints.
- **Practical Use Case**: Production session verification and conditional redirects before hitting route handlers or server components.

---

### 4. Server Actions & Optimistic UI
- **Key Commits**: `169f3d8 Calling Server Actions from Event Handlers`, `6fae736 Handling Pending & useOptimistic UI`, `1560980 Using server actions in form`, `dd05eee Server Actions (Revalidating Data After a Mutation)`
- **Location**: [`src/app/tasks`](file:///f:/Projects/NextJs/next.js-101/src/app/tasks), [`src/app/(auth)`](file:///f:/Projects/NextJs/next.js-101/src/app/(auth))
- **Practical Use Case**:
  - Invoking mutations directly with React 19 Server Actions without writing boilerplate API routes.
  - Using `useOptimistic` and `useTransition` for instantaneous client UI feedback while the server persists data.
  - Triggering `revalidatePath` to refresh server component cache.

---

### 5. Task Management CRUD, Prisma ORM & Database Migrations
- **Key Commits**: `a94973a Task Management / CRUD UI`, `cbb728c Dynamic API Routes / API Endpoints`, `a184cae Task management / CRUD service and repo`, `3e9cacf Migration: Tasks Table creation`, `0e37932 Prisma migration setup`
- **Location**: [`prisma/schema.prisma`](file:///f:/Projects/NextJs/next.js-101/prisma/schema.prisma), `src/services/`
- **Practical Use Case**:
  - Prisma ORM integrated with PostgreSQL.
  - Dynamic route handlers (`/api/tasks/[id]`).
  - Dual migration workflow balancing Next.js Prisma and Spring Boot Flyway.

---

### 6. Authentication & JWT Sessions
- **Key Commits**: `d0f010e JWT`, `a2c1b2c server-side authentication helper`, `13f1ee8 placed auth in session in auth libs folder`
- **Location**: `src/lib/auth/`, `src/app/(auth)/login`, `src/app/(auth)/register`
- **Practical Use Case**: Password hashing (`bcrypt`), cookie-based JWT signing (`jose`), and server-side authentication helpers (`getSession`).
