import type { DutiesVo, DutyDto } from '@nexplore-test/shared-types';

const initialDuties: DutiesVo = [
    { id: '1', name: 'Duty 1', completed: false },
    { id: '2', name: 'Duty 2', completed: true },
    { id: '3', name: 'Duty 3', completed: false },
    { id: '4', name: 'Duty 4', completed: false },
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

export function setMockDutyCompletion(id: string, completed: boolean): DutiesVo {
    dutiesStore = dutiesStore.map((currentDuty) =>
        currentDuty.id === id
            ? {
                ...currentDuty,
                completed,
            }
            : currentDuty,
    );
    return getMockDuties();
}

export function removeMockDuty(id: string): DutiesVo {
    dutiesStore = dutiesStore.filter((duty) => duty.id !== id);
    return getMockDuties();
}