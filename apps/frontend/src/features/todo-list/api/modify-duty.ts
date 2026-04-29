import type { DutyDto } from '@nexplore-test/shared-types';
import { apiRequest } from '../../../lib/api-client';

export type ModifyDutyInput = {
    id: string;
    duty: DutyDto;
};

function normalizeDutyName(name: string) {
    const normalizedName = name.trim();

    if (!normalizedName) {
        throw new Error('Duty name cannot be empty.');
    }

    return normalizedName;
}

export async function modifyDuty({ id, duty }: ModifyDutyInput) {
    return apiRequest<DutyDto>(`/api/duties/${id}`, {
        method: 'PATCH',
        body: {
            name: normalizeDutyName(duty.name),
        },
    });
}