'use client'

import { useMemo, useState } from 'react'
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

const navItems = [
  { key: 'beranda', label: 'BERANDA', icon: Star },
  { key: 'pembayaran', label: 'PEMBAYARAN', icon: Wallet },
  { key: 'pelajaran', label: 'PELAJARAN', icon: BookOpen },
  { key: 'pengumuman', label: 'PENGUMUMAN', icon: Megaphone },
  { key: 'profil', label: 'PROFIL', icon: UserRound },
]

export default function Page() {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0].id)
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('beranda')

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) ?? students[0],
    [selectedStudentId],
  )

  return (
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
                  <p className="text-3xl font-extrabold text-[#2a8b3e]">Santri App</p>
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
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Assalamu&apos;alaikum, <span className="text-[#2a8b3e]">Bapak Ahmad</span>
            </h1>
            <p className="text-lg text-[#5e7096] md:text-xl">
              Selamat datang kembali di Pondok Annasriyah
            </p>
          </section>

          <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8] md:p-5">
            <p className="text-lg font-bold tracking-wide text-[#7b8db0]">PILIH SANTRI</p>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl bg-[#f6fbf7] px-5 py-4 text-left font-bold text-[#12244b] ring-1 ring-[#e4eee7] transition hover:bg-[#eff8f0]"
                onClick={() => setIsStudentPickerOpen((prev) => !prev)}
                aria-expanded={isStudentPickerOpen}
                aria-controls="student-picker-list"
              >
                <span className="text-xl">{selectedStudent.name}</span>
                <ChevronDown
                  className={`h-6 w-6 text-[#2a8b3e] transition-transform ${isStudentPickerOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isStudentPickerOpen && (
                <div
                  id="student-picker-list"
                  className="rounded-2xl border border-[#ddebe0] bg-white p-2"
                >
                  {students.map((student) => (
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
                        toast.success(`Santri aktif: ${student.name}`)
                      }}
                    >
                      {student.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-[#eef7ef] p-5 shadow-sm ring-1 ring-[#cfe3d3]">
            <div className="mb-3 flex items-center gap-2 text-[#2a8b3e]">
              <Wallet className="h-6 w-6" />
              <p className="text-xl font-bold tracking-wide">STATUS SPP</p>
            </div>
            <p className="text-5xl font-extrabold text-[#0d1e45]">Lunas</p>
            <p className="mt-2 text-lg font-medium text-[#6a7b9f]">Bulan: Januari 2024</p>
          </section>

          <section className="rounded-3xl bg-[#16823a] px-5 py-4 text-white shadow-lg shadow-green-900/15">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
                  PENGUMUMAN TERBARU
                </span>
                <p className="mt-2 text-3xl font-extrabold leading-tight">
                  Ujian Tengah Semester dimulai 15 Feb
                </p>
              </div>
              <Megaphone className="h-8 w-8 shrink-0" />
            </div>
          </section>

          <section className="space-y-4">
            <p className="text-3xl font-extrabold tracking-[0.08em] text-[#7488ad]">MENU CEPAT</p>
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
                    <p className="text-lg font-bold text-[#132650]">{menu.label}</p>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-extrabold tracking-[0.08em] text-[#7488ad]">JADWAL HARI INI</p>
              <button
                type="button"
                className="text-2xl font-bold text-[#2a8b3e]"
                onClick={() => toast.info('Membuka semua jadwal')}
              >
                Lihat Semua
              </button>
            </div>
            <div className="space-y-3">
              {schedules.map((item) => (
                <article
                  key={item.id}
                  className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-[#f5faf5] text-[#7d92b7]">
                      <span className="text-2xl font-extrabold text-[#90a3c5]">{item.time}</span>
                      <span className="text-base font-bold">{item.period}</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold text-[#0f2046]">{item.subject}</h3>
                      <p className="text-xl text-[#7085ad]">
                        {item.teacher} • {item.location}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Aksi untuk ${item.subject}`}
                    className="rounded-full p-2 text-[#9fb0ca] transition hover:bg-[#eff5f0] hover:text-[#2a8b3e]"
                    onClick={() => toast.info(`Detail ${item.subject} dibuka`)}
                  >
                    <EllipsisVertical className="h-6 w-6" />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <ReactQueryDemo />
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e3e9ee] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.key
            return (
              <button
                key={item.key}
                type="button"
                data-testid={`nav-${item.key}`}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-center transition ${
                  isActive ? 'text-[#16823a]' : 'text-[#8ea2c5] hover:text-[#2a8b3e]'
                }`}
                onClick={() => {
                  setActiveNav(item.key)
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

      <button
        type="button"
        className="fixed bottom-24 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2a8b3e] text-white shadow-lg md:bottom-8 md:right-8"
        onClick={() => toast.info('Kalender kegiatan dibuka')}
        aria-label="Buka kalender"
      >
        <CalendarDays className="h-6 w-6" />
      </button>
    </main>
  )
}
