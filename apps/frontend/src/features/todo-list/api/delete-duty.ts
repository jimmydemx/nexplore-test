import { removeMockDuty } from './mock-duties';

export async function deleteDuty(id: string) {
    return Promise.resolve(removeMockDuty(id));
}