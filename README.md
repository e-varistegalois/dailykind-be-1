# Dailykind Backend API

Backend API untuk aplikasi chatbot curhat dengan 4 personality berbeda menggunakan Google Gemini AI. Mendukung cache memory untuk chat aktif dan persist ke database untuk riwayat chat.

---

## Fitur Utama
- **4 Personality Chatbot:** calm, cheerful, emo, humorous
- **Session Management:** Chat session per user, bisa multi session
- **Chat History:**
  - Chat aktif disimpan di memory (cache)
  - History dipersist ke database saat session dihapus/idle > 1 jam
  - Bisa re-open session lama dari database
- **Pagination:** Mendukung pagination untuk history chat
- **Rate Limiting & Error Handling**
- blablablabal

---

## 🛠️ Tech Stack
- **Node.js** + **TypeScript**
- **Express.js**
- **Prisma ORM** + **PostgreSQL** (Supabase compatible)
- **Google Gemini AI**

---

## 📦 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd dailykind-be-1
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Setup environment variables**
   ```env
   PORT=3001
   NODE_ENV=development
   DATABASE_URL=postgresql://username:password@localhost:5432/dailykind_db
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```
5. **Run development server**
   ```bash
   npm run dev
   ```

---

## 📡 API Endpoints

### 1. **Create Chat Session**
`POST /chatbot`
```json
{
  "sessionId": "session_123",
  "userId": "user_456",
  "personality": "calm", // atau cheerful, emo, humorous
  "history": []
}
```

### 2. **Send Message**
`POST /chatbot/send-message`
```json
{
  "sessionId": "session_123",
  "message": "Aku lagi stress banget nih"
}
```

### 3. **Get All Sessions for User (Sidebar)**
`GET /chatbot/sessions/user/:userId`
- **Response:**
```json
[
  {
    "sessionId": "session_abc",
    "displayChat": "Halo, aku mau curhat | Aku paham, kadang hidup memang terasa berat.",
    "createdAt": "2024-07-20T10:00:00Z",
    "personality": "calm"
  }
]
```

### 4. **Get Session by ID (Full Chat, Pagination)**
`GET /chatbot/sessions/session/:sessionId?limit=20&offset=0`
- **Response:**
```json
{
  "sessionId": "session_abc",
  "history": [
    { "role": "user", "content": "Halo, aku mau curhat" },
    { "role": "model", "content": "Aku paham, kadang hidup memang terasa berat." }
  ],
  "totalMessages": 2
}
```

### 5. **Delete Session**
`DELETE /chatbot/sessions/session/:sessionId`
- Persist history ke database, hapus session dari memory

---

## 🧠 **Arsitektur Chat History**
- **Chat aktif:**
  - History disimpan di memory (cache) untuk performa dan minim DB write
- **Session idle > 1 jam / dihapus:**
  - History dipersist ke database (kolom `history` di tabel `chat_session`)
- **Re-open session:**
  - Jika session tidak ada di memory, backend akan re-open dari database dan lanjut chat

---

## 🎭 Personality Types
- **calm:** Empatik, lembut, pengertian
- **cheerful:** Ceria, optimis, penuh semangat
- **emo:** Puitis, mendalam, penuh perasaan
- **humorous:** Lucu, santai, suka bercanda

---

## 🧪 Testing
- Gunakan Postman/cURL untuk test endpoint
- Cek pagination dengan query param `limit` dan `offset` di endpoint get session by ID
- Cek sidebar dengan endpoint get all user sessions

---

## 📝 Catatan Penting
- **Session yang sudah di-cleanup tidak bisa langsung di-chat, tapi bisa di-reopen**
- **Preview chat di sidebar selalu cek cache dulu, baru fallback ke database**
- **Role pesan harus 'user' atau 'model'**

---

## 📄 Lisensi
Project ini open source, silakan digunakan dan dikembangkan! 