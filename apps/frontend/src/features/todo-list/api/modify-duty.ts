import type { DutyDto } from '@nexplore-test/shared-types';
import { updateMockDuty } from './mock-duties';

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
    return Promise.resolve(
        updateMockDuty(id, {
            ...duty,
            name: normalizeDutyName(duty.name),
        }),
    );
}