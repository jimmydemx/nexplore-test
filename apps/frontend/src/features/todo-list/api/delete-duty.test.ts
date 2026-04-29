
import { deleteDuty } from './delete-duty';

function createMockResponse<T>(data: T, status: number) {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => data,
    } as Response;
}

describe('deleteDuty', () => {
    const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

    beforeEach(() => {
        fetchMock.mockReset();
        globalThis.fetch = fetchMock;
    });

    it('deletes a duty by id through the API', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            status: 204,
            json: async () => undefined,
        } as Response);

        await deleteDuty('1');

        expect(fetchMock).toHaveBeenCalledWith('/api/duties/1', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: undefined,
        });
    });

    it('surfaces API errors when deletion fails', async () => {
        fetchMock.mockResolvedValue(
            createMockResponse({ message: 'Duty not found.' }, 404),
        );

        await expect(deleteDuty('missing-id')).rejects.toThrow('Duty not found.');
    });
});