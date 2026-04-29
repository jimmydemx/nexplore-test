import type { DutyDto } from '@nexplore-test/shared-types';
import { apiRequest } from '../../../lib/api-client';

export type SetDutyCompletionInput = {
    id: string;
    completed: boolean;
};

export async function setDutyCompletion({
    id,
    completed,
}: SetDutyCompletionInput) {
    return apiRequest<DutyDto>(`/api/duties/${id}/completion`, {
        method: 'PATCH',
        body: { completed },
    });
}