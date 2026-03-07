import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Page from '@/app/page'

describe('Homepage Santri App', () => {
  it('menampilkan elemen utama sesuai desain', () => {
    render(<Page />)

    expect(screen.getByText(/portal orang tua/i)).toBeInTheDocument()
    expect(screen.getByText(/assalamu'alaikum/i)).toBeInTheDocument()
    expect(screen.getByText(/status spp/i)).toBeInTheDocument()
    expect(screen.getByText(/menu cepat/i)).toBeInTheDocument()
    expect(screen.getByText(/jadwal hari ini/i)).toBeInTheDocument()
  })

  it('mengubah santri aktif saat memilih dari daftar', () => {
    render(<Page />)

    fireEvent.click(screen.getByRole('button', { name: /muhammad zaidan/i }))
    fireEvent.click(screen.getByRole('button', { name: /siti fatimah/i }))

    expect(screen.getByRole('button', { name: /siti fatimah/i })).toBeInTheDocument()
  })

  it('memindahkan status menu aktif di bottom navigation', () => {
    render(<Page />)

    const pembayaran = screen.getByTestId('nav-pembayaran')
    fireEvent.click(pembayaran)

    expect(pembayaran).toHaveAttribute('aria-current', 'page')
  })
})
