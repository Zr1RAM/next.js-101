# Project Notes & Technical Debt

## Issue: Manual Server Restart & TypeScript Cache on Prisma Schema Changes

- **Status**: Backlogged (To Fix Later)
- **Component**: Prisma (`src/lib/prisma.ts`), Dev Server (`npm run dev`), Windows File Locking

### Symptoms
1. **Editor Type Error**: `Property '<model>' does not exist on type 'PrismaClient'`.
2. **Runtime Error**: When calling a newly created Prisma model via API endpoints, Node throws `TypeError: Cannot read properties of undefined (reading 'findMany')`.
3. **Generation Lock (`EPERM`)**: Running `npx prisma generate` fails with `EPERM: operation not permitted, rename ... query_engine-windows.dll.node`.

---

### Root Causes
1. **Windows DLL Lock**: While `npm run dev` is running, Node.js locks `node_modules/.prisma/client/query_engine-windows.dll.node`. Prisma cannot overwrite this file while Node holds it open.
2. **Next.js `globalThis` Singleton**: In dev mode, Next.js caches `globalThis.prisma` to avoid leaking database connections. When new models are added, the in-memory instance is not refreshed automatically until the dev server is restarted.
3. **IDE TSServer Cache**: The IDE's TypeScript language server caches `.d.ts` definitions in memory and does not detect that `node_modules/.prisma/client/index.d.ts` was regenerated.

---

### Current Manual Workaround
Whenever you add or update Prisma models / run migrations:
1. Stop `npm run dev` (<kbd>Ctrl</kbd> + <kbd>C</kbd>).
2. Run `npx prisma generate` (or `npm run db:migrate:dual`).
3. Restart `npm run dev`.
4. If the editor still shows a red squiggly line: press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> -> **`TypeScript: Restart TS Server`**.

---

### Planned Future Fixes (To Automate)
1. **Dev Proxy for `prisma` (`src/lib/prisma.ts`)**:
   Wrap `prisma` in a JavaScript `Proxy` during development so that if any accessed model property is missing on the cached instance, it automatically creates a fresh `new PrismaClient()` on the fly without restarting `npm run dev`.
2. **Windows DLL Rotation Script (`scripts/generate.mjs`)**:
   Add a script to rename `query_engine-windows.dll.node` to `.old` before running `prisma generate`, allowing it to succeed even while `npm run dev` is actively running.
3. **Alternative Engine (Neon Driver Adapter)**:
   Migrate to `@prisma/adapter-neon` with WebAssembly/driver adapters, eliminating the native Windows C++ DLL entirely.
