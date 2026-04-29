import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './todo-item';

describe('TodoItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows completed status correctly', () => {
        const duty = { id: '1', name: 'Duty 1', completed: true };

        render(
            <TodoItem
                duty={duty}
                onChangeCompletion={jest.fn()}
                onDeleteDuty={jest.fn()}
                onModifyDuty={jest.fn().mockResolvedValue(undefined)}
            />,
        );

        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.queryByText('Active')).not.toBeInTheDocument();
    });

    it('calls onChangeCompletion correctly when checkbox is clicked', async () => {
        const user = userEvent.setup();
        const duty = { id: '1', name: 'Duty 1', completed: true };
        const onChangeCompletion = jest.fn();

        render(
            <TodoItem
                duty={duty}
                onChangeCompletion={onChangeCompletion}
                onDeleteDuty={jest.fn()}
                onModifyDuty={jest.fn().mockResolvedValue(undefined)}
            />,
        );

        await user.click(screen.getByRole('checkbox'));

        expect(onChangeCompletion).toHaveBeenCalledWith({
            id: '1',
            completed: false,
        });
    });

    it('shows an error when the renamed duty name is empty', async () => {
        const user = userEvent.setup();
        const duty = { id: '1', name: '  123 ', completed: true };
        const onChangeCompletion = jest.fn();
        const onModifyDuty = jest.fn().mockResolvedValue(undefined);

        render(
            <TodoItem
                duty={duty}
                onChangeCompletion={onChangeCompletion}
                onDeleteDuty={jest.fn()}
                onModifyDuty={onModifyDuty}
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Rename' }));
        const input = screen.getByRole('textbox');
        await user.clear(input);
        await user.keyboard('{Enter}');

        expect(screen.getByText('Duty name cannot be empty.')).toBeInTheDocument();
        expect(onModifyDuty).not.toHaveBeenCalled();
    });

});
