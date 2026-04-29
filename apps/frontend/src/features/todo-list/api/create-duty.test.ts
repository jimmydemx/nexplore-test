import { createDuty } from './create-duty';
import { getMockDuties, resetMockDuties } from './mock-duties';

describe('createDuty', () => {
    beforeEach(() => {
        resetMockDuties();
    });

    it('creates a trimmed active duty in the mock store', async () => {
        await createDuty({ name: '  Buy milk  ' });

        const duties = getMockDuties();
        const createdDuty = duties.at(-1);

        expect(createdDuty).toEqual(
            expect.objectContaining({
                name: 'Buy milk',
                completed: false,
            }),
        );
    });

    it('rejects empty duty names', async () => {
        await expect(createDuty({ name: '   ' })).rejects.toThrow('Duty name cannot be empty.');
    });
});