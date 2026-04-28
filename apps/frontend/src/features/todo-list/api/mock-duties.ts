import type { DutiesVo, DutyDto } from '@nexplore-test/shared-types';

const initialDuties: DutiesVo = [
    { id: '1', name: 'Duty 1' },
    { id: '2', name: 'Duty 2' },
    { id: '3', name: 'Duty 3' },
    { id: '4', name: 'Duty 4' },
];

let dutiesStore: DutiesVo = [...initialDuties];

export function getMockDuties(): DutiesVo {
    return [...dutiesStore];
}

export function addMockDuty(duty: DutyDto): DutiesVo {
    dutiesStore = [...dutiesStore, duty];
    return getMockDuties();
}

export function updateMockDuty(id: string, duty: DutyDto): DutiesVo {
    dutiesStore = dutiesStore.map((currentDuty) =>
        currentDuty.id === id ? duty : currentDuty,
    );
    return getMockDuties();
}

export function removeMockDuty(id: string): DutiesVo {
    dutiesStore = dutiesStore.filter((duty) => duty.id !== id);
    return getMockDuties();
}