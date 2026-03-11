import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export type LoginPayload = {
  identifier: string
  usr_password: string
}

export type AuthUser = {
  id?: string
  name?: string
  usr_full_name?: string
  email?: string
  role?: string
  santri_ids?: {
    id?: string
    nama?: string
    nis?: string
  }[]
}

export type LoginSuccess = {
  success: true
  user: AuthUser
  token?: string
  access_token?: string
}

export type LoginFailure = {
  success: false
  message: string
}

export async function loginApi(payload: LoginPayload): Promise<LoginSuccess> {
  const res = await axiosInstance.post('/api/auth/login', payload)
  return res.data as LoginSuccess
}

export function useLogin(
  options?: UseMutationOptions<LoginSuccess, Error, LoginPayload>,
) {
  return useMutation<LoginSuccess, Error, LoginPayload>({
    mutationKey: ['auth', 'login'],
    mutationFn: loginApi,
    meta: { errorMessage: 'Gagal login' },
    ...options,
  })
}

export type AccountMeSuccess = {
  success: true
  user: AuthUser
}

export type AccountMeFailure = {
  success: false
  message: string
}

export type AccountMeResponse = AccountMeSuccess | AccountMeFailure

export async function accountMeApi(): Promise<AccountMeResponse> {
  const res = await axiosInstance.get('/api/account/me')

  return res.data?.data as AccountMeResponse
}

export function useAccountMe(
  options?: UseQueryOptions<AccountMeResponse, Error>,
) {
  return useQuery<AccountMeResponse, Error>({
    queryKey: ['auth', 'me'],
    queryFn: accountMeApi,
    meta: { errorMessage: 'Gagal mengambil data akun' },
    ...options,
  })
}
