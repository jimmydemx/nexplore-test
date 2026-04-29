import { createDuty } from './create-duty';

function createMockResponse<T>(data: T, status: number) {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => data,
    } as Response;
}

describe('createDuty', () => {
    const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

    beforeEach(() => {
        fetchMock.mockReset();
        globalThis.fetch = fetchMock;
    });

    it('posts a trimmed active duty to the API', async () => {
        fetchMock.mockResolvedValue(
            createMockResponse({ id: '123', name: 'Buy milk', completed: false }, 201),
        );

        const createdDuty = await createDuty({ name: '  Buy milk  ' });

        expect(fetchMock).toHaveBeenCalledWith('/api/duties', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'Buy milk' }),
        });

        expect(createdDuty).toEqual({ id: '123', name: 'Buy milk', completed: false });
    });

    it('rejects empty duty names', async () => {
        await expect(createDuty({ name: '   ' })).rejects.toThrow('Duty name cannot be empty.');
        expect(fetchMock).not.toHaveBeenCalled();
    });
});