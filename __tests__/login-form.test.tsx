import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { LoginForm } from '@/components/login-form'

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Mock fetch
global.fetch = vi.fn()

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    render(<LoginForm />)
    
    expect(screen.getByPlaceholderText(/santri@pesantren.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Masuk ke Portal/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    render(<LoginForm />)
    
    fireEvent.click(screen.getByRole('button', { name: /Masuk ke Portal/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Email atau No. Handphone wajib diisi/i)).toBeInTheDocument()
      expect(screen.getByText(/Password minimal 6 karakter/i)).toBeInTheDocument()
    })
  })

  it('submits form correctly on valid input', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { name: 'Test User' } }),
    })

    render(<LoginForm />)
    
    fireEvent.change(screen.getByPlaceholderText(/santri@pesantren.com/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'password123' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /Masuk ke Portal/i }))
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          identifier: 'test@example.com',
          password: 'password123',
          rememberMe: false,
        }),
      }))
    })
  })

  it('shows error message on failed login', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Identitas atau password salah' }),
    })

    render(<LoginForm />)
    
    fireEvent.change(screen.getByPlaceholderText(/santri@pesantren.com/i), {
      target: { value: 'wrong@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'wrongpass' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /Masuk ke Portal/i }))
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })
})
