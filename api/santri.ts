'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export type PenilaianKitabSantriRow = {
  kitab_kode?: string
  kitab_nama?: string
  sub_kitab_kode?: string
  sub_kitab_nama?: string
  guru_nama?: string
  guru_bidang_keahlian?: string
  nilai?: string | number | null
  tanggal?: string | null
  kode_penilaian?: string | null
  catatan?: string | null
}

export type PenilaianKitabSantriResponse = {
  records: PenilaianKitabSantriRow[]
  total?: number
}

function normalizePenilaian(input: any): PenilaianKitabSantriRow {
  const kitab_kode = input?.kitab?.kode_kitab ?? input?.kitab_kode
  const kitab_nama = input?.kitab?.nama_kitab ?? input?.kitab_nama
  const sub_kitab_kode = input?.sub_kitab?.kode_detail ?? input?.sub_kitab_kode
  const sub_kitab_nama = input?.sub_kitab?.nama_detail ?? input?.sub_kitab_nama
  const guru_nama = input?.guru?.gur_nama ?? input?.guru_nama
  const guru_bidang_keahlian =
    input?.guru?.gur_bidang_keahlian ?? input?.guru_bidang_keahlian
  const nilai = input?.nilai_santri ?? input?.nilai ?? null
  const tanggal = input?.tanggal ?? null
  const kode_penilaian = input?.kode_penilaian ?? null
  const catatan = input?.catatan ?? null

  return {
    kitab_kode,
    kitab_nama,
    sub_kitab_kode,
    sub_kitab_nama,
    guru_nama,
    guru_bidang_keahlian,
    nilai,
    tanggal,
    kode_penilaian,
    catatan
  }
}

export type PenilaianSantriRow = {
  kategori_kode?: string
  kategori_nama?: string
  sub_kategori_kode?: string
  sub_kategori_nama?: string
  guru_nama?: string
  guru_bidang_keahlian?: string
  nilai?: string | number | null
  tanggal?: string | null
  kode_penilaian?: string | null
  catatan?: string | null
}

export type PenilaianSantriHistoriRow = {
  penilaian_id?: number | string | null
  kode_penilaian?: string | null
  tanggal?: string | null
  nilai?: string | number | null
  hadir?: boolean | null
  lulus?: boolean | null
  predikat?: string | null
  warna?: string | null
  guru_id?: number | string | null
  guru_nama?: string | null
  catatan?: string | null
  keterangan?: string | null
}

export type PenilaianSantriStats = {
  total_penilaian?: number | null
  nilai_rata_rata?: number | null
  nilai_tertinggi?: number | null
  nilai_terendah?: number | null
}

export type PenilaianSantriSubKategori = {
  sub_kategori_id?: number | string | null
  sub_kategori_nama?: string | null
  stats?: PenilaianSantriStats
  histori: PenilaianSantriHistoriRow[]
}

export type PenilaianSantriKategori = {
  kategori_id?: number | string | null
  kategori_kode?: string | null
  kategori_nama?: string | null
  stats?: PenilaianSantriStats
  sub_kategori: PenilaianSantriSubKategori[]
}

export type PenilaianSantriInfo = {
  id?: number | string | null
  san_nis?: string | null
  san_nama_lengkap?: string | null
}

export type PenilaianSantriSummary = {
  total_penilaian?: number | null
  total_kategori?: number | null
  nilai_rata_rata?: number | null
}

export type PenilaianSantriResponse = {
  santri_info?: PenilaianSantriInfo
  by_kategori: PenilaianSantriKategori[]
  summary?: PenilaianSantriSummary
}

function normalizePenilaianSantriStats(input: any): PenilaianSantriStats {
  return {
    total_penilaian: input?.total_penilaian ?? null,
    nilai_rata_rata: input?.nilai_rata_rata ?? null,
    nilai_tertinggi: input?.nilai_tertinggi ?? null,
    nilai_terendah: input?.nilai_terendah ?? null,
  }
}

function normalizePenilaianSantriHistori(input: any): PenilaianSantriHistoriRow {
  return {
    penilaian_id: input?.penilaian_id ?? null,
    kode_penilaian: input?.kode_penilaian ?? null,
    tanggal: input?.tanggal ?? null,
    nilai: input?.nilai ?? null,
    hadir: input?.hadir ?? null,
    lulus: input?.lulus ?? null,
    predikat: input?.predikat ?? null,
    warna: input?.warna ?? null,
    guru_id: input?.guru_id ?? null,
    guru_nama: input?.guru_nama ?? null,
    catatan: input?.catatan ?? null,
    keterangan: input?.keterangan ?? null,
  }
}

function normalizePenilaianSantriSubKategori(input: any): PenilaianSantriSubKategori {
  const rawHistori = Array.isArray(input?.histori) ? input?.histori : []
  return {
    sub_kategori_id: input?.sub_kategori_id ?? null,
    sub_kategori_nama: input?.sub_kategori_nama ?? null,
    stats: normalizePenilaianSantriStats(input?.stats),
    histori: rawHistori.map(normalizePenilaianSantriHistori),
  }
}

