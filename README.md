# 🚌 SmartBus Tracker — Cần Thơ

Ứng dụng theo dõi xe buýt thành phố Cần Thơ theo thời gian thực, xây dựng trên SvelteKit + Mapbox GL JS + Firebase Realtime Database.

> **MVP thử nghiệm** · Giả lập 5 tuyến xe buýt

##LƯU Ý: PHIÊN BẢN HIỆN TẠI CHỈ LÀ THỬ NGHIỆM LÀM CHO VUI:))

---

## ✨ Tính năng

- **Bản đồ thời gian thực** — vị trí xe cập nhật mỗi 2 giây qua Firebase
- **5 tuyến xe buýt Cần Thơ** — lộ trình thực tế từ Mapbox Directions API
- **Sidebar thông tin tuyến** — giá vé, số trạm, khoảng cách, thời gian
- **Chatbot AI** — tư vấn lộ trình bằng Groq (llama-3.1-8b-instant)
- **Highlight tuyến** — chọn tuyến → tuyến đó sáng, tuyến khác mờ, map tự zoom
- **LERP animation** — xe di chuyển mượt mà giữa các waypoint

---

## 🗺️ 5 Tuyến xe

| Tuyến | Lộ trình | Giá vé | Thời gian |
|-------|----------|--------|-----------|
| 1 | Bến Xe → Ô Môn | 7.000đ | ~45 phút |
| 2 | Bến Xe → Thốt Nốt | 12.000đ | ~77 phút |
| 3 | Bến Xe → ĐH Cần Thơ | 5.000đ | ~14 phút |
| 4 | Bến Xe → Cái Răng | 7.000đ | ~36 phút |
| 5 | Bến Xe → Phong Điền | 9.000đ | ~28 phút |

---

## 🛠️ Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | SvelteKit 5, Svelte 5 Runes, TypeScript |
| Bản đồ | Mapbox GL JS 3 |
| Database | Firebase Realtime Database |
| AI Chatbot | Groq API (llama-3.1-8b-instant) |
| Styling | Tailwind CSS 4, CSS Variables |
| Deploy | Vercel (adapter-vercel) |
| Simulator | Node.js + Firebase Admin SDK |

---

## 🚀 Cài đặt & Chạy

### Yêu cầu

- Node.js 20+
- pnpm 9+
- Tài khoản Mapbox, Firebase, Groq

### 1. Clone và cài dependencies

```bash
git clone https://github.com/your-username/smart-bus-tracker.git
cd smart-bus-tracker
pnpm install
```

### 2. Cấu hình biến môi trường

Copy file mẫu và điền thông tin thật:

```bash
cp .env.example .env
cp simulator/.env.example simulator/.env
```

Chỉnh sửa `.env`:

```dotenv
PUBLIC_MAPBOX_TOKEN=pk.eyJ1...       # Token từ mapbox.com
PUBLIC_FIREBASE_API_KEY=...
PUBLIC_FIREBASE_AUTH_DOMAIN=...
PUBLIC_FIREBASE_DATABASE_URL=...
PUBLIC_FIREBASE_PROJECT_ID=...
PUBLIC_FIREBASE_STORAGE_BUCKET=...
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
PUBLIC_FIREBASE_APP_ID=...
GROQ_API_KEY=gsk_...                 # Key từ console.groq.com
```

Chỉnh sửa `simulator/.env`:

```dotenv
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

### 3. Thêm Firebase Service Account

Vào Firebase Console → Project Settings → Service Accounts → Generate new private key.
Lưu file JSON vào `simulator/serviceAccountKey.json`.

> ⚠️ File này đã được `.gitignore` — **không commit lên git**.

### 4. Chạy simulator

```bash
cd simulator
node simulate.js
```

Simulator sẽ đẩy dữ liệu GPS của 5 xe lên Firebase mỗi 2 giây.

### 5. Chạy app

```bash
# Trong thư mục gốc
pnpm dev
```

Mở [http://localhost:5173](http://localhost:5173)

---

## 📁 Cấu trúc thư mục

```
smart-bus-tracker/
├── simulator/                  # GPS simulator (Node.js, chạy độc lập)
│   ├── simulate.js             # Script giả lập 5 xe
│   ├── routes.js               # Dữ liệu waypoint tuyến đường
│   ├── .env                    # 🔒 Không commit
│   ├── .env.example            # ✅ Template để commit
│   └── serviceAccountKey.json  # 🔒 Không commit
│
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   └── ChatWidget.svelte   # Chatbot AI
│   │   │   ├── Mapping/
│   │   │   │   └── Map2D.svelte        # Bản đồ Mapbox
│   │   │   └── UI/
│   │   │       └── RouteChip.svelte
│   │   ├── data/
│   │   │   └── routes.json             # Waypoints 5 tuyến
│   │   ├── services/
│   │   │   └── firebase.ts             # Firebase client init
│   │   └── stores/
│   │       └── buses.svelte.ts         # Reactive bus state (Svelte 5)
│   │
│   └── routes/
│       ├── +page.svelte                # Landing page
│       ├── +layout.svelte
│       ├── layout.css
│       ├── api/
│       │   └── chat/
│       │       └── +server.ts          # Groq API proxy
│       └── tuyen-xe/
│           └── +page.svelte            # Trang tra cứu tuyến xe
│
├── static/
├── .env                        # 🔒 Không commit
├── .env.example                # ✅ Template để commit
├── .gitignore
├── package.json
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🔒 Bảo mật

| File | Trạng thái | Lý do |
|------|-----------|-------|
| `.env` | 🔒 Gitignored | Chứa API keys |
| `simulator/.env` | 🔒 Gitignored | Chứa Database URL |
| `simulator/serviceAccountKey.json` | 🔒 Gitignored | Firebase Admin credentials |
| `.env.example` | ✅ Commit | Template không chứa key thật |

`GROQ_API_KEY` chỉ tồn tại server-side (`$env/static/private`), không bao giờ xuất hiện trong browser bundle.

---

## 🌐 Deploy lên Vercel

```bash
pnpm build
vercel deploy
```

Thêm các biến trong `.env` vào Vercel Dashboard → Settings → Environment Variables.

> Simulator chạy local hoặc trên một VPS riêng — không deploy cùng với SvelteKit app.

---

## 📝 Roadmap

- [ ] Tích hợp API GPS thực từ Vận tải Cần Thơ
- [ ] Thêm tỉnh thành: An Giang, Kiên Giang, Đồng Tháp
- [ ] Thông báo khi xe đến trạm
- [ ] Lịch trình chạy xe theo giờ
- [ ] PWA — cài được trên điện thoại

---

## 📄 License

MIT — xem [LICENSE](LICENSE)
