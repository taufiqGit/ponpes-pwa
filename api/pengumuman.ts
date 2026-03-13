'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export type PengumumanItem = {
  id: number
  title?: string | null
  body?: string | null
  end_date?: number | null
  start_date?: string | null
  image_url?: string | null
  created_at?: string | null
  updated_at?: string | null
  created_by?: string | null
}

export type PengumumanPagination = {
  total?: number | null
  page?: number | null
  limit?: number | null
  total_pages?: number | null
  has_next?: boolean | null
  has_prev?: boolean | null
}

export type PengumumanListData = {
  items: PengumumanItem[]
  pagination?: PengumumanPagination
}

export type PengumumanListResponse = {
  code?: number
  status?: boolean
  messages?: string
  data?: PengumumanListData
}

export type PengumumanDetailResponse = {
  code?: number
  status?: boolean
  messages?: string
  data?: PengumumanItem
}

export type PengumumanListQuery = {
  page?: number
  limit?: number
  search?: string
}

function normalizePengumumanItem(input: any): PengumumanItem {
  return {
    id: Number(input?.id ?? 0),
    title: input?.title ?? null,
    body: input?.body ?? null,
    end_date: input?.end_date ?? null,
    start_date: input?.start_date ?? null,
    image_url: input?.image_url ?? null,
    created_at: input?.created_at ?? null,
    updated_at: input?.updated_at ?? null,
    created_by: input?.created_by ?? null,
  }
}

function normalizePengumumanListResponse(input: any): PengumumanListResponse {
  const rawItems =
    Array.isArray(input?.data?.items) ? input.data.items :
    Array.isArray(input?.items) ? input.items :
    []

  const pagination = input?.data?.pagination ?? input?.pagination

  return {
    code: input?.code,
    status: input?.status,
    messages: input?.messages,
    data: {
      items: rawItems.map(normalizePengumumanItem),
      pagination,
    },
  }
}

function normalizePengumumanDetailResponse(input: any): PengumumanDetailResponse {
  const rawItem = input?.data ?? input?.item ?? null
  const item =
    rawItem && typeof rawItem === 'object' ? normalizePengumumanItem(rawItem) : undefined

  return {
    code: input?.code,
    status: input?.status,
    messages: input?.messages,
    data: item,
  }
}

export async function getPengumumanApi(
  params?: PengumumanListQuery,
): Promise<PengumumanListResponse> {
  const page = Math.max(1, Number(params?.page ?? 1))
  const limit = Math.max(1, Number(params?.limit ?? 10))
  const search =
    typeof params?.search === 'string' && params.search.trim().length > 0
      ? params.search.trim()
      : undefined

  const res = await axiosInstance.get('/api/pengumuman', {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
    },
  })

  return normalizePengumumanListResponse(res.data)
}

export async function getPengumumanDetailApi(
  id: string | number,
): Promise<PengumumanDetailResponse> {
  const res = await axiosInstance.get(`/api/pengumuman/${id}`, {
    validateStatus: () => true,
  })
  return normalizePengumumanDetailResponse(res.data)
}

export function usePengumuman(
  params?: PengumumanListQuery,
  options?: UseQueryOptions<PengumumanListResponse, Error>,
) {
  return useQuery<PengumumanListResponse, Error>({
    queryKey: ['pengumuman', params],
    queryFn: () => getPengumumanApi(params),
    meta: { errorMessage: 'Gagal mengambil data pengumuman' },
    ...options,
  })
}

export function usePengumumanDetail(
  id?: string | number | null,
  options?: UseQueryOptions<PengumumanDetailResponse, Error>,
) {
  return useQuery<PengumumanDetailResponse, Error>({
    queryKey: ['pengumuman', 'detail', id],
    queryFn: () => getPengumumanDetailApi(String(id)),
    enabled: Boolean(id),
    meta: { errorMessage: 'Gagal mengambil detail pengumuman' },
    ...options,
  })
}
