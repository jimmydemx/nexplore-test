interface Duty {
    id: string;
    name: string;
}


export type DutiesVo = Duty[];


export type DutyDto = Duty;


export enum DutyActions {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    COMPLETE = 'COMPLETE',
    UNCOMPLETE = 'UNCOMPLETE',
    DELETE = 'DELETE',
}



