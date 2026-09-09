# 🌸 Asisten HuTao

AI asisten dengan persona Hutao dari Genshin Impact, siap membantu tugas-tugasmu dengan gaya lucu dan informatif.

## Cara Deploy ke Render

1. Fork/clone repo ini.
2. Buat akun di [Render.com](https://render.com).
3. Pilih **New Web Service**, hubungkan repo.
4. Environment: `Node`.
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Tambahkan environment variable `DEEPAI_API_KEY` (gunakan key dari DeepAI).
8. Deploy! Dapatkan URL publik.

## Jalankan Lokal

```bash
npm install
node server.js
