import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export type LoginPayload = {
  identifier: string
  usr_password: string
}

export type AuthUser = {
  id: string
  name: string
  email: string
  role: string
}

export type LoginSuccess = {
  success: true
  user: AuthUser
  token: string
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
