# Next.js + TanStack React Query Setup

Dokumentasi ini menjelaskan setup TanStack React Query yang sudah terpasang di proyek ini, termasuk provider global, konfigurasi `QueryClient`, penanganan error global, serta contoh pemanggilan API dengan `useQuery` dan `useMutation`.

## 1) Instalasi

Library sudah diinstal melalui npm:

```bash
npm install @tanstack/react-query
```

Dependensi tersebut tercatat di `package.json` dan lockfile npm (`package-lock.json`).

## 2) Struktur File Integrasi

- `lib/react-query.ts`  
  Menyimpan konfigurasi default React Query agar mudah dikustomisasi.
- `components/query-provider.tsx`  
  Menyediakan `QueryClientProvider` dan konfigurasi global `QueryCache` + `MutationCache`.
- `app/layout.tsx`  
  Memasang `QueryProvider` di level aplikasi teratas.
- `app/api/react-query-demo/route.ts`  
  Endpoint API demo untuk kebutuhan verifikasi integrasi.
- `components/react-query-demo.tsx`  
  Contoh komponen `useQuery` + `useMutation` berikut loading/error/success state.
- `app/page.tsx`  
  Menampilkan komponen demo agar setup bisa langsung diuji.

## 3) Konfigurasi QueryClient

Konfigurasi default ada di `lib/react-query.ts`:

- `staleTime: 60 detik`
- `gcTime: 5 menit` (pengganti `cacheTime` pada versi terbaru)
- `retry: 1` untuk query, `retry: 0` untuk mutation
- `retryDelay: exponential backoff`
- `refetchOnWindowFocus: false`
- `refetchOnReconnect: true`
- `refetchOnMount: false`
- `networkMode: 'online'`

Konfigurasi ini sudah siap dipakai dan bisa disesuaikan sesuai kebutuhan aplikasi.

## 4) Penanganan Error Global

Error global ditangani di `components/query-provider.tsx` melalui:

- `QueryCache.onError`
- `MutationCache.onError`

Keduanya menampilkan notifikasi toast global menggunakan `sonner`, termasuk dukungan pesan kustom dari `meta.errorMessage`.

Contoh:

```tsx
useQuery({
  queryKey: ['contoh'],
  queryFn: fetchContoh,
  meta: {
    errorMessage: 'Gagal memuat data contoh',
  },
})
```

## 5) Contoh Pemanggilan API

### useQuery (GET)

Komponen demo memanggil:

- `GET /api/react-query-demo`

Respons berisi status integrasi, timestamp server, dan sumber endpoint.

### useMutation (POST)

Komponen demo mengirim:

- `POST /api/react-query-demo`
- payload: `{ "note": "..." }`

Respons mengembalikan data hasil simpan simulasi (`echoedNote`, `savedAt`).

## 6) Menjalankan dan Verifikasi

Jalankan aplikasi:

```bash
npm run dev
```

Lalu buka halaman `/` dan cari kartu **Demo TanStack React Query** untuk melihat:

- loading state saat query berjalan
- error state jika request gagal
- success state setelah mutation berhasil

## 7) Cara Kustomisasi Lanjutan

Untuk menyesuaikan perilaku query secara global:

1. Ubah default options di `lib/react-query.ts`.
2. Ubah kebijakan error global di `components/query-provider.tsx`.
3. Tambahkan `meta.errorMessage` pada query/mutation agar pesan error lebih kontekstual.
