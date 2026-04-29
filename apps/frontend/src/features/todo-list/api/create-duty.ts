import type { DutyDto } from '@nexplore-test/shared-types';
import { addMockDuty } from './mock-duties';

export type CreateDutyInput = Pick<DutyDto, 'name'> &
    Partial<Pick<DutyDto, 'id' | 'completed'>>;

function createDutyId() {
    return crypto.randomUUID();
}

function normalizeDutyName(name: string) {
    const normalizedName = name.trim();

    if (!normalizedName) {
        throw new Error('Duty name cannot be empty.');
    }

    return normalizedName;
}

export async function createDuty(duty: CreateDutyInput) {
    const name = normalizeDutyName(duty.name);

    return Promise.resolve(
        addMockDuty({
            id: duty.id ?? createDutyId(),
            name,
            completed: duty.completed ?? false,
        }),
    );
}