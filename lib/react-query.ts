import { DefaultOptions } from '@tanstack/react-query'

export const reactQueryDefaultOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
    networkMode: 'online',
  },
  mutations: {
    retry: 0,
    networkMode: 'online',
  },
}
