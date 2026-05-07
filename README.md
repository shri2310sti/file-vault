# 🔐 File Vault

A secure, deduplicated file management system with SHA-256 hash-based duplicate detection, occurrence counting, and accurate storage tracking.

**Live Demo:** [https://file-vault-black.vercel.app](https://file-vault-black.vercel.app)  
**API:** [https://file-vault-fykf.onrender.com](https://file-vault-fykf.onrender.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| File Hashing | SHA-256 (Node.js `crypto`) |
| File Upload | Multer |
| Deployment | Vercel (frontend) · Render (backend) |

---

## Features

- Upload files via drag & drop or file picker
- SHA-256 deduplication — duplicate files are never stored twice
- Occurrence counting — tracks how many times each unique file was uploaded
- Graduated deletion — file is only permanently deleted when occurrence count reaches 0
- Accurate storage tracking — `totalOccupiedSize` only counts unique files
- Image preview for uploaded image files
- File type icons for non-image files

---

## API Reference

### `POST /files` — Upload a File

Uploads a file. If a duplicate is detected via SHA-256, the occurrence count is incremented instead of storing the file again.

**Request:** `multipart/form-data` with field `file`

**Response (new file):**
```json
{
  "message": "File uploaded successfully.",
  "file": { ... },
  "duplicate": false
}
```

**Response (duplicate):**
```json
{
  "message": "Duplicate detected. Occurrence count updated.",
  "file": { ... },
  "duplicate": true
}
```

---

### `GET /files` — List All Files

Returns all file metadata with total occupied storage size.

**Response:**
```json
{
  "files": [
    {
      "_id": "...",
      "name": "report.pdf",
      "size": 204800,
      "type": "application/pdf",
      "sha256": "a3f9c1...",
      "occurrenceCount": 2,
      "path": "uploads/...",
      "uploadDate": "2025-05-06T10:00:00Z"
    }
  ],
  "totalOccupiedSize": 204800
}
```

---

### `DELETE /files/:id` — Delete a File

Decrements occurrence count. Permanently deletes the file and metadata only when count reaches 0.

**Response (decremented):**
```json
{
  "message": "Occurrence count decremented.",
  "file": { ... },
  "deleted": false
}
```

**Response (permanently deleted):**
```json
{
  "message": "File permanently deleted.",
  "deleted": true
}
```

---

## File Metadata Schema

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Original file name |
| `size` | Number | File size in bytes |
| `type` | String | MIME type |
| `sha256` | String | SHA-256 hash of file content |
| `occurrenceCount` | Number | Number of times this file was uploaded |
| `path` | String | Local storage path |
| `uploadDate` | Date | Timestamp of first upload |

---

## Local Development

### Prerequisites

- Node.js v18+
- MongoDB Atlas account

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:
```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Project Structure

```
file-vault/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   └── File.js
│   │   ├── routes/
│   │   │   └── files.js
│   │   ├── middleware/
│   │   │   └── upload.js
│   │   └── app.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── UploadZone.jsx
    │   │   ├── FileCard.jsx
    │   │   └── StatsBar.jsx
    │   ├── hooks/
    │   │   └── useFiles.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── App.css
    ├── .env
    └── package.json
```

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://file-vault-black.vercel.app |
| Backend | Render | https://file-vault-fykf.onrender.com |

### Environment Variables

**Render (Backend):**
| Key | Value |
|-----|-------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | `5000` |
| `FRONTEND_URL` | https://file-vault-black.vercel.app |

**Vercel (Frontend):**
| Key | Value |
|-----|-------|
| `VITE_API_URL` | https://file-vault-fykf.onrender.com |

---

## Sample curl Commands

**Upload a file:**
```bash
curl -X POST https://file-vault-fykf.onrender.com/files \
  -F "file=@/path/to/your/file.pdf"
```

**List all files:**
```bash
curl https://file-vault-fykf.onrender.com/files
```

**Delete a file:**
```bash
curl -X DELETE https://file-vault-fykf.onrender.com/files/<file_id>
```
