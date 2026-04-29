import type { DutiesVo } from '@nexplore-test/shared-types';
import { apiRequest } from '../../../lib/api-client';

export async function fetchDuties() {
    return apiRequest<DutiesVo>('/api/duties');
}