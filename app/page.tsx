'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  EllipsisVertical,
  Megaphone,
  Star,
  UserRound,
  Wallet,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ReactQueryDemo } from '@/components/react-query-demo'
import { useAuthStore } from '@/store/auth'
import { useAccountMe } from '@/api/auth'
import { useTagihanCheckLunas } from '@/api/santri'
import { RequireAuth } from '@/components/auth-guard'
import { BottomNav } from '@/components/bottom-nav'

type Student = {
  id: string
  name: string
}

type ScheduleItem = {
  id: string
  time: string
  period: 'PAGI' | 'SIANG'
  subject: string
  teacher: string
  location: string
}

const students: Student[] = [
  { id: 'zaidan', name: 'Muhammad Zaidan (Kelas 8A)' },
  { id: 'fatimah', name: 'Siti Fatimah (Kelas 7B)' },
  { id: 'hamzah', name: 'Muhammad Hamzah (Kelas 9C)' },
]

const schedules: ScheduleItem[] = [
  {
    id: '1',
    time: '07:30',
    period: 'PAGI',
    subject: 'Tahfidz Quran',
    teacher: 'Ustadz Mansur',
    location: 'Masjid Utama',
  },
  {
    id: '2',
    time: '09:00',
    period: 'PAGI',
    subject: 'Bahasa Arab',
    teacher: 'Ustadzah Maryam',
    location: 'Ruang 204',
  },
]

const quickMenus = [
  { key: 'nilai', label: 'Lihat Nilai', icon: Star },
  { key: 'pengumuman', label: 'Pengumuman', icon: BookOpen },
  { key: 'pembayaran', label: 'Pembayaran', icon: Wallet },
  { key: 'profil', label: 'Profil Santri', icon: UserRound },
]

