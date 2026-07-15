require('dotenv').config(); // Load .env trước tất cả các module khác
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { call_ai } = require('./services');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Multer: lưu file trong RAM (buffer), tối đa 10MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
  },
});

// Serve static files từ thư mục views/ và public/
app.use(express.static(path.join(__dirname, '../views')));
app.use('/public', express.static(path.join(__dirname, '../public')));
// Phục vụ ảnh nhóm
app.use('/images', express.static(path.join(__dirname, '../Ảnh')));

// Helper: đọc file JSON từ thư mục data/
function readData(filename) {
  const filePath = path.join(__dirname, '../data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// Helper: tạo tips mặc định theo loại biển
function getDefaultTips(loai_bien, cong_dung) {
  if (loai_bien && loai_bien.includes('cấm')) {
    return [
      'Tuyệt đối chấp hành biển báo cấm để đảm bảo an toàn giao thông.',
      'Kiểm tra kỹ biển báo trước khi di chuyển vào khu vực bị hạn chế.',
      'Vi phạm biển báo cấm có thể bị xử phạt theo quy định của pháp luật.',
    ];
  } else if (loai_bien && loai_bien.includes('nguy hiểm')) {
    return [
      'Giảm tốc độ và tăng cường chú ý khi gặp biển báo nguy hiểm.',
      'Tăng khoảng cách an toàn với xe phía trước.',
      'Không vượt xe tại khu vực có biển báo nguy hiểm.',
    ];
  } else {
    return [
      'Chấp hành đúng hiệu lệnh của biển báo.',
      'Quan sát biển phụ kèm theo để hiểu rõ phạm vi áp dụng.',
      'Luôn ưu tiên an toàn giao thông khi di chuyển.',
    ];
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'Server đang chạy!', status: 'ok' });
});

// ─── POST /api/recognize ─────────────────────────────────────────────────────
// Nhận ảnh biển báo, gọi AI nhận diện, tra cứu traffic_signs.json, trả về kết quả
app.post('/api/recognize', upload.single('image'), async (req, res) => {
  try {
    // 1. Kiểm tra file đã upload chưa
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng tải lên một file ảnh.' });
    }

    const { buffer, mimetype } = req.file;

    // 2. Gọi AI nhận diện biển báo
    const aiResult = await call_ai(buffer, mimetype);

    if (aiResult.status !== 200) {
      return res.status(aiResult.status).json({
        success: false,
        message: aiResult.content,
      });
    }

    // 3. Parse kết quả AI → lấy Sign_id
    let signId;
    try {
      const parsed = JSON.parse(aiResult.content);
      signId = parsed.Sign_id;
    } catch (e) {
      return res.status(500).json({ success: false, message: 'AI trả về dữ liệu không hợp lệ.' });
    }

    if (!signId) {
      return res.status(404).json({ success: false, message: 'AI không nhận diện được biển báo trong ảnh.' });
    }

    // 4. Vòng lặp traffic_signs.json tìm bản ghi có ma_bien === signId
    const trafficSigns = readData('traffic_signs.json');
    const signData = trafficSigns.find((sign) => sign.ma_bien === signId);

    if (!signData) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy thông tin biển báo với mã: ${signId}`,
        signId,
      });
    }

    // 5. Bổ sung tips mặc định nếu JSON không có sẵn
    const enrichedSignData = {
      ...signData,
      tips: signData.tips || getDefaultTips(signData.loai_bien, signData.cong_dung),
      note: signData.note || `Biển báo ${signData.loai_bien ? signData.loai_bien.toLowerCase() : ''} theo QCVN 41:2019/BGTVT.`,
    };

    // 6. Chuyển ảnh sang Base64 để frontend lưu localStorage
    const imageBase64 = `data:${mimetype};base64,${buffer.toString('base64')}`;

    // 7. Trả kết quả
    return res.json({
      success: true,
      signId,
      signData: enrichedSignData,
      imageBase64,
    });

  } catch (error) {
    console.error('❌ Lỗi route /api/recognize:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.' });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
  console.log(`📁 Phục vụ views tại http://localhost:${PORT}/index.html`);
});
