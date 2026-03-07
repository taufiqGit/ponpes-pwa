# Dokumentasi Homepage Santri App

## Ringkasan
Homepage diimplementasikan pada route `/` dengan pendekatan mobile-first dan tetap optimal untuk desktop/tablet. Implementasi mengikuti pola komponen project saat ini (Next.js App Router, Tailwind CSS, lucide-react, sonner).

## Lokasi Implementasi
- `app/page.tsx`

## Komponen Visual Utama
- Header aplikasi (`Portal Orang Tua`, `Santri App`, tombol notifikasi)
- Greeting section personalisasi wali santri
- Card pemilihan santri dengan dropdown interaktif
- Card status SPP
- Banner pengumuman terbaru
- Grid menu cepat
- List jadwal hari ini
- Bottom navigation fixed
- Floating action button (kalender)

## Interaksi yang Tersedia
- Pilih santri aktif dari dropdown
- Klik notifikasi, menu cepat, aksi jadwal, lihat semua, dan item bottom nav
- Perubahan state menu aktif pada bottom navigation
- Feedback interaktif melalui toast

## Responsiveness
- Mobile-first layout dengan optimasi di breakpoint `sm` dan `md`
- Grid menu cepat berubah dari 2 kolom (mobile) menjadi 4 kolom (tablet/desktop)
- Konten berada pada container terpusat dengan lebar adaptif (`max-w-3xl` / `max-w-6xl`)
- Bottom navigation tetap fixed agar UX konsisten di semua device

## Pengujian
Unit test untuk homepage:
- `__tests__/home-page.test.tsx`

Skenario pengujian:
- Render elemen utama sesuai desain
- Interaksi pemilihan santri
- Perubahan menu aktif pada bottom navigation
