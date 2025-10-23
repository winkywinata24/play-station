# 🎮 PlayStation Rental Management System

Sistem manajemen penyewaan PlayStation berbasis **Directus (backend)** dan **React (frontend)**.  
Dibangun menggunakan **Laragon**, dengan database **MySQL** dan API dari **Directus**.

---

## 📦 Struktur Project

```
play-station/
├── playstation-frontend/   # Frontend (React)
├── extensions/             # Directus extensions
├── uploads/                # Upload storage
├── package.json            # Directus dependencies
├── directus.env            # Konfigurasi Directus
├── database.sql            # File database
└── ...
```

---

## 🚀 Cara Menjalankan Project

### 1️⃣ Clone Repository
```bash
git clone https://github.com/winkywinata24/play-station.git
cd play-station
```

### 2️⃣ Import Database
Buka **phpMyAdmin** (melalui Laragon) lalu:
1. Buat database baru, misalnya `play-station`  
2. Import file `database.sql` yang ada di root project

### 3️⃣ Konfigurasi `.env`
Pastikan file `.env` atau `directus.env` sudah berisi koneksi database, contoh:
```
DB_CLIENT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=play-station
DB_USER=root
DB_PASSWORD=
PORT=8055
PUBLIC_URL=http://localhost:8055
```

### 4️⃣ Install Dependency & Jalankan Directus
```bash
npm install
npx directus start
```

Directus akan berjalan di: [http://localhost:8055](http://localhost:8055)

**Akun Login Dashboard Directus:**
```
Email: admin@gmail.com
Password: admin
```

### 5️⃣ Jalankan Frontend (React)
```bash
cd playstation-frontend
npm install
npm run dev
```

Frontend akan berjalan di: [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Fitur Utama

- Manajemen Penyewaan (Create, Read)
- Manajemen PlayStation (CRUD)
- Riwayat Transaksi (Create, Read)
- Timer otomatis untuk sewa aktif

---

## 🧠 Teknologi yang Digunakan

- **Backend:** Directus (Node.js)
- **Frontend:** React + Vite
- **Database:** MySQL (Laragon)
- **Runtime:** Node.js 18+
