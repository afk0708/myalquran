<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Al-Qur'an Digital - Terjemahan, Audio Murottal & Jadwal Sholat

Aplikasi web modern Al-Qur'an Digital lengkap 30 Juz 114 Surat dengan terjemahan bahasa Indonesia, audio murottal per ayat dari qari internasional, jadwal sholat akurat sesuai lokasi, panduan sholat, doa & hadits, serta asisten Tanya Ustadz AI.

## 🚀 Cara Menjalankan Secara Lokal (Local Development)

**Prasyarat:** Node.js (v18 ke atas)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan Aplikasi:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

---

## 🌐 Cara Deploy ke GitHub Pages

Proyek ini sudah dikonfigurasi dengan path relatif (`base: './'`) pada `index.html` dan `vite.config.ts`, serta dilengkapi workflow otomatis GitHub Actions.

### Langkah 1: Push Kode ke Repository GitHub Anda
```bash
git init
git add .
git commit -m "Initial commit - Al-Quran Digital"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git
git push -u origin main
```

### Langkah 2: Aktifkan GitHub Pages
1. Buka repository Anda di GitHub.
2. Masuk ke menu **Settings** > **Pages**.
3. Pada bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
4. GitHub Actions akan otomatis menjalankan workflow `.github/workflows/deploy.yml` dan aplikasi akan aktif di URL `https://USERNAME_ANDA.github.io/NAMA_REPO_ANDA/`.

### Atau Build Manual Static Files:
```bash
npm run build
```
Hasil file static HTML, JS, dan CSS yang siap di-upload ke hosting static apa pun ada di dalam folder `dist/`.
