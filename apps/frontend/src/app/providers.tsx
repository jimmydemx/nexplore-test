import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 30,
        },
    },
})

export function AppProviders({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
}
