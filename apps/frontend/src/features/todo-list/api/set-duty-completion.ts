import { setMockDutyCompletion } from './mock-duties';

export type SetDutyCompletionInput = {
    id: string;
    completed: boolean;
};

export async function setDutyCompletion({
    id,
    completed,
}: SetDutyCompletionInput) {
    return Promise.resolve(setMockDutyCompletion(id, completed));
}