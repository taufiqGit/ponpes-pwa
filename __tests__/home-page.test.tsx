import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import Page from '@/app/page'

vi.mock('@/api/auth', () => ({
  useAccountMe: () => ({
    data: {
      usr_full_name: 'Orang Tua',
      santri_ids: [
        { id: 'zaidan', nama: 'Muhammad Zaidan (Kelas 8A)', nis: '001' },
        { id: 'fatimah', nama: 'Siti Fatimah (Kelas 7B)', nis: '002' },
      ],
    },
  }),
}))

function renderPage() {
  localStorage.setItem('auth_token', 'test-token')
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>,
  )
}

describe('Homepage Santri App', () => {
  it('menampilkan elemen utama sesuai desain', () => {
    renderPage()

    expect(screen.getByText(/portal orang tua/i)).toBeInTheDocument()
    expect(screen.getByText(/assalamu'alaikum/i)).toBeInTheDocument()
    expect(screen.getByText(/status spp/i)).toBeInTheDocument()
    expect(screen.getByText(/menu cepat/i)).toBeInTheDocument()
    expect(screen.getByText(/jadwal hari ini/i)).toBeInTheDocument()
  })

  it('mengubah santri aktif saat memilih dari daftar', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /muhammad zaidan/i }))
    fireEvent.click(screen.getByRole('button', { name: /siti fatimah/i }))

    expect(screen.getByRole('button', { name: /siti fatimah/i })).toBeInTheDocument()
  })

  it('memindahkan status menu aktif di bottom navigation', () => {
    renderPage()

    const pembayaran = screen.getByTestId('nav-pembayaran')
    fireEvent.click(pembayaran)

    expect(pembayaran).toHaveAttribute('aria-current', 'page')
  })
})
