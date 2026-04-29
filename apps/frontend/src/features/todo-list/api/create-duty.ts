import type { DutyDto } from '@nexplore-test/shared-types';
import { apiRequest } from '../../../lib/api-client';

export type CreateDutyInput = Pick<DutyDto, 'name'> &
    Partial<Pick<DutyDto, 'id' | 'completed'>>;

function normalizeDutyName(name: string) {
    const normalizedName = name.trim();

    if (!normalizedName) {
        throw new Error('Duty name cannot be empty.');
    }

    return normalizedName;
}

export async function createDuty(duty: CreateDutyInput) {
    const name = normalizeDutyName(duty.name);

    return apiRequest<DutyDto>('/api/duties', {
        method: 'POST',
        body: {
            name,
        },
    });
}