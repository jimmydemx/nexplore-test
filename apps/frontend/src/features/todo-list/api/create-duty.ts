import type { DutyDto } from '@nexplore-test/shared-types';
import { addMockDuty } from './mock-duties';

export type CreateDutyInput = Pick<DutyDto, 'name'> & Partial<Pick<DutyDto, 'id'>>;

function createDutyId() {
    return crypto.randomUUID();
}

export async function createDuty(duty: CreateDutyInput) {
    return Promise.resolve(
        addMockDuty({
            id: duty.id ?? createDutyId(),
            name: duty.name,
        }),
    );
}