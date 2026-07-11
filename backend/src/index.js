const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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

// GET /api/products - lấy danh sách sản phẩm
app.get('/api/products', (req, res) => {
  try {
    const data = readData('products.json');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Không đọc được dữ liệu', error: err.message });
  }
});

// GET /api/products/:id - lấy sản phẩm theo ID
app.get('/api/products/:id', (req, res) => {
  try {
    const data = readData('products.json');
    const item = data.find(p => p.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/members - lấy danh sách thành viên nhóm
app.get('/api/members', (req, res) => {
  try {
    const data = readData('members.json');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/categories - lấy danh mục
app.get('/api/categories', (req, res) => {
  try {
    const data = readData('categories.json');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products?category=... - lọc theo danh mục
app.get('/api/filter', (req, res) => {
  try {
    const { category, search } = req.query;
    let data = readData('products.json');

    if (category) {
      data = data.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      data = data.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));
    }

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
