import type { DutyDto } from '@nexplore-test/shared-types';
import { updateMockDuty } from './mock-duties';

export type ModifyDutyInput = {
    id: string;
    duty: DutyDto;
};

export async function modifyDuty({ id, duty }: ModifyDutyInput) {
    return Promise.resolve(updateMockDuty(id, duty));
}