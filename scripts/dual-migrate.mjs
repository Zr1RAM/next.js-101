import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const prisma = new PrismaClient();

async function showStatus() {
  console.log('\n========================================');
  console.log('       DUAL MIGRATION STATUS            ');
  console.log('========================================\n');

  // 1. Flyway history
  console.log('--- Flyway History (`flyway_schema_history`) ---');
  try {
    const flywayRecords = await prisma.flyway_schema_history.findMany({
      orderBy: { installed_rank: 'asc' },
    });
    if (flywayRecords.length === 0) {
      console.log('  (No migrations found in flyway_schema_history)');
    } else {
      console.table(
        flywayRecords.map((r) => ({
          Rank: r.installed_rank,
          Version: r.version,
          Description: r.description,
          Script: r.script,
          InstalledBy: r.installed_by,
          Success: r.success,
          Date: r.installed_on?.toISOString().split('T')[0],
        }))
      );
    }
  } catch (err) {
    console.log('  Failed to read flyway_schema_history:', err.message);
  }

  // 2. Prisma migrations
  console.log('\n--- Prisma Migrations (`_prisma_migrations`) ---');
  let prismaRecords = [];
  try {
    prismaRecords = await prisma.$queryRawUnsafe(
      'SELECT id, migration_name, finished_at, applied_steps_count FROM _prisma_migrations ORDER BY started_at ASC'
    );
    if (prismaRecords.length === 0) {
      console.log('  (No migrations applied yet in _prisma_migrations)');
    } else {
      console.table(
        prismaRecords.map((r) => ({
          Migration: r.migration_name,
          AppliedSteps: r.applied_steps_count,
          FinishedAt: r.finished_at?.toISOString().split('T')[0] ?? 'N/A',
        }))
      );
    }
  } catch {
    console.log('  `_prisma_migrations` table does not exist yet (no Prisma migrations deployed).');
  }

  // 3. Local migration directory check
  const migrationsDir = path.join(rootDir, 'prisma', 'migrations');
  if (fs.existsSync(migrationsDir)) {
    const localDirs = fs
      .readdirSync(migrationsDir)
      .filter((name) => fs.statSync(path.join(migrationsDir, name)).isDirectory());
    
    const appliedNames = new Set(prismaRecords.map((r) => r.migration_name));
    const pending = localDirs.filter((dir) => !appliedNames.has(dir));

    console.log('\n--- Local Migration Folders ---');
    console.log(`  Total in prisma/migrations: ${localDirs.length}`);
    if (pending.length > 0) {
      console.log(`  ⚠️ Pending Prisma migrations (${pending.length}):`);
      pending.forEach((p) => console.log(`    - ${p}`));
    } else {
      console.log('  ✅ All local Prisma migrations are marked as applied in DB.');
    }
  }
  console.log('\n');
}

async function applyMigrations() {
  console.log('\n[1/4] Running pre-flight checks...');
  await showStatus();

  console.log('[2/4] Deploying migrations to Neon via Prisma...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit', cwd: rootDir });
  } catch (err) {
    // If Prisma complains about non-empty database (P3005), auto-baseline pending migrations
    console.log('\n⚠️ Database was created outside Prisma. Baselining unapplied migrations...');
    const migrationsDir = path.join(rootDir, 'prisma', 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const localDirs = fs
        .readdirSync(migrationsDir)
        .filter((name) => fs.statSync(path.join(migrationsDir, name)).isDirectory());
      for (const dir of localDirs) {
        try {
          execSync(`npx prisma migrate resolve --applied "${dir}"`, { stdio: 'inherit', cwd: rootDir });
          console.log(`  -> Baselined migration: ${dir}`);
        } catch (resolveErr) {
          console.error(`  Could not resolve ${dir}:`, resolveErr.message);
        }
      }
    }
  }

  console.log('[3/4] Ensuring Flyway schema history is synchronized...');
  // Inspect if any local migrations are missing from flyway_schema_history
  const migrationsDir = path.join(rootDir, 'prisma', 'migrations');
  if (fs.existsSync(migrationsDir)) {
    const localDirs = fs
      .readdirSync(migrationsDir)
      .filter((name) => fs.statSync(path.join(migrationsDir, name)).isDirectory());

    const flywayRecords = await prisma.flyway_schema_history.findMany();
    const recordedScripts = new Set(flywayRecords.map((r) => r.script));

    for (const dir of localDirs) {
      const scriptName = `${dir}.sql`;
      if (!recordedScripts.has(scriptName)) {
        console.log(`  -> Adding missing record to flyway_schema_history for: ${dir}`);
        const maxRankResult = await prisma.flyway_schema_history.aggregate({
          _max: { installed_rank: true },
        });
        const nextRank = (maxRankResult._max.installed_rank || 0) + 1;
        const description = dir.replace(/^\d+_/, '').replace(/_/g, ' ');

        await prisma.flyway_schema_history.create({
          data: {
            installed_rank: nextRank,
            version: String(nextRank),
            description: description,
            type: 'SQL',
            script: scriptName,
            installed_by: 'prisma',
            execution_time: 1,
            success: true,
          },
        });
        console.log(`     Recorded as Rank ${nextRank} (Version ${nextRank})`);
      }
    }
  }

  console.log('[4/4] Generating updated Prisma Client types...');
  await prisma.$disconnect();
  try {
    execSync('npx prisma generate', { stdio: 'inherit', cwd: rootDir });
  } catch (genErr) {
    if (genErr.message.includes('EPERM')) {
      try {
        const dllPath = path.join(rootDir, 'node_modules', '.prisma', 'client', 'query_engine-windows.dll.node');
        const oldDllPath = `${dllPath}.old`;
        if (fs.existsSync(dllPath)) {
          fs.renameSync(dllPath, oldDllPath);
          execSync('npx prisma generate', { stdio: 'inherit', cwd: rootDir });
          console.log('  -> Auto-recovered from Windows file lock via DLL rotation.');
        }
      } catch {
        console.log(
          '  ⚠️ Notice: Prisma engine file is locked (common on Windows when dev server is running).'
        );
        console.log('     Restart `npm run dev` to reload updated types.');
      }
    } else {
      console.warn('  Warning: prisma generate failed:', genErr.message);
    }
  }

  console.log('\n✅ Migration and synchronization complete!');
  await showStatus();
}

async function main() {
  const command = process.argv[2] || 'status';
  try {
    if (command === 'status') {
      await showStatus();
    } else if (command === 'apply') {
      await applyMigrations();
    } else {
      console.log(`Unknown command: ${command}. Use "status" or "apply".`);
    }
  } catch (error) {
    console.error('Error executing command:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
