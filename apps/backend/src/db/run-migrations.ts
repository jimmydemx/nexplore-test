import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { Pool } from 'pg';
import { loadEnv } from '../load-env';

loadEnv();

type AppliedMigrationRow = {
    filename: string;
};

async function ensureMigrationsTable(pool: Pool) {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename TEXT PRIMARY KEY,
            executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);
}

async function getPendingMigrationFiles(pool: Pool, migrationsDir: string) {
    const [migrationFiles, appliedResult] = await Promise.all([
        readdir(migrationsDir),
        pool.query<AppliedMigrationRow>('SELECT filename FROM schema_migrations'),
    ]);

    const appliedMigrations = new Set(appliedResult.rows.map((row) => row.filename));

    return migrationFiles
        .filter((filename) => filename.endsWith('.sql'))
        .sort((left, right) => left.localeCompare(right))
        .filter((filename) => !appliedMigrations.has(filename));
}

async function applyMigration(pool: Pool, migrationsDir: string, filename: string) {
    const sql = await readFile(path.join(migrationsDir, filename), 'utf8');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
            'INSERT INTO schema_migrations (filename) VALUES ($1)',
            [filename],
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function runMigrations() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error('DATABASE_URL is required to run migrations.');
    }

    const pool = new Pool({ connectionString });
    const migrationsDir = path.resolve(__dirname, 'migrations');

    try {
        await ensureMigrationsTable(pool);

        const pendingMigrationFiles = await getPendingMigrationFiles(pool, migrationsDir);

        if (pendingMigrationFiles.length === 0) {
            console.log('No pending migrations.');
            return;
        }

        for (const filename of pendingMigrationFiles) {
            console.log(`Applying migration: ${filename}`);
            await applyMigration(pool, migrationsDir, filename);
        }

        console.log(`Applied ${pendingMigrationFiles.length} migration(s).`);
    } finally {
        await pool.end();
    }
}

void runMigrations().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown migration error';
    console.error(message);
    process.exitCode = 1;
});