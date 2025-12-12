# MoneyTracker (Frontend)

Deskripsi singkat:

MoneyTracker adalah aplikasi frontend untuk mencatat dan memvisualisasikan pemasukan serta pengeluaran pribadi. Proyek ini dibuat dengan React dan Tailwind CSS, dan terhubung ke API yang berada di folder `api/`.

Fitur utama:

- Menambah, mengedit, dan menghapus transaksi
- Tampilan ringkasan dashboard dengan grafik statistik
- Halaman profil dan pengaturan pengguna
- Riwayat transaksi dan pencarian sederhana

Teknologi:

- React 19
- React Router
- Tailwind CSS
- Axios
- Recharts (grafik)

Persyaratan:

- Node.js LTS (mis. 18+)
- npm

Instalasi dan menjalankan (lokal):

```bash
npm install
npm start
```

Perintah penting:

- `npm start` — jalankan aplikasi di mode development (http://localhost:3000)
- `npm run build` — membangun versi produksi
- `npm test` — jalankan test (jika ada)

Struktur penting proyek:

- public/ — aset statis
- src/ — kode sumber frontend
  - api/ — helper untuk memanggil backend (lihat [src/api/api.js](src/api/api.js#L1))
  - components/ — komponen UI (mis. `Sidebar.jsx`)
  - page/ — halaman aplikasi (Dashboard, Login, Register, dll.)

Contoh penggunaan singkat:

- Buka halaman utama setelah `npm start`.
- Gunakan form "Tambah Transaksi" untuk memasukkan pemasukan/pengeluaran.
- Lihat grafik statistik di halaman `Dashboard`.

Kontribusi:

- Buka issue atau buat pull request.
- Ikuti pola penamaan komponen yang sudah ada dan re-use komponen apabila memungkinkan.

Catatan pengembangan:

- API endpoint dan konfigurasi ada di `src/api/api.js`.
- Styling utama menggunakan `tailwind.config.js` dan `src/index.css`.

Lisensi:

- Bebas digunakan untuk keperluan pembelajaran dan pengembangan (sebutkan lisensi yang diinginkan jika perlu).

Kontak:

- Jika butuh bantuan atau fitur baru, buka issue pada repository atau hubungi tim pengembang.

---

File ini dihasilkan otomatis oleh tim pengembang; sesuaikan bagian "Lisensi" dan "Kontak" sesuai kebutuhan.
