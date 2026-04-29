import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoListPage } from './todo-list-page';
import { renderWithProviders } from '../test/render-with-providers';
import { getMockDuties, resetMockDuties } from '../features/todo-list/api/mock-duties';

describe('TodoListPage', () => {
    beforeEach(() => {
        resetMockDuties();
        jest.clearAllMocks();
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
            expect(getMockDuties()).toEqual(
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