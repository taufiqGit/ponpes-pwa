'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2, Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useLogin } from '@/api/auth'
import { useAuthStore } from '@/store/auth'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email atau No. Handphone wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  rememberMe: z.boolean().default(false),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const setUser = useAuthStore((state) => state.setUser)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
  })

  const { mutate: login, isPending } = useLogin({
    onSuccess: (data) => {
      const user = (data as any)?.user ?? (data as any)?.data?.user ?? null
      const token =
        (data as any)?.access_token ??
        (data as any)?.token ??
        (data as any)?.data?.access_token ??
        (data as any)?.data?.token

      const displayName =
        user?.usr_full_name ??
        user?.name ??
        'User'

      setUser(user)
      toast.success('Login berhasil!', {
        description: `Selamat datang kembali, ${displayName}`,
      })

      if (!token) {
        toast.error('Login gagal', {
          description: 'Token tidak ditemukan dari response login.',
        })
        return
      }

      try {
        localStorage.setItem('auth_token', token)
        router.push('/')
        router.refresh()
      } catch (error) {
        toast.error('Login gagal', {
          description:
            error instanceof Error
              ? error.message
              : 'Terjadi kesalahan saat menyimpan token',
        })
      }
    },
    onError: (error: any) => {
      toast.error('Login gagal', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan saat login',
      })
    },
  })

  async function onSubmit(data: LoginFormValues) {
    login({ identifier: data.identifier, usr_password: data.password })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Email atau No. Handphone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="santri@pesantren.com"
                      className="pl-9 bg-card bg-white dark:bg-white text-black placeholder:text-muted-foreground"
                      {...field}
                      disabled={isPending}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-gray-900">Password</FormLabel>
                  <a
                    href="#"
                    className="text-sm font-medium text-green-600 hover:text-green-500 hover:underline"
                    onClick={(e) => {
                      e.preventDefault()
                      toast.info('Fitur lupa password belum tersedia')
                    }}
                  >
                    Lupa Password?
                  </a>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-9 pr-9 bg-card bg-white dark:bg-white text-black placeholder:text-muted-foreground"
                      {...field}
                      disabled={isPending}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-9 w-9 px-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isPending}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">Toggle password visibility</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-gray-900">
                    Ingat saya
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              Masuk ke Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
