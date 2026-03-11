'use client'

import { FormEvent, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type DemoQueryResponse = {
  message: string
  timestamp: string
  source: string
}

type DemoMutationResponse = {
  ok: boolean
  echoedNote: string
  savedAt: string
}

async function fetchDemoStatus() {
  const response = await fetch('/api/react-query-demo')
  if (!response.ok) {
    throw new Error('Gagal mengambil data demo React Query')
  }
  return (await response.json()) as DemoQueryResponse
}

async function postDemoNote(note: string) {
  const response = await fetch('/api/react-query-demo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note }),
  })
  if (!response.ok) {
    throw new Error('Gagal mengirim data demo React Query')
  }
  return (await response.json()) as DemoMutationResponse
}

export function ReactQueryDemo() {
  const [note, setNote] = useState('Assalamu’alaikum dari TanStack Query')
  const statusQuery = useQuery({
    queryKey: ['react-query-demo', 'status'],
    queryFn: fetchDemoStatus,
    meta: {
      errorMessage: 'Status demo tidak bisa dimuat',
    },
  })

  const noteMutation = useMutation({
    mutationFn: postDemoNote,
    meta: {
      errorMessage: 'Gagal menyimpan catatan demo',
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    noteMutation.mutate(note)
  }

  return (
    <Card className="space-y-4 rounded-3xl p-5 ring-1 ring-[#cfe3d3]">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#0f2046]">Demo TanStack React Query</h2>
        <p className="text-sm text-[#5e7096]">
          Komponen ini memverifikasi integrasi useQuery dan useMutation.
        </p>
      </div>

      <div className="rounded-2xl bg-[#f6fbf7] p-4">
        {statusQuery.isLoading && <p className="text-sm text-[#5e7096]">Memuat status server...</p>}
        {statusQuery.isError && (
          <p className="text-sm font-medium text-red-600">
            {statusQuery.error instanceof Error
              ? statusQuery.error.message
              : 'Terjadi kesalahan saat memuat status'}
          </p>
        )}
        {statusQuery.data && (
          <div className="space-y-1 text-sm text-[#12305f]">
            <p className="font-semibold">{statusQuery.data.message}</p>
            <p>Sumber: {statusQuery.data.source}</p>
            <p>Waktu server: {new Date(statusQuery.data.timestamp).toLocaleString('id-ID')}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Tulis catatan untuk dikirim ke API"
        />
        <Button type="submit" disabled={noteMutation.isPending} className="w-full">
          {noteMutation.isPending ? 'Menyimpan...' : 'Kirim via useMutation'}
        </Button>
      </form>

      {noteMutation.isError && (
        <p className="text-sm font-medium text-red-600">
          {noteMutation.error instanceof Error
            ? noteMutation.error.message
            : 'Terjadi kesalahan saat mutasi'}
        </p>
      )}

      {noteMutation.isSuccess && (
        <p className="text-sm font-medium text-[#2a8b3e]">
          Berhasil tersimpan: {noteMutation.data.echoedNote} (
          {new Date(noteMutation.data.savedAt).toLocaleString('id-ID')})
        </p>
      )}
    </Card>
  )
}
