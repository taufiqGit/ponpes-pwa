'use client'

import { useMemo } from 'react'
import { ArrowLeft, BookOpen, GraduationCap, UserRound } from 'lucide-react'
import { RequireAuth } from '@/components/auth-guard'
import { BottomNav } from '@/components/bottom-nav'
import { useAuthStore } from '@/store/auth'
import { usePenilaianKitabSantri } from '@/api/santri'
import { useAccountMe } from '@/api/auth'

export default function PenilaianKitabPage() {
  const selectedStudentId = useAuthStore((state) => state.selectedStudentId)
  const account: any = useAccountMe().data
  const { data, isLoading, isError } = usePenilaianKitabSantri(selectedStudentId)

  const records = useMemo(() => data?.records ?? [], [data?.records])
  const selectedStudentName = useMemo(() => {
    if (!selectedStudentId) return null
    const student = account?.santri_ids?.find((s: any) => String(s?.id) === String(selectedStudentId))
    return student?.nama ?? null
  }, [account?.santri_ids, selectedStudentId])

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
            <h1 className="mx-auto text-center text-lg font-extrabold">Penilaian Kitab</h1>
            <div className="w-7" />
          </div>
        </header>

        <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-4">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8]">
            <div className="flex items-center gap-3 border-b border-[#e6eee8] pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef6ff] text-[#2563eb]">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-[#0f2147]">Nilai Kitab Santri</h2>
                <p className="text-sm font-semibold text-[#6b7c9f]">
                  {selectedStudentId
                    ? selectedStudentName
                      ? selectedStudentName
                      : 'Santri terpilih'
                    : 'Pilih santri di Beranda'}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {!selectedStudentId && (
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#e6eee8]">
                  <p className="text-sm font-semibold text-[#6b7c9f]">
                    Silakan pilih santri terlebih dahulu di halaman Beranda.
                  </p>
                </div>
              )}

              {selectedStudentId &&
                isLoading &&
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-40 rounded bg-[#eef6f0]" />
                        <div className="mt-2 h-5 w-56 rounded bg-[#eef6f0]" />
                        <div className="mt-2 h-4 w-48 rounded bg-[#eef6f0]" />
                      </div>
                      <div className="h-8 w-14 rounded-full bg-[#eef6f0]" />
                    </div>
                    <div className="mt-4 h-14 rounded-xl bg-[#f7faf7] ring-1 ring-[#e6eee8]" />
                  </div>
                ))}

              {selectedStudentId && !isLoading && isError && (
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#e6eee8]">
                  <p className="text-sm font-semibold text-[#6b7c9f]">
                    Gagal memuat data penilaian kitab.
                  </p>
                </div>
              )}

              {selectedStudentId &&
                !isLoading &&
                !isError &&
                records.map((row, idx) => (
                  <div
                    key={`${row.kitab_kode ?? 'kitab'}-${row.sub_kitab_kode ?? 'sub'}-${idx}`}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold tracking-widest text-[#7aa485]">
                          {row.kitab_kode ?? 'KITAB'}
                        </p>
                        <p className="mt-1 text-base font-extrabold text-[#0f2147]">
                          {row.kitab_nama ?? '-'}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#6b7c9f]">
                          {row?.kode_penilaian ? `${row?.kode_penilaian}` : ''}
                          {row.sub_kitab_nama ?? '-'}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span className="inline-flex items-center rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-extrabold text-[#2563eb]">
                          {row.nilai ?? '-'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-[#f7faf7] p-3 ring-1 ring-[#e6eee8] sm:grid-cols-2">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#eef6f0] text-[#2a8b3e]">
                          <UserRound className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold tracking-widest text-[#7aa485]">
                            GURU
                          </p>
                          <p className="mt-1 truncate text-sm font-bold text-[#0f2147]">
                            {row.guru_nama ?? '-'}
                          </p>
                          <p className="mt-0.5 truncate text-xs font-semibold text-[#6b7c9f]">
                            {row.guru_bidang_keahlian ?? '-'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#eef6ff] text-[#2563eb]">
                          <GraduationCap className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold tracking-widest text-[#7aa485]">
                            NILAI
                          </p>
                          <p className="mt-1 text-sm font-bold text-[#0f2147]">
                            {row.nilai ?? '-'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-[11px] font-bold tracking-widest text-[#7aa485]">
                        Catatan
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#6b7c9f]">
                        {row.catatan ?? '-'}
                      </p>
                    </div>
                  </div>
                ))}

              {selectedStudentId && !isLoading && !isError && records.length === 0 && (
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#e6eee8]">
                  <p className="text-sm font-semibold text-[#6b7c9f]">
                    Belum ada penilaian kitab untuk santri ini.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <BottomNav active="penilaian-kitab" />
      </main>
    </RequireAuth>
  )
}
