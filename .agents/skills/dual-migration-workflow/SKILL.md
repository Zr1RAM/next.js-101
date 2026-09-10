---
name: dual-migration-workflow
description: >-
  Use this skill whenever creating, applying, resolving, or inspecting database migrations
  in this repository where Prisma (Next.js) and Flyway (Spring Boot) share a PostgreSQL database.
---

# Dual-Migration Workflow (Prisma & Flyway)

This skill coordinates database changes between **Next.js (Prisma)** and **Spring Boot (Flyway)** on a shared Neon PostgreSQL database. It prevents schema drift, prevents accidental database resets, and keeps both `_prisma_migrations` and `flyway_schema_history` in sync.

---

## 1. Golden Rules for this Repository

1. **NEVER run `npx prisma migrate dev` interactively without caution**:
   - If Flyway created tables or columns not present in `schema.prisma`, Prisma detects "drift" and prompts: *"We need to reset the database. All data will be lost."*
   - **Never answer Yes to reset.** Always abort or answer `n`.
2. **Always ensure SQL statements are Idempotent**:
   - Use `ADD COLUMN IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`, etc., so changes do not fail if already executed by the other tool.
3. **Always log into both tables**:
   - Prisma tracks migrations in `_prisma_migrations`.
   - Flyway tracks migrations in `flyway_schema_history` with an incrementing integer `installed_rank`.

---

## 2. Step-by-Step Migration Procedure

### Phase 1: Pre-Flight Checks
Before creating or applying a new migration:
1. Check what Flyway has applied:
   ```bash
   npm run db:status
   ```
2. If Spring Boot added new tables/columns, pull them into `schema.prisma` without wiping:
   ```bash
   npm run db:pull
   ```
3. Inspect `flyway_schema_history` to know the latest `installed_rank`:
   ```sql
   SELECT COALESCE(MAX("installed_rank"), 0) + 1 AS next_rank FROM "flyway_schema_history";
   ```

### Phase 2: Authoring the Migration
When creating a new migration file (under `prisma/migrations/<timestamp>_<name>/migration.sql`):
1. Write the schema change using `IF NOT EXISTS`:
   ```sql
   -- AlterTable
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "example_field" VARCHAR(100);
   ```
2. Append the dual-log entry into `flyway_schema_history`:
   ```sql
   INSERT INTO "flyway_schema_history" (
     "installed_rank",
     "version",
     "description",
     "type",
     "script",
     "installed_by",
     "installed_on",
     "execution_time",
     "success"
   ) VALUES (
     (SELECT COALESCE(MAX("installed_rank"), 0) + 1 FROM "flyway_schema_history"),
     '<version>', -- e.g. '3', '4', or timestamp
     '<short_description>',
     'SQL',
     '<migration_folder_name>.sql',
     'prisma',
     NOW(),
     1,
     true
   );
   ```

### Phase 3: Deployment & Synchronization
Apply the migration safely using the CLI helper:
```bash
npm run db:migrate:dual
```
Or manually:
```bash
npx prisma migrate deploy
npx prisma generate
```

### Phase 4: Post-Flight Verification
Run `npm run db:status` to verify that both `_prisma_migrations` and `flyway_schema_history` display the newly applied migration.
