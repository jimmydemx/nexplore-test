import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoListPage } from './todo-list-page';
import { renderWithProviders } from '../test/render-with-providers';

type Duty = {
    id: string;
    name: string;
    completed: boolean;
};

function createMockResponse<T>(data: T, status: number) {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => data,
    } as Response;
}

describe('TodoListPage', () => {
    const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
    let dutiesStore: Duty[];

    beforeEach(() => {
        jest.clearAllMocks();
        dutiesStore = [
            { id: '1', name: 'Duty 1', completed: false },
            { id: '2', name: 'Duty 2', completed: true },
            { id: '3', name: 'Duty 3', completed: false },
            { id: '4', name: 'Duty 4', completed: false },
        ];

        fetchMock.mockReset();
        fetchMock.mockImplementation(async (input, init) => {
            const url = typeof input === 'string' ? input : input.toString();
            const method = init?.method ?? 'GET';

            if (url === '/api/duties' && method === 'GET') {
                return createMockResponse(dutiesStore, 200);
            }

            if (url === '/api/duties' && method === 'POST') {
                const body = JSON.parse((init?.body as string | undefined) ?? '{}') as { name?: string };
                const createdDuty = {
                    id: '5',
                    name: body.name ?? '',
                    completed: false,
                };

                dutiesStore = [...dutiesStore, createdDuty];

                return createMockResponse(createdDuty, 201);
            }

            throw new Error(`Unhandled fetch request: ${method} ${url}`);
        });

        globalThis.fetch = fetchMock;
    });

    it('renders the existing duties and summary stats', async () => {
        renderWithProviders(<TodoListPage />);

        expect(await screen.findByText('Duty 1')).toBeInTheDocument();
        expect(screen.getByText('Duty 2')).toBeInTheDocument();
        expect(screen.getByText('All')).toBeInTheDocument();
        expect(screen.getByText('Done')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows inline validation when trying to create an empty duty', async () => {
        const user = userEvent.setup();

        renderWithProviders(<TodoListPage />);

        await screen.findByText('Duty 1');
        await user.click(screen.getByRole('button', { name: 'Add duty' }));

        expect(screen.getByText('Duty name cannot be empty.')).toBeInTheDocument();
    });

    it('creates a new duty and refreshes the list', async () => {
        const user = userEvent.setup();

        renderWithProviders(<TodoListPage />);

        const input = await screen.findByPlaceholderText('Add a new duty');

        await user.type(input, 'Write page tests');
        await user.click(screen.getByRole('button', { name: 'Add duty' }));

        expect(await screen.findByText('Write page tests')).toBeInTheDocument();

        await waitFor(() => {
            expect(dutiesStore).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Write page tests',
                        completed: false,
                    }),
                ]),
            );
        });

        expect(input).toHaveValue('');
        expect(screen.queryByText('Duty name cannot be empty.')).not.toBeInTheDocument();
    });
});