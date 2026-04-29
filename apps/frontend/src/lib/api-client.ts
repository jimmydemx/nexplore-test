type RequestOptions = {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
};

type ErrorResponse = {
    message?: string;
};

async function parseErrorMessage(response: Response) {
    try {
        const data = (await response.json()) as ErrorResponse;
        return data.message || `Request failed with status ${response.status}.`;
    } catch {
        return `Request failed with status ${response.status}.`;
    }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
    const response = await fetch(path, {
        method: options.method ?? 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response));
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}