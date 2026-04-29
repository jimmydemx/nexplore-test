import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDuty, type CreateDutyInput } from '../api/create-duty';
import { deleteDuty } from '../api/delete-duty';
import { modifyDuty, type ModifyDutyInput } from '../api/modify-duty';
import {
    setDutyCompletion,
    type SetDutyCompletionInput,
} from '../api/set-duty-completion';
import { dutiesQueryKey } from './use-duites-query';

export function useDutyMutations() {
    const queryClient = useQueryClient();

    const createDutyMutation = useMutation({
        mutationFn: (input: CreateDutyInput) => createDuty(input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: dutiesQueryKey });
        },
    });

    const deleteDutyMutation = useMutation({
        mutationFn: (id: string) => deleteDuty(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: dutiesQueryKey });
        },
    });

    const modifyDutyMutation = useMutation({
        mutationFn: (input: ModifyDutyInput) => modifyDuty(input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: dutiesQueryKey });
        },
    });

    const setDutyCompletionMutation = useMutation({
        mutationFn: (input: SetDutyCompletionInput) => setDutyCompletion(input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: dutiesQueryKey });
        },
    });

    return {
        createDuty: createDutyMutation.mutateAsync,
        deleteDuty: deleteDutyMutation.mutateAsync,
        modifyDuty: modifyDutyMutation.mutateAsync,
        setDutyCompletion: setDutyCompletionMutation.mutateAsync,
        isCreating: createDutyMutation.isPending,
        isDeleting: deleteDutyMutation.isPending,
        isModifying: modifyDutyMutation.isPending,
        isSettingCompletion: setDutyCompletionMutation.isPending,
        createError: createDutyMutation.error,
        deleteError: deleteDutyMutation.error,
        modifyError: modifyDutyMutation.error,
        setCompletionError: setDutyCompletionMutation.error,
    };
}



