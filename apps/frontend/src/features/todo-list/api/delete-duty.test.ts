

import { deleteDuty } from './delete-duty';
import { getMockDuties, resetMockDuties } from './mock-duties';
describe('deleteDuty', () => {

    beforeEach(() => {
        resetMockDuties();
    });

    it('should delete a duty if id is in store', async () => {
        const duty = { id: '1', name: 'Duty 1' };
        await deleteDuty(duty.id);   
        expect(getMockDuties()).not.toContain(duty);
    });


        it('should not delete any duty if id is not in store', async () => {
        const duty = {id:'non-existent-id',name:'Duty not exist'};
        const length = getMockDuties().length;
        await deleteDuty(duty.id);
        expect(getMockDuties()).not.toContain(duty);
        expect(getMockDuties().length).toBe(length);

        })
});