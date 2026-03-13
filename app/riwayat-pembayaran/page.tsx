'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { RequireAuth } from '@/components/auth-guard'
import { BottomNav } from '@/components/bottom-nav'
import { useInvoices } from '@/api/invoice'
import { useAccountMe } from '@/api/auth'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/store/auth'

function formatRupiah(value: number) {
  const formatted = new Intl.NumberFormat('id-ID').format(value)
  return `Rp ${formatted}`
}

function splitInvoice(invoiceNumber: string) {
  const lastDash = invoiceNumber.lastIndexOf('-')
  if (lastDash === -1) return [invoiceNumber]
  return [invoiceNumber.slice(0, lastDash + 1), invoiceNumber.slice(lastDash + 1)]
}

export default function RiwayatPembayaranPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const selectedStudentId = useAuthStore((state) => state.selectedStudentId)


  const account: any = useAccountMe().data
  const { data, isLoading, isError } = useInvoices({
    page,
    length: rowsPerPage,
    santri_id: selectedStudentId ?? undefined,
  })

  const items = data?.records ?? []
  const totalRows = data?.total ?? items.length
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage))
  const safePage = Math.min(page, totalPages)
  const start = totalRows === 0 ? 0 : (safePage - 1) * rowsPerPage
  const end = totalRows === 0 ? 0 : Math.min(totalRows, start + items.length)

  const pageRows = useMemo(() => items, [items])

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
            <h1 className="mx-auto text-center text-lg font-extrabold">Riwayat Pembayaran</h1>
            <div className="w-7" />
          </div>
        </header>

        <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-4">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8]">
            <div className="flex items-center gap-3 border-b border-[#e6eee8] pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f0ff] text-[#3b82f6]">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-extrabold text-[#2563eb]">
                Riwayat Pembayaran
              </h2>
            </div>

            <div className="mt-4 space-y-3">
              {isLoading &&
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8]"
                  >
                    <div className="h-4 w-32 rounded bg-[#eef6f0]" />
                    <div className="mt-2 h-5 w-48 rounded bg-[#eef6f0]" />
                    <div className="mt-2 h-4 w-40 rounded bg-[#eef6f0]" />
                    <div className="mt-4 h-16 rounded-xl bg-[#f7faf7] ring-1 ring-[#e6eee8]" />
                  </div>
                ))}

              {!isLoading &&
                isError && (
                  <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#e6eee8]">
                    <p className="text-sm font-semibold text-[#6b7c9f]">
                      Gagal memuat data riwayat pembayaran.
                    </p>
                  </div>
                )}

              {!isLoading &&
                !isError &&
                pageRows.map((row, idx) => {
                const invoiceLines = splitInvoice(row.invoiceNumber)
                return (
                  <div
                    key={row.invoiceNumber}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eee8]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold tracking-widest text-[#7aa485]">
                          INVOICE 
                        </p>
                        <div className="mt-1 text-base font-extrabold text-[#0f2147]">
                          {invoiceLines.map((line) => (
                            <div key={line} className="truncate">
                              {line}
                            </div>
                          ))}
                        </div>
                        <p className="mt-1 text-sm font-semibold text-[#6b7c9f]">
                          {row.period}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold ${
                            row.status === 'Lunas'
                              ? 'bg-[#e9f4ec] text-[#2a8b3e]'
                              : 'bg-[#fff3e6] text-[#b45309]'
                          }`}
                        >
                          {row.status}
                        </span>
                        <p className="text-right text-sm font-extrabold text-[#0f2147]">
                          {formatRupiah(row.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#f7faf7] p-3 ring-1 ring-[#e6eee8]">
                      <div>
                        <p className="text-[11px] font-bold tracking-widest text-[#7aa485]">
                          TANGGAL
                        </p>
                        <p className="mt-1 text-sm font-bold text-[#0f2147]">{row.date}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-widest text-[#7aa485]">
                          KETERANGAN
                        </p>
                        <p className="mt-1 text-sm font-bold text-[#0f2147]">
                          {row.note ?? '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {!isLoading && !isError && pageRows.length === 0 && (
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#e6eee8]">
                  <p className="text-sm font-semibold text-[#6b7c9f]">Belum ada riwayat pembayaran.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-between gap-3 px-2 py-4 text-sm text-[#0f2147] md:flex-row">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#51657e]">Baris per halaman:</span>
                <Select
                  value={String(rowsPerPage)}
                  onValueChange={(value) => {
                    const next = Number(value)
                    setRowsPerPage(next)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-9 w-[72px] rounded-md border-[#d7e2dc] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-medium text-[#51657e]">
                  {totalRows === 0 ? '0' : `${start + 1}-${end}`} dari {totalRows} invoice
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Halaman sebelumnya"
                    className="rounded-full p-2 text-[#94a3b8] hover:bg-[#f3f6f8] disabled:opacity-40"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Halaman berikutnya"
                    className="rounded-full p-2 text-[#94a3b8] hover:bg-[#f3f6f8] disabled:opacity-40"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <BottomNav active="riwayat-pembayaran" />
      </main>
    </RequireAuth>
  )
}
