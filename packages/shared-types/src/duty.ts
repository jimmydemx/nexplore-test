interface Duty {
    id: string;
    name: string;
}


export type DutiesVo = Duty[];


export type DutyDto = Duty;


export const DutyActions = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    COMPLETE: 'COMPLETE',
    UNCOMPLETE: 'UNCOMPLETE',
    DELETE: 'DELETE',
} as const;

export type DutyActions = (typeof DutyActions)[keyof typeof DutyActions];



