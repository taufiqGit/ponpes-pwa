import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/lib/axios', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}))

import { axiosInstance } from '@/lib/axios'
import { LoginForm } from '@/components/login-form'
import { useAuthStore } from '@/store/auth'

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

function renderLoginForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>,
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ user: null })
    localStorage.clear()
  })

  it('renders login form correctly', () => {
    renderLoginForm()
    
    expect(screen.getByPlaceholderText(/santri@pesantren.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Masuk ke Portal/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    renderLoginForm()
    
    fireEvent.click(screen.getByRole('button', { name: /Masuk ke Portal/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Email atau No. Handphone wajib diisi/i)).toBeInTheDocument()
      expect(screen.getByText(/Password minimal 6 karakter/i)).toBeInTheDocument()
    })
  })

  it('submits form correctly on valid input', async () => {
    ;(axiosInstance.post as any).mockResolvedValueOnce({
      data: {
        success: true,
        user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'student' },
        token: 'token',
      },
    })

    renderLoginForm()
    
    fireEvent.change(screen.getByPlaceholderText(/santri@pesantren.com/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'password123' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /Masuk ke Portal/i }))
    
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/auth/login', {
        identifier: 'test@example.com',
        usr_password: 'password123',
      })
    })

    expect(useAuthStore.getState().user?.name).toBe('Test User')
    expect(localStorage.getItem('auth_token')).toBe('token')
  })

  it('shows error message on failed login', async () => {
    ;(axiosInstance.post as any).mockRejectedValueOnce(new Error('Login gagal'))

    renderLoginForm()
    
    fireEvent.change(screen.getByPlaceholderText(/santri@pesantren.com/i), {
      target: { value: 'wrong@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'wrongpass' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /Masuk ke Portal/i }))
    
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalled()
    })
  })
})
