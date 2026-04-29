import { apiRequest } from '../../../lib/api-client';

export async function deleteDuty(id: string) {
    return apiRequest<void>(`/api/duties/${id}`, {
        method: 'DELETE',
    });
}