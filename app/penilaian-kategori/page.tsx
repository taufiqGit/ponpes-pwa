'use client'

import { useMemo } from 'react'
import {
  ArrowLeft,
  Layers,
  BarChart3,
  Award,
  TrendingUp,
  TrendingDown,
  UserRound,
} from 'lucide-react'
import { RequireAuth } from '@/components/auth-guard'
import { BottomNav } from '@/components/bottom-nav'
import { useAuthStore } from '@/store/auth'
import { useAccountMe } from '@/api/auth'
import { usePenilaianSantri } from '@/api/santri'

function formatNilai(value: unknown) {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'number') return String(value)
  const asNumber = Number(value)
  if (!Number.isNaN(asNumber)) return String(asNumber)
  return String(value)
}

export default function PenilaianKategoriPage() {
  const selectedStudentId = useAuthStore((state) => state.selectedStudentId)
  const account: any = useAccountMe().data
  const { data, isLoading, isError } = usePenilaianSantri(selectedStudentId)

  const selectedStudentName = useMemo(() => {
    if (!selectedStudentId) return null
    const student = account?.santri_ids?.find(
      (s: any) => String(s?.id) === String(selectedStudentId),
    )
    return student?.nama ?? null
  }, [account?.santri_ids, selectedStudentId])

  const byKategori = useMemo(() => data?.by_kategori ?? [], [data?.by_kategori])
  const summary = data?.summary

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
            <h1 className="mx-auto text-center text-lg font-extrabold">Penilaian Kategori</h1>
            <div className="w-7" />
          </div>
        </header>

        <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-4">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8]">
            <div className="flex items-center gap-3 border-b border-[#e6eee8] pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef6ff] text-[#2563eb]">
                <Layers className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-[#0f2147]">Penilaian Santri</h2>
                <p className="text-sm font-semibold text-[#6b7c9f]">
                  {selectedStudentId
                    ? selectedStudentName
                      ? selectedStudentName
                      : data?.santri_info?.san_nama_lengkap ?? 'Santri terpilih'
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

              {selectedStudentId && summary && (
                <div className="rounded-2xl bg-[#f7faf7] p-4 ring-1 ring-[#e6eee8]">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-3 ring-1 ring-[#e6eee8]">
                      <div className="flex items-center gap-2 text-[#2a8b3e]">
                        <BarChart3 className="h-4 w-4" />
                        <p className="text-[11px] font-bold tracking-widest">TOTAL NILAI</p>
                      </div>
                      <p className="mt-2 text-lg font-extrabold text-[#0f2147]">
                        {formatNilai(summary.total_penilaian)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white p-3 ring-1 ring-[#e6eee8]">
                      <div className="flex items-center gap-2 text-[#2563eb]">
                        <Layers className="h-4 w-4" />
                        <p className="text-[11px] font-bold tracking-widest">KATEGORI</p>
                      </div>
                      <p className="mt-2 text-lg font-extrabold text-[#0f2147]">
                        {formatNilai(summary.total_kategori)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white p-3 ring-1 ring-[#e6eee8] sm:col-span-1 col-span-2">
                      <div className="flex items-center gap-2 text-[#b45309]">
                        <Award className="h-4 w-4" />
                        <p className="text-[11px] font-bold tracking-widest">RATA-RATA</p>
                      </div>
                      <p className="mt-2 text-lg font-extrabold text-[#0f2147]">
                        {formatNilai(summary.nilai_rata_rata)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedStudentId &&
                isLoading &&
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8]"
                  >
                    <div className="h-4 w-36 rounded bg-[#eef6f0]" />
                    <div className="mt-2 h-5 w-52 rounded bg-[#eef6f0]" />
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="h-12 rounded-xl bg-[#f7faf7] ring-1 ring-[#e6eee8]" />
                      <div className="h-12 rounded-xl bg-[#f7faf7] ring-1 ring-[#e6eee8]" />
                      <div className="h-12 rounded-xl bg-[#f7faf7] ring-1 ring-[#e6eee8]" />
                    </div>
                  </div>
                ))}

              {selectedStudentId && !isLoading && isError && (
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#e6eee8]">
                  <p className="text-sm font-semibold text-[#6b7c9f]">
                    Gagal memuat data penilaian kategori.
                  </p>
                </div>
              )}

              {selectedStudentId &&
                !isLoading &&
                !isError &&
                byKategori.map((kategori, idx) => (
                  <section
                    key={`${kategori.kategori_kode ?? 'kategori'}-${kategori.kategori_id ?? idx}`}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold tracking-widest text-[#7aa485]">
                          {kategori.kategori_kode ?? 'KATEGORI'}
                        </p>
                        <p className="mt-1 text-base font-extrabold text-[#0f2147]">
                          {kategori.kategori_nama ?? '-'}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[11px] font-bold tracking-widest text-[#7aa485]">
                          RATA-RATA
                        </p>
                        <p className="mt-1 text-base font-extrabold text-[#2a8b3e]">
                          {formatNilai(kategori.stats?.nilai_rata_rata)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[#f7faf7] p-3 ring-1 ring-[#e6eee8]">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[#2a8b3e]">
                          <TrendingUp className="h-4 w-4" />
                          <p className="text-[11px] font-bold tracking-widest">TERTINGGI</p>
                        </div>
                        <p className="mt-1 text-sm font-extrabold text-[#0f2147]">
                          {formatNilai(kategori.stats?.nilai_tertinggi)}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[#b45309]">
                          <TrendingDown className="h-4 w-4" />
                          <p className="text-[11px] font-bold tracking-widest">TERENDAH</p>
                        </div>
                        <p className="mt-1 text-sm font-extrabold text-[#0f2147]">
                          {formatNilai(kategori.stats?.nilai_terendah)}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[#2563eb]">
                          <BarChart3 className="h-4 w-4" />
                          <p className="text-[11px] font-bold tracking-widest">TOTAL</p>
                        </div>
                        <p className="mt-1 text-sm font-extrabold text-[#0f2147]">
                          {formatNilai(kategori.stats?.total_penilaian)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {(kategori.sub_kategori ?? []).map((sub, subIdx) => (
                        <div
                          key={`${sub.sub_kategori_id ?? subIdx}`}
                          className="rounded-2xl bg-white p-4 ring-1 ring-[#e6eee8]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold tracking-widest text-[#7aa485]">
                                SUB KATEGORI
                              </p>
                              <p className="mt-1 text-sm font-extrabold text-[#0f2147]">
                                {sub.sub_kategori_nama ?? '-'}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-[11px] font-bold tracking-widest text-[#7aa485]">
                                RATA-RATA
                              </p>
                              <p className="mt-1 text-sm font-extrabold text-[#2a8b3e]">
                                {formatNilai(sub.stats?.nilai_rata_rata)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2">
                            {(sub.histori ?? []).slice(0, 3).map((h, hIdx) => (
                              <div
                                key={`${h.kode_penilaian ?? h.penilaian_id ?? hIdx}`}
                                className="rounded-xl bg-[#f7faf7] p-3 ring-1 ring-[#e6eee8]"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-xs font-extrabold text-[#0f2147]">
                                      {h.kode_penilaian ?? 'Penilaian'}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-[#6b7c9f]">
                                      {h.tanggal ?? '-'}
                                    </p>
                                  </div>
                                  <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#2563eb] ring-1 ring-[#e6eee8]">
                                    {formatNilai(h.nilai)}
                                  </span>
                                </div>

                                <div className="mt-3 flex items-start gap-2">
                                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#2a8b3e] ring-1 ring-[#e6eee8]">
                                    <UserRound className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-bold tracking-widest text-[#7aa485]">
                                      GURU
                                    </p>
                                    <p className="mt-1 truncate text-sm font-bold text-[#0f2147]">
                                      {h.guru_nama ?? '-'}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs font-semibold text-[#6b7c9f]">
                                      {h.catatan ?? h.keterangan ?? '-'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {(sub.histori ?? []).length === 0 && (
                              <div className="rounded-xl bg-[#f7faf7] p-3 text-center ring-1 ring-[#e6eee8]">
                                <p className="text-xs font-semibold text-[#6b7c9f]">
                                  Belum ada histori penilaian.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}

              {selectedStudentId && !isLoading && !isError && byKategori.length === 0 && (
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#e6eee8]">
                  <p className="text-sm font-semibold text-[#6b7c9f]">
                    Belum ada penilaian kategori untuk santri ini.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <BottomNav active="penilaian-kategori" />
      </main>
    </RequireAuth>
  )
}

