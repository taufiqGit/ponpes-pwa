'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, CalendarDays, Megaphone, UserRound } from 'lucide-react'
import { RequireAuth } from '@/components/auth-guard'
import { BottomNav } from '@/components/bottom-nav'
import { usePengumumanDetail } from '@/api/pengumuman'

export default function PengumumanDetailPage() {
  const [activeNav, setActiveNav] = useState('beranda')
  const params = useParams()
  const idParam = (params as any)?.id as string | string[] | undefined
  const id = Array.isArray(idParam) ? idParam[0] : idParam
  const detail = usePengumumanDetail(id)
  const item = detail.data?.data

  const tanggalLabel = useMemo(() => {
    const raw = item?.start_date ?? item?.created_at ?? null
    if (!raw) return null

    const parsed = Date.parse(raw)
    if (!Number.isFinite(parsed)) return null

    return new Date(parsed).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [item?.created_at, item?.start_date])

  const title = item?.title ?? 'Detail Pengumuman'
  const baseUrlImage = `${process.env.NEXT_PUBLIC_URL_API}/static/photos/`

  return (
    <RequireAuth>
      <main className="min-h-screen bg-[#f7faf7] text-[#0e1b3b]">
        <header className="sticky top-0 z-40 border-b border-[#e6eee8] bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
            <button
              type="button"
              aria-label="Kembali"
              onClick={() => window.history.back()}
              className="rounded-full p-2 text-[#2a8b3e] hover:bg-[#eef6f0]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="mx-auto line-clamp-1 text-center text-lg font-extrabold">
              Pengumuman
            </h1>
            <div className="w-7" />
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 md:px-6 md:pt-6">
          <div className="mx-auto max-w-3xl space-y-4 md:space-y-5">
            {detail.isLoading ? (
              <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#e6eee8]">
                <div className="h-5 w-2/3 rounded-full bg-[#eef6f0]" />
                <div className="mt-3 h-4 w-1/2 rounded-full bg-[#f2f7f3]" />
                <div className="mt-5 space-y-2">
                  <div className="h-3 w-full rounded-full bg-[#f2f7f3]" />
                  <div className="h-3 w-11/12 rounded-full bg-[#f2f7f3]" />
                  <div className="h-3 w-10/12 rounded-full bg-[#f2f7f3]" />
                </div>
              </section>
            ) : detail.isError ? (
              <section className="rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-[#e6eee8]">
                <p className="text-sm font-extrabold text-[#0f2147]">
                  Gagal memuat detail pengumuman
                </p>
                <p className="mt-2 text-sm font-semibold text-[#6b7c9f]">
                  Silakan coba lagi.
                </p>
              </section>
            ) : !item ? (
              <section className="rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-[#e6eee8]">
                <p className="text-sm font-extrabold text-[#0f2147]">
                  Pengumuman tidak ditemukan
                </p>
                <p className="mt-2 text-sm font-semibold text-[#6b7c9f]">
                  {detail.data?.messages ?? 'Data tidak tersedia.'}
                </p>
              </section>
            ) : (
              <>
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b8f3f] via-[#16823a] to-[#0f6a2e] px-5 py-4 text-white shadow-lg shadow-green-900/15 ring-1 ring-white/10">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-black/10 blur-2xl" />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide">
                          Pengumuman
                        </span>
                        {tanggalLabel ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-extrabold text-white/90 ring-1 ring-white/10">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {tanggalLabel}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 text-lg font-extrabold leading-snug text-white">
                        {title}
                      </p>
                      {item.created_by ? (
                        <div className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-xs font-bold text-white/90 ring-1 ring-white/10">
                          <UserRound className="h-4 w-4" />
                          {item.created_by}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                      <Megaphone className="h-6 w-6" />
                    </div>
                  </div>
                </section>

                {item.image_url ? (
                  <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#e6eee8]">
                    <div className="relative aspect-[16/9] w-full bg-[#eef6f0]">
                      <img
                        src={baseUrlImage + item.image_url}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </section>
                ) : null}

                <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#e6eee8]">
                  {item.body ? (
                    <div className="whitespace-pre-wrap text-sm font-semibold leading-relaxed text-[#23406f]">
                      {item.body}
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-[#6b7c9f]">
                      Tidak ada isi pengumuman.
                    </p>
                  )}
                </section>
              </>
            )}
          </div>
        </div>

        <BottomNav active={activeNav} onChange={setActiveNav} />
      </main>
    </RequireAuth>
  )
}
