# R_hmt ofc - Web Music AI

Upgrade branding dari `sann404` menjadi **R_hmt ofc** dengan tambahan fitur:

- Rebrand penuh UI + metadata aplikasi.
- Halaman profil developer berisi link WhatsApp Channel, Instagram, TikTok, GitHub, Telegram.
- Theme switcher (3 kombinasi warna).
- Tombol copy semua link profil.
- Full stack siap deploy ke Vercel (FastAPI + static frontend).

## Struktur

- `api/index.py` → API FastAPI (`/api/home`, `/api/search`, `/api/health`)
- `public/index.html` → UI utama
- `public/style.css` → style modern dark gradient
- `public/script.js` → logic frontend
- `vercel.json` → konfigurasi deploy
- `requirements.txt` → dependency backend

## Jalankan lokal

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn api.index:app --reload
```

Buka `http://127.0.0.1:8000/public/index.html`.

## Deploy Vercel

```bash
npm i -g vercel
vercel --prod
```

Selesai — repo sudah siap deploy.
