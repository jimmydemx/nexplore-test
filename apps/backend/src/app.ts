import express, { type Express } from 'express';
import { Pool } from 'pg';

export function createApp(pool?: Pool): Express {
    const app = express();

    app.use(express.json());

    app.get('/', (_request, response) => {
        response.json({
            message: 'Hello from Express!',
            service: 'backend',
        });
    });

    app.get('/health', async (_request, response) => {
        if (!pool) {
            response.json({ status: 'ok', database: 'not-configured' });
            return;
        }

        try {
            await pool.query('SELECT 1');
            response.json({ status: 'ok', database: 'connected' });
        } catch {
            response.status(503).json({ status: 'error', database: 'unreachable' });
        }
    });

    return app;
}

export function createPool() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        return undefined;
    }

    return new Pool({ connectionString });
}