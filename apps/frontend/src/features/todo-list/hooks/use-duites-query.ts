import { useQuery } from '@tanstack/react-query';
import { fetchDuties } from '../api/fetch-duties';

export const dutiesQueryKey = ['duties'] as const;

export function useDutiesQuery() {
    const dutiesQuery = useQuery({
        queryKey: dutiesQueryKey,
        queryFn: fetchDuties,
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
    });

    return {
        duties: dutiesQuery.data ?? [],
        isLoading: dutiesQuery.isLoading,
        isError: dutiesQuery.isError,
        error: dutiesQuery.error,
        refetch: dutiesQuery.refetch,
    };
}