'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export type InvoiceRow = {
  invoiceNumber: string
  period: string
  date: string
  amount: number
  status: string
  note?: string
}

export type InvoicesResult = {
  records: InvoiceRow[]
  total?: number
}

export type InvoiceQuery = {
  page?: number
  length?: number
  santri_id?: string
  tahun_ajaran_id?: string
  jenis?: string
  status?: string
  bulan?: string
  tahun?: string
}

function normalizeInvoice(input: any): InvoiceRow {
  const invoiceNumber =
    input?.sytg_kode ??
    ''
  const period =
    input?.period ??
    input?.periode ??
    ''
  const date =
    input?.sytg_tanggal_terbit ??
    ''
  const amount =
    Number(input?.sytg_nominal_terbayar ?? 0) || 0
  const status =
    input?.sytg_status_display ??
    ''

  const note =
    input?.sytg_catatan ?? undefined

  return { invoiceNumber, period, date, amount, status, note }
}

export async function getInvoicesApi(
  params?: InvoiceQuery,
): Promise<InvoicesResult> {
  const res = await axiosInstance.get('/api/syariah/tagihan', {
    params: {
      page: params?.page ?? 1,
      length: params?.length ?? 10,
      santri_id: params?.santri_id,
      tahun_ajaran_id: params?.tahun_ajaran_id,
      jenis: params?.jenis,
      status: params?.status,
      bulan: params?.bulan,
      tahun: params?.tahun,
    },
  })
  const data = res.data?.data
  console.log('datazz', res?.data)
  const raw =
    Array.isArray(data?.data) ? data?.data :
    Array.isArray(data?.records) ? data?.records :
    Array.isArray(data) ? data :
    []
  const records = raw.map(normalizeInvoice)
  const total = data?.total ?? data?.meta?.total ?? records.length
  return { records, total }
}

export function useInvoices(
  params?: InvoiceQuery,
  options?: UseQueryOptions<InvoicesResult, Error>,
) {
  return useQuery<InvoicesResult, Error>({
    queryKey: ['invoices', params],
    queryFn: () => getInvoicesApi(params),
    meta: { errorMessage: 'Gagal mengambil data tagihan' },
    ...options,
  })
}
