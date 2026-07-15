const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { test, call_ai } = require('./services');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Helper: đọc file JSON từ thư mục data/
function readData(filename) {
  const filePath = path.join(__dirname, '../data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Server đang chạy!', status: 'ok' });
});



// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
