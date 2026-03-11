'use client'

import { PropsWithChildren, useState } from 'react'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { reactQueryDefaultOptions } from '@/lib/react-query'

export function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: reactQueryDefaultOptions,
        queryCache: new QueryCache({
          onError: (error, query) => {
            toast.error(
              `Query gagal: ${query.meta?.errorMessage ?? error.message}`,
            )
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _, __, mutation) => {
            toast.error(
              `Mutasi gagal: ${mutation.meta?.errorMessage ?? error.message}`,
            )
          },
        }),
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