function normalizePenilaianSantriKategori(input: any): PenilaianSantriKategori {
  const rawSub = Array.isArray(input?.sub_kategori) ? input?.sub_kategori : []
  return {
    kategori_id: input?.kategori_id ?? null,
    kategori_kode: input?.kategori_kode ?? null,
    kategori_nama: input?.kategori_nama ?? null,
    stats: normalizePenilaianSantriStats(input?.stats),
    sub_kategori: rawSub.map(normalizePenilaianSantriSubKategori),
  }
}

export async function getPenilaianKitabSantriApi(
  santriId: string | number,
): Promise<PenilaianKitabSantriResponse> {
  const res = await axiosInstance.get(`/api/penilaian-kitab/santri/${santriId}`)
  const data = res.data?.data ?? res.data
  const raw =
    Array.isArray(data?.records) ? data?.records :
    Array.isArray(data?.data) ? data?.data :
    Array.isArray(data) ? data :
    []

  const records = raw.map(normalizePenilaian)
  const total = data?.total ?? data?.meta?.total ?? records.length
  return { records, total }
}

export function usePenilaianKitabSantri(
  santriId?: string | number | null,
  options?: UseQueryOptions<PenilaianKitabSantriResponse, Error>,
) {
  return useQuery<PenilaianKitabSantriResponse, Error>({
    queryKey: ['penilaian-kitab', 'santri', santriId],
    queryFn: () => getPenilaianKitabSantriApi(String(santriId)),
    enabled: Boolean(santriId),
    meta: { errorMessage: 'Gagal mengambil data penilaian kitab santri' },
    ...options,
  })
}

export async function getPenilaianSantriApi(
  santriId: string | number,
): Promise<PenilaianSantriResponse> {
  const res = await axiosInstance.get(`/api/penilaian/santri/${santriId}`)
  const data = res.data?.data ?? res.data
  const rawKategori = Array.isArray(data?.by_kategori) ? data?.by_kategori : []

  return {
    santri_info: data?.santri_info,
    by_kategori: rawKategori.map(normalizePenilaianSantriKategori),
    summary: data?.summary,
  }
}

export function usePenilaianSantri(
  santriId?: string | number | null,
  options?: UseQueryOptions<PenilaianSantriResponse, Error>,
) {
  return useQuery<PenilaianSantriResponse, Error>({
    queryKey: ['penilaian', 'santri', santriId],
    queryFn: () => getPenilaianSantriApi(String(santriId)),
    enabled: Boolean(santriId),
    meta: { errorMessage: 'Gagal mengambil data penilaian santri' },
    ...options,
  })
}

export type TagihanCheckLunasQuery = {
  sytg_santri_id: string | number
  sytg_bulan: number
  sytg_tahun: number
}

export type TagihanCheckLunasData = {
  sytg_santri_id: number
  sytg_bulan: number
  sytg_tahun: number
  is_lunas: boolean
}

export type TagihanCheckLunasResponse = {
  code?: number
  status?: boolean
  messages?: string
  data?: TagihanCheckLunasData
}

export async function getTagihanCheckLunasApi(
  params: TagihanCheckLunasQuery,
): Promise<TagihanCheckLunasResponse> {
  const res = await axiosInstance.get('/api/syariah/tagihan/check-lunas', {
    params: {
      sytg_santri_id: params.sytg_santri_id,
      sytg_bulan: params.sytg_bulan,
      sytg_tahun: params.sytg_tahun,
    },
    validateStatus: () => true,
  })
  const root = res.data
  if (root && typeof root === 'object') {
    if ('code' in root || 'status' in root || 'messages' in root) {
      return root as TagihanCheckLunasResponse
    }

    const inner = (root as any)?.data
    if (inner && typeof inner === 'object' && ('code' in inner || 'status' in inner || 'messages' in inner)) {
      return inner as TagihanCheckLunasResponse
    }
  }

  return root as TagihanCheckLunasResponse
}

export function useTagihanCheckLunas(
  params?: Partial<TagihanCheckLunasQuery>,
  options?: UseQueryOptions<TagihanCheckLunasResponse, Error>,
) {
  const enabled = Boolean(params?.sytg_santri_id && params?.sytg_bulan && params?.sytg_tahun)

  return useQuery<TagihanCheckLunasResponse, Error>({
    queryKey: ['tagihan', 'check-lunas', params],
    queryFn: () =>
      getTagihanCheckLunasApi({
        sytg_santri_id: params!.sytg_santri_id!,
        sytg_bulan: Number(params!.sytg_bulan),
        sytg_tahun: Number(params!.sytg_tahun),
      }),
    enabled,
    meta: { errorMessage: 'Gagal mengecek status lunas tagihan' },
    ...options,
  })
}
