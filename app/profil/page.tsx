'use client'

import { useState } from 'react'
import { ArrowLeft, ChevronRight, Pencil, Phone, Mail, UserRound } from 'lucide-react'
import { RequireAuth } from '@/components/auth-guard'
import { useAccountMe } from '@/api/auth'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { BottomNav } from '@/components/bottom-nav'

export default function ProfilPage() {
  const account: any = useAccountMe().data
  const [notifEnabled, setNotifEnabled] = useState(true)

  const onLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth')
    window.location.href = '/login'
  }

  const handleNotifToggle = async (val: boolean) => {
    setNotifEnabled(val)
    if (val && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          setNotifEnabled(false)
          toast.error('Izin notifikasi ditolak')
        } else {
          toast.success('Notifikasi diaktifkan')
        }
      } catch {
        setNotifEnabled(false)
      }
    }
  }

  return (
    <RequireAuth>
      <main className="min-h-screen bg-[#f7faf7] text-[#0e1b3b]">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
            <button
              type="button"
              aria-label="Kembali"
              onClick={() => window.history.back()}
              className="rounded-full p-2 text-[#2a8b3e] hover:bg-[#eef6f0]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="mx-auto text-center text-lg font-extrabold">Profil</h1>
            <div className="w-7" />
          </div>
        </header>

        <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-4">
          <section className="mb-4 flex flex-col items-center">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#e9f4ec] ring-2 ring-white">
                <UserRound className="h-12 w-12 text-[#2a8b3e]" />
              </div>
              <button
                type="button"
                aria-label="Ubah foto"
                className="absolute -right-1 bottom-1 rounded-full bg-white p-2 shadow ring-1 ring-[#e6eee8]"
                onClick={() => toast.info('Fitur ubah foto segera hadir')}
              >
                <Pencil className="h-4 w-4 text-[#2a8b3e]" />
              </button>
            </div>
            <p className="mt-3 text-2xl font-extrabold">{account?.usr_full_name ?? 'Akun'}</p>
            <p className="text-sm font-semibold text-[#2a8b3e]">Akun Orang Tua</p>
          </section>

          <p className="mb-2 text-xs font-bold tracking-widest text-[#7aa485]">INFORMASI ORANG TUA</p>
          <section className="mb-5 space-y-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-[#e6eee8]">
            <div className="flex items-center gap-3 rounded-xl px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6f0] text-[#2a8b3e]">
                <UserRound className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#7b8db0]">Nama Lengkap</p>
                <p className="text-sm font-bold">{account?.usr_full_name ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6f0] text-[#2a8b3e]">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#7b8db0]">Nomor Telepon</p>
                <p className="text-sm font-bold">{account?.phone ?? '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6f0] text-[#2a8b3e]">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#7b8db0]">Email</p>
                <p className="text-sm font-bold">{account?.usr_email ?? '-'}</p>
              </div>
            </div>
          </section>

          <p className="mb-2 text-xs font-bold tracking-widest text-[#7aa485]">ANAK TERDAFTAR</p>
          <section className="mb-5 space-y-2">
            {(account?.santri_ids ?? []).map((s: any) => (
              <button
                key={s.id}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-[#e6eee8]"
                onClick={() => toast.info(`Profil santri: ${s.nama}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef6f0] text-[#2a8b3e]">
                    <span className="text-sm font-extrabold">
                      {String(s?.nama ?? '?').trim().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0f2147]">{s?.nama ?? '-'}</p>
                    <p className="text-xs font-semibold text-[#7b8db0]">{s?.tingkat_kelas ? `Kelas ${s?.tingkat_kelas}` : 'Kelas -'}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-[#9db3a4]" />
              </button>
            ))}
          </section>
{/* 
          <p className="mb-2 text-xs font-bold tracking-widest text-[#7aa485]">PENGATURAN APLIKASI</p> */}
          {/* <section className="space-y-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-[#e6eee8]">
            <div className="flex items-center justify-between rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6f0] text-[#2a8b3e]">
                  <span className="text-sm font-extrabold">🔔</span>
                </div>
                <p className="text-sm font-bold">Notifikasi</p>
              </div>
              <Switch checked={notifEnabled} onCheckedChange={handleNotifToggle} />
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left"
              onClick={() => toast.info('Pengaturan bahasa segera hadir')}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6f0] text-[#2a8b3e]">
                  <span className="text-sm font-extrabold">🌐</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Bahasa</p>
                  <p className="text-xs font-semibold text-[#7b8db0]">Bahasa Indonesia</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#9db3a4]" />
            </button>
          </section> */}

          <div className="mt-6">
            <button
              type="button"
              onClick={onLogout}
              className="mx-auto block w-full rounded-2xl bg-[#ffe8e8] py-3 font-bold text-[#d34b4b] ring-1 ring-[#ffd6d6] transition hover:bg-[#ffdede]"
            >
              Keluar Sesi
            </button>
          </div>

          <p className="mt-6 text-center text-[11px] font-semibold tracking-wide text-[#95a6c5]">
            Santri App V0.1.0
          </p>
        </div>

        <BottomNav active="profil" />
      </main>
    </RequireAuth>
  )
}
