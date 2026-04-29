import { type Response, Router } from 'express';
import { type Pool } from 'pg';

type DutyRow = {
    id: string;
    name: string;
    completed: boolean;
    created_at: Date;
};

type DutyResponse = {
    id: string;
    name: string;
    completed: boolean;
    createdAt: string;
};

type CreateDutyBody = {
    name?: unknown;
};

type UpdateDutyBody = {
    name?: unknown;
};

type SetDutyCompletionBody = {
    completed?: unknown;
};

function mapDuty(row: DutyRow): DutyResponse {
    return {
        id: row.id,
        name: row.name,
        completed: row.completed,
        createdAt: row.created_at.toISOString(),
    };
}

function sendDatabaseUnavailable(response: Response) {
    response.status(503).json({ message: 'Database is not configured.' });
}

function requireDutyName(value: unknown) {
    if (typeof value !== 'string') {
        return undefined;
    }

    const normalizedName = value.trim();

    return normalizedName || undefined;
}

export function createDutiesRouter(pool?: Pool): Router {
    const router = Router();

    router.get('/', async (_request, response) => {
        if (!pool) {
            sendDatabaseUnavailable(response);
            return;
        }

        const result = await pool.query<DutyRow>(
            `SELECT id, name, completed, created_at
             FROM duties
             ORDER BY created_at DESC`,
        );

        response.json(result.rows.map(mapDuty));
    });

    router.post('/', async (request, response) => {
        if (!pool) {
            sendDatabaseUnavailable(response);
            return;
        }

        const name = requireDutyName((request.body as CreateDutyBody).name);

        if (!name) {
            response.status(400).json({ message: 'Duty name cannot be empty.' });
            return;
        }

        const result = await pool.query<DutyRow>(
            `INSERT INTO duties (name)
             VALUES ($1)
             RETURNING id, name, completed, created_at`,
            [name],
        );

        response.status(201).json(mapDuty(result.rows[0]));
    });

    router.patch('/:id', async (request, response) => {
        if (!pool) {
            sendDatabaseUnavailable(response);
            return;
        }

        const name = requireDutyName((request.body as UpdateDutyBody).name);

        if (!name) {
            response.status(400).json({ message: 'Duty name cannot be empty.' });
            return;
        }

        const result = await pool.query<DutyRow>(
            `UPDATE duties
             SET name = $2
             WHERE id = $1
             RETURNING id, name, completed, created_at`,
            [request.params.id, name],
        );

        if (result.rowCount === 0) {
            response.status(404).json({ message: 'Duty not found.' });
            return;
        }

        response.json(mapDuty(result.rows[0]));
    });

    router.patch('/:id/completion', async (request, response) => {
        if (!pool) {
            sendDatabaseUnavailable(response);
            return;
        }

        const completed = (request.body as SetDutyCompletionBody).completed;

        if (typeof completed !== 'boolean') {
            response
                .status(400)
                .json({ message: 'Completed must be a boolean value.' });
            return;
        }

        const result = await pool.query<DutyRow>(
            `UPDATE duties
             SET completed = $2
             WHERE id = $1
             RETURNING id, name, completed, created_at`,
            [request.params.id, completed],
        );

        if (result.rowCount === 0) {
            response.status(404).json({ message: 'Duty not found.' });
            return;
        }

        response.json(mapDuty(result.rows[0]));
    });

    router.delete('/:id', async (request, response) => {
        if (!pool) {
            sendDatabaseUnavailable(response);
            return;
        }

        const result = await pool.query('DELETE FROM duties WHERE id = $1', [
            request.params.id,
        ]);

        if (result.rowCount === 0) {
            response.status(404).json({ message: 'Duty not found.' });
            return;
        }

        response.status(204).send();
    });

    return router;
}