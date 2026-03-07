# Dokumentasi Fitur Login

Fitur login ini diimplementasikan menggunakan Next.js App Router, React Hook Form, Zod, dan Tailwind CSS.

## Komponen

1.  **`app/login/page.tsx`**: Halaman utama login. Berisi layout responsif, header, banner gambar, dan memanggil komponen `LoginForm`.
2.  **`components/login-form.tsx`**: Komponen form yang menangani logika input, validasi, dan interaksi dengan API.
3.  **`app/api/auth/login/route.ts`**: Mock API untuk simulasi proses autentikasi backend.

## Fitur Utama

-   **Validasi Input**: Menggunakan Zod untuk memastikan email/no. hp terisi dan password minimal 6 karakter.
-   **Loading State**: Tombol login dinonaktifkan dan menampilkan spinner saat memproses.
-   **Feedback Visual**: Menggunakan `sonner` untuk menampilkan notifikasi sukses atau gagal (toast).
-   **Password Visibility**: User bisa melihat password yang diketik dengan menekan ikon mata.
-   **Remember Me**: Opsi checkbox "Ingat saya" (saat ini menyimpan flag di localStorage sebagai contoh).
-   **Responsive Design**: Tampilan menyesuaikan layar mobile dan desktop.

## Cara Penggunaan

1.  Akses halaman login di `/login`.
2.  Masukkan:
    -   **Email/No. Handphone**: Bebas (asalkan string tidak kosong).
    -   **Password**: `password123` (untuk simulasi sukses).
3.  Klik tombol "Masuk ke Portal".
4.  Jika sukses, akan diarahkan ke dashboard (`/`).
5.  Jika gagal (password salah), akan muncul pesan error.

## Testing

Unit test telah dibuat menggunakan Vitest dan React Testing Library.

Jalankan test dengan perintah:

```bash
npx vitest run
```

Test mencakup:
-   Rendering komponen.
-   Validasi form kosong.
-   Simulasi login sukses.
-   Simulasi login gagal.
