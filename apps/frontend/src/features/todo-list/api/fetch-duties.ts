import { getMockDuties } from './mock-duties';

export async function fetchDuties() {
    return Promise.resolve(getMockDuties());
}