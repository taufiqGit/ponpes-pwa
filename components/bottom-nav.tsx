'use client'

import { toast } from 'sonner'
import { BookOpen, Megaphone, Star, UserRound, Wallet } from 'lucide-react'

type NavItem = {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export const navItems: NavItem[] = [
  { key: 'beranda', label: 'Beranda', icon: Star },
  { key: 'penilaian-kategori', label: 'Penilaian Kategori', icon: Wallet },
  { key: 'penilaian-kitab', label: 'Penilaian Kitab', icon: BookOpen },
  { key: 'riwayat-pembayaran', label: 'Riwayat Pembayaran', icon: Megaphone },
  { key: 'profil', label: 'Profil', icon: UserRound },
]

type Props = {
  active: string
  onChange?: (key: string) => void
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e3e9ee] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.key
          const testIdKey = item.key === 'riwayat-pembayaran' ? 'pembayaran' : item.key
          const href = item.key === 'beranda' ? '/' : `/${item.key}`
          return (
            <button
              key={item.key}
              type="button"
              data-testid={`nav-${testIdKey}`}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-center transition ${
                isActive ? 'text-[#16823a]' : 'text-[#8ea2c5] hover:text-[#2a8b3e]'
              }`}
              onClick={() => {
                onChange?.(item.key)
                window.location.href = href
                toast.info(`Menu ${item.label} dipilih`)
              }}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.key === 'pengumuman' && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#2a8b3e]" />
                )}
              </div>
              <span className="text-[11px] font-bold tracking-wide">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