export default function Page() {
  const account: any = useAccountMe().data
  const user = useAuthStore((state) => state.user)
  const selectedStudentId = useAuthStore((state) => state.selectedStudentId)
  const setSelectedStudentId = useAuthStore((state) => state.setSelectedStudentId)
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('beranda')

  const { bulan, tahun } = useMemo(() => {
    const now = new Date()
    return { bulan: now.getMonth() + 1, tahun: now.getFullYear() }
  }, [])

  const sppParams = useMemo(
    () =>
      selectedStudentId
        ? {
            sytg_santri_id: selectedStudentId,
            sytg_bulan: bulan,
            sytg_tahun: tahun,
          }
        : undefined,
    [bulan, selectedStudentId, tahun],
  )

  const spp = useTagihanCheckLunas(sppParams)
  const isSppLunas = Boolean(spp.data?.data?.is_lunas)

  const bulanTahunLabel = useMemo(() => {
    const bulanNama = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ][Math.max(1, Math.min(12, bulan)) - 1]

    return `${bulanNama} ${tahun}`
  }, [bulan, tahun])

  useEffect(() => {
    const firstId = account?.santri_ids?.[0]?.id
    if (!firstId) return

    if (!selectedStudentId) {
      setSelectedStudentId(firstId)
      return
    }

    const exists = Boolean(account?.santri_ids?.some((s: any) => s?.id === selectedStudentId))
    if (!exists) setSelectedStudentId(firstId)
  }, [account?.santri_ids, selectedStudentId, setSelectedStudentId])

  const selectedStudent = useMemo(
    () =>
      account?.santri_ids?.find((student: any) => student.id === selectedStudentId) ??
      account?.santri_ids?.[0],
    [selectedStudentId, account?.santri_ids],
  )

  return (
    <RequireAuth>
    <main className="min-h-screen bg-[#f7faf7] text-[#0e1b3b]">
      <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 md:px-6 md:pt-6">
        <div className="mx-auto max-w-3xl space-y-5 md:space-y-6">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8] md:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffd9b8] text-[#2a8b3e]">
                  <UserRound className="h-6 w-6" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-[#6b7c9f]">Portal Orang Tua</p>
                  <p className="text-xl font-extrabold text-[#2a8b3e]">{account?.usr_full_name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-[#6b7c9f]"
                onClick={() => toast.info('Belum ada notifikasi baru')}
                aria-label="Lihat notifikasi"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </section>

          <section className="space-y-1">
            <h1 className="text-xl font-extrabold leading-tight md:text-4xl">
              Assalamu&apos;alaikum, <span className="text-[#2a8b3e]">Bapak/Ibu {account?.usr_full_name}</span>
            </h1>
            <p className="text-base text-[#5e7096] md:text-lg">
              Selamat datang kembali di Pondok Annasriyah
            </p>
          </section>

          <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8] md:p-5">
            <p className="text-md font-bold tracking-wide text-[#7b8db0]">Pilih Santri</p>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl bg-[#f6fbf7] px-5 py-4 text-left font-bold text-[#12244b] ring-1 ring-[#e4eee7] transition hover:bg-[#eff8f0]"
                onClick={() => setIsStudentPickerOpen((prev) => !prev)}
                aria-expanded={isStudentPickerOpen}
                aria-controls="student-picker-list"
              >
                <span className="text-sm">{selectedStudent?.nama}</span>
                <ChevronDown
                  className={`h-6 w-6 text-[#2a8b3e] transition-transform ${isStudentPickerOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isStudentPickerOpen && (
                <div
                  id="student-picker-list"
                  className="rounded-2xl border border-[#ddebe0] bg-white p-2"
                >
                  {account?.santri_ids?.map((student: any) => (
                    <button
                      key={student.id}
                      type="button"
                      className={`w-full rounded-xl px-3 py-2 text-left font-semibold transition ${
                        student.id === selectedStudentId
                          ? 'bg-[#2a8b3e] text-white'
                          : 'text-[#23406f] hover:bg-[#f2f7f3]'
                      }`}
                      onClick={() => {
                        setSelectedStudentId(student.id)
                        setIsStudentPickerOpen(false)
                        toast.success(`Santri aktif: ${student.nama}`)
                      }}
                    >
                      <span className="text-sm">{student.nama}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section
            className={`rounded-3xl p-5 shadow-sm ring-1 ${
              isSppLunas ? 'bg-[#eef7ef] ring-[#cfe3d3]' : 'bg-[#fff3e6] ring-[#f0d9bd]'
            }`}
          >
            <div className={`mb-3 flex items-center gap-2 ${isSppLunas ? 'text-[#2a8b3e]' : 'text-[#b45309]'}`}>
              <Wallet className="h-6 w-6" />
              <p className="text-md font-bold tracking-wide">STATUS SPP</p>
            </div>
            <p className="text-md font-extrabold text-[#0d1e45]">
              {!selectedStudentId
                ? 'Pilih santri'
                : spp.isLoading
                  ? 'Memuat...'
                  : spp.isError
                    ? 'Gagal memuat'
                    : isSppLunas
                      ? 'Lunas'
                      : 'Belum Lunas'}
            </p>
            <p className="mt-2 text-base font-medium text-[#6a7b9f]">Bulan: {bulanTahunLabel}</p>
            {!spp.isLoading && !spp.isError && !isSppLunas && spp.data?.messages ? (
              <p className="mt-1 text-sm font-semibold text-[#8a6b3f]">{spp.data.messages}</p>
            ) : null}
          </section>

          {/* <section className="rounded-3xl bg-[#16823a] px-5 py-4 text-white shadow-lg shadow-green-900/15">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  Pengumuman Terbaru
                </span>
                <p className="mt-2 text-md font-extrabold leading-tight">
                  Ujian Tengah Semester dimulai 15 Feb
                </p>
              </div>
              <Megaphone className="h-8 w-8 shrink-0" />
            </div>
          </section> */}

          {/* <section className="space-y-4">
            <p className="text-lg font-extrabold tracking-[0.08em] text-[#7488ad]">Menu Cepat</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickMenus.map((menu) => {
                const Icon = menu.icon
                return (
                  <button
                    key={menu.key}
                    type="button"
                    className="space-y-2 rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-[#e6eee8] transition hover:-translate-y-0.5 hover:shadow-md"
                    onClick={() => toast.info(`${menu.label} sedang disiapkan`)}
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4f8ff] text-[#2a8b3e]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-bold text-[#132650]">{menu.label}</p>
                  </button>
                )
              })}
            </div>
          </section> */}

          {/* <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-extrabold tracking-[0.08em] text-[#7488ad]">Jadwal Hari Ini</p>
              <button
                type="button"
                className="text-sm font-bold text-[#2a8b3e]"
                onClick={() => toast.info('Membuka semua jadwal')}
              >
                Lihat Semua
              </button>
            </div>
          </section> */}

          {/* <ReactQueryDemo /> */}
        </div>
      </div>

      <BottomNav active={activeNav} onChange={setActiveNav} />

      <button
        type="button"
        className="fixed bottom-24 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2a8b3e] text-white shadow-lg md:bottom-8 md:right-8"
        onClick={() => toast.info('Kalender kegiatan dibuka')}
        aria-label="Buka kalender"
      >
        <CalendarDays className="h-6 w-6" />
      </button>
    </main>
    </RequireAuth>
  )
}
