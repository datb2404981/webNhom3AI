import { GoogleGenAI, Type } from "@google/genai"

//// rule 
const system_prompt = `
-Bạn là trợ lý AI đọc ảnh biển báo giao thông và trả về đúng cấu trúc định dạng.
-Làm theo dữ liệu từ mục RULE được đề cập
`

const rule = '[ { "ma_bien": "P.101", "ten_bien": "Đường cấm" }, { "ma_bien": "P.102", "ten_bien": "Cấm đi ngược chiều" }, { "ma_bien": "P.103a", "ten_bien": "Cấm xe ô tô" }, { "ma_bien": "P.103b", "ten_bien": "Cấm xe ô tô rẽ trái" }, { "ma_bien": "P.103c", "ten_bien": "Cấm xe ô tô rẽ phải" }, { "ma_bien": "P.104", "ten_bien": "Cấm xe máy" }, { "ma_bien": "P.105", "ten_bien": "Cấm xe ô tô và xe máy" }, { "ma_bien": "P.106a", "ten_bien": "Cấm xe ô tô tải" }, { "ma_bien": "P.106b", "ten_bien": "Cấm xe tải trên trị số ghi" }, { "ma_bien": "P.106c", "ten_bien": "Cấm xe chở hàng nguy hiểm" }, { "ma_bien": "P.107", "ten_bien": "Cấm xe ô tô khách và xe ô tô tải" }, { "ma_bien": "P.107a", "ten_bien": "Cấm xe ô tô khách" }, { "ma_bien": "P.107b", "ten_bien": "Cấm xe ô tô taxi" }, { "ma_bien": "P.108", "ten_bien": "Cấm xe kéo rơ-moóc" }, { "ma_bien": "P.108a", "ten_bien": "Cấm sơ-mi rơ-moóc" }, { "ma_bien": "P.109", "ten_bien": "Cấm máy kéo" }, { "ma_bien": "P.110a", "ten_bien": "Cấm đi xe đạp" }, { "ma_bien": "P.110b", "ten_bien": "Cấm xe đạp thồ" }, { "ma_bien": "P.111a", "ten_bien": "Cấm xe gắn máy" }, { "ma_bien": "P.111b", "ten_bien": "Cấm xe ba bánh có động cơ" }, { "ma_bien": "P.111c", "ten_bien": "Cấm xe ba bánh không động cơ" }, { "ma_bien": "P.111d", "ten_bien": "Cấm xe lôi máy" }, { "ma_bien": "P.112", "ten_bien": "Cấm người đi bộ" }, { "ma_bien": "P.113", "ten_bien": "Cấm xe người kéo đẩy" }, { "ma_bien": "P.114", "ten_bien": "Cấm xe súc vật kéo" }, { "ma_bien": "P.115", "ten_bien": "Hạn chế tải trọng toàn bộ xe" }, { "ma_bien": "P.116", "ten_bien": "Hạn chế tải trọng trục xe" }, { "ma_bien": "P.117", "ten_bien": "Hạn chế chiều cao" }, { "ma_bien": "P.118", "ten_bien": "Hạn chế chiều rộng" }, { "ma_bien": "P.119", "ten_bien": "Hạn chế chiều dài xe" }, { "ma_bien": "P.120", "ten_bien": "Hạn chế chiều dài xe kéo moóc" }, { "ma_bien": "P.121", "ten_bien": "Cự ly tối thiểu giữa hai xe" }, { "ma_bien": "P.123a", "ten_bien": "Cấm rẽ trái" }, { "ma_bien": "P.123b", "ten_bien": "Cấm rẽ phải" }, { "ma_bien": "P.124a", "ten_bien": "Cấm quay đầu xe" }, { "ma_bien": "P.124b", "ten_bien": "Cấm ô tô quay đầu xe" }, { "ma_bien": "P.124c", "ten_bien": "Cấm rẽ trái và quay đầu xe" }, { "ma_bien": "P.124d", "ten_bien": "Cấm rẽ phải và quay đầu xe" }, { "ma_bien": "P.124e", "ten_bien": "Cấm ô tô rẽ trái và quay đầu" }, { "ma_bien": "P.124f", "ten_bien": "Cấm ô tô rẽ phải và quay đầu" }, { "ma_bien": "P.125", "ten_bien": "Cấm vượt" }, { "ma_bien": "P.126", "ten_bien": "Cấm xe tải vượt" }, { "ma_bien": "P.127", "ten_bien": "Tốc độ tối đa cho phép" }, { "ma_bien": "P.127a", "ten_bien": "Tốc độ tối đa cho phép ban đêm" }, { "ma_bien": "P.127b", "ten_bien": "Biển ghép tốc độ tối đa theo làn" }, { "ma_bien": "P.128", "ten_bien": "Cấm sử dụng còi" }, { "ma_bien": "P.129", "ten_bien": "Kiểm tra" }, { "ma_bien": "P.130", "ten_bien": "Cấm dừng xe và đỗ xe" }, { "ma_bien": "P.131a", "ten_bien": "Cấm đỗ xe" }, { "ma_bien": "P.131b", "ten_bien": "Cấm đỗ xe ngày lẻ" }, { "ma_bien": "P.131c", "ten_bien": "Cấm đỗ xe ngày chẵn" }, { "ma_bien": "P.132", "ten_bien": "Nhường đường cho xe ngược chiều" }, { "ma_bien": "DP.133", "ten_bien": "Hết cấm vượt" }, { "ma_bien": "DP.134", "ten_bien": "Hết hạn chế tốc độ tối đa" }, { "ma_bien": "DP.135", "ten_bien": "Hết tất cả các lệnh cấm" }, { "ma_bien": "P.137", "ten_bien": "Cấm rẽ trái và rẽ phải" }, { "ma_bien": "P.139", "ten_bien": "Cấm đi thẳng và rẽ trái" }, { "ma_bien": "P.140", "ten_bien": "Cấm đi thẳng và rẽ phải" }, { "ma_bien": "W.201a", "ten_bien": "Chỗ ngoặt nguy hiểm vòng bên trái" }, { "ma_bien": "W.201b", "ten_bien": "Chỗ ngoặt nguy hiểm vòng bên phải" }, { "ma_bien": "W.202a", "ten_bien": "Nhiều chỗ ngoặt nguy hiểm liên tiếp trái" }, { "ma_bien": "W.202b", "ten_bien": "Nhiều chỗ ngoặt nguy hiểm liên tiếp phải" }, { "ma_bien": "W.203a", "ten_bien": "Đường bị thu hẹp cả hai bên" }, { "ma_bien": "W.203b", "ten_bien": "Đường bị thu hẹp bên trái" }, { "ma_bien": "W.203c", "ten_bien": "Đường bị thu hẹp bên phải" }, { "ma_bien": "W.204", "ten_bien": "Đường hai chiều" }, { "ma_bien": "W.205a", "ten_bien": "Đường giao nhau cùng cấp ngã tư" }, { "ma_bien": "W.205b", "ten_bien": "Đường giao nhau cùng cấp ngã ba trái" }, { "ma_bien": "W.205c", "ten_bien": "Đường giao nhau cùng cấp ngã ba phải" }, { "ma_bien": "W.205d", "ten_bien": "Đường giao nhau cùng cấp hình chữ T" }, { "ma_bien": "W.205e", "ten_bien": "Đường giao nhau cùng cấp vòng xuyến" }, { "ma_bien": "W.206", "ten_bien": "Giao nhau chạy theo vòng xuyến" }, { "ma_bien": "W.207a", "ten_bien": "Giao nhau với đường không ưu tiên" }, { "ma_bien": "W.207b", "ten_bien": "Giao không ưu tiên nhánh trái" }, { "ma_bien": "W.207c", "ten_bien": "Giao không ưu tiên nhánh phải" }, { "ma_bien": "W.208", "ten_bien": "Giao nhau với đường ưu tiên" }, { "ma_bien": "W.209", "ten_bien": "Giao nhau có tín hiệu đèn" }, { "ma_bien": "W.210", "ten_bien": "Giao nhau với đường sắt có rào chắn" }, { "ma_bien": "W.211a", "ten_bien": "Giao nhau với đường sắt không rào chắn" }, { "ma_bien": "W.211b", "ten_bien": "Giao nhau với đường tàu điện" }, { "ma_bien": "W.212", "ten_bien": "Cầu hẹp" }, { "ma_bien": "W.213", "ten_bien": "Cầu tạm" }, { "ma_bien": "W.214", "ten_bien": "Cầu xoay cầu cất" }, { "ma_bien": "W.215a", "ten_bien": "Kè vực sâu phía trước" }, { "ma_bien": "W.215b", "ten_bien": "Kè vực sâu bên phải" }, { "ma_bien": "W.215c", "ten_bien": "Kè vực sâu bên trái" }, { "ma_bien": "W.216a", "ten_bien": "Đường ngầm" }, { "ma_bien": "W.216b", "ten_bien": "Đường ngầm nguy cơ lũ quét" }, { "ma_bien": "W.217", "ten_bien": "Bến phà" }, { "ma_bien": "W.218", "ten_bien": "Cửa chui" }, { "ma_bien": "W.219", "ten_bien": "Dốc xuống nguy hiểm" }, { "ma_bien": "W.220", "ten_bien": "Dốc lên nguy hiểm" }, { "ma_bien": "W.221a", "ten_bien": "Đường có gồ giảm tốc" }, { "ma_bien": "W.221b", "ten_bien": "Đường có sóng trâu" }, { "ma_bien": "W.222a", "ten_bien": "Đường trơn trượt" }, { "ma_bien": "W.222b", "ten_bien": "Lề đường nguy hiểm" }, { "ma_bien": "W.223a", "ten_bien": "Vách đá nguy hiểm bên trái" }, { "ma_bien": "W.223b", "ten_bien": "Vách đá nguy hiểm bên phải" }, { "ma_bien": "W.224", "ten_bien": "Đường người đi bộ cắt ngang" }, { "ma_bien": "W.225", "ten_bien": "Trẻ em" }, { "ma_bien": "W.226", "ten_bien": "Đường người đi xe đạp cắt ngang" }, { "ma_bien": "W.227", "ten_bien": "Công trường" }, { "ma_bien": "W.228a", "ten_bien": "Đá lở" }, { "ma_bien": "W.228b", "ten_bien": "Sỏi đá bắn lên" }, { "ma_bien": "W.229", "ten_bien": "Dải máy bay lên xuống" }, { "ma_bien": "W.230", "ten_bien": "Gia súc" }, { "ma_bien": "W.231", "ten_bien": "Thú rừng vượt qua đường" }, { "ma_bien": "W.232", "ten_bien": "Gió ngang" }, { "ma_bien": "W.233", "ten_bien": "Nguy hiểm khác" }, { "ma_bien": "W.234", "ten_bien": "Giao nhau với đường hai chiều" }, { "ma_bien": "W.235", "ten_bien": "Đường đôi" }, { "ma_bien": "W.236", "ten_bien": "Hết đường đôi" }, { "ma_bien": "W.239", "ten_bien": "Đường cáp điện phía trên" }, { "ma_bien": "W.240", "ten_bien": "Đường hầm" }, { "ma_bien": "W.241", "ten_bien": "Ùn tắc giao thông" }, { "ma_bien": "W.242a", "ten_bien": "Nơi đường sắt giao vuông góc 1 đường" }, { "ma_bien": "W.242b", "ten_bien": "Nơi đường sắt giao vuông góc nhiều đường" }, { "ma_bien": "W.243a", "ten_bien": "Đường sắt giao không vuông góc 50m" }, { "ma_bien": "W.243b", "ten_bien": "Đường sắt giao không vuông góc 100m" }, { "ma_bien": "W.243c", "ten_bien": "Đường sắt giao không vuông góc 150m" }, { "ma_bien": "W.244", "ten_bien": "Đoạn đường hay xảy ra tai nạn" }, { "ma_bien": "W.245a", "ten_bien": "Đi chậm" }, { "ma_bien": "W.245b", "ten_bien": "Đi chậm có chỉ dẫn tiếng Anh" }, { "ma_bien": "W.246a", "ten_bien": "Chú ý chướng ngại vật tránh bên trái" }, { "ma_bien": "W.246b", "ten_bien": "Chú ý chướng ngại vật tránh bên phải" }, { "ma_bien": "W.246c", "ten_bien": "Chú ý chướng ngại vật tránh hai bên" }, { "ma_bien": "W.247", "ten_bien": "Chú ý xe đỗ trên đường" }, { "ma_bien": "R.301a", "ten_bien": "Hướng đi thẳng phải theo" }, { "ma_bien": "R.301b", "ten_bien": "Hướng rẽ phải phải theo" }, { "ma_bien": "R.301c", "ten_bien": "Hướng rẽ trái phải theo" }, { "ma_bien": "R.301d", "ten_bien": "Hướng rẽ phải trước biển" }, { "ma_bien": "R.301e", "ten_bien": "Hướng rẽ trái trước biển" }, { "ma_bien": "R.301f", "ten_bien": "Hướng đi thẳng và rẽ phải" }, { "ma_bien": "R.301g", "ten_bien": "Hướng đi thẳng và rẽ trái" }, { "ma_bien": "R.301h", "ten_bien": "Hướng rẽ trái và rẽ phải" }, { "ma_bien": "R.302a", "ten_bien": "Vòng chướng ngại vật sang phải" }, { "ma_bien": "R.302b", "ten_bien": "Vòng chướng ngại vật sang trái" }, { "ma_bien": "R.302c", "ten_bien": "Vòng chướng ngại vật cả hai bên" }, { "ma_bien": "R.303", "ten_bien": "Nơi giao nhau chạy theo vòng xuyến" }, { "ma_bien": "R.304", "ten_bien": "Đường dành cho xe thô sơ" }, { "ma_bien": "R.305", "ten_bien": "Đường dành cho người đi bộ" }, { "ma_bien": "R.306", "ten_bien": "Tốc độ tối thiểu cho phép" }, { "ma_bien": "R.307", "ten_bien": "Hết hạn chế tốc độ tối thiểu" }, { "ma_bien": "R.308a", "ten_bien": "Tuyến đường cầu vượt cắt ngang bên phải" }, { "ma_bien": "R.308b", "ten_bien": "Tuyến đường cầu vượt cắt ngang bên trái" }, { "ma_bien": "R.309", "ten_bien": "Ấn còi" }, { "ma_bien": "R.310", "ten_bien": "Hết hạn chế tốc độ tối thiểu" }, { "ma_bien": "R.403a", "ten_bien": "Đường dành cho xe ô tô" }, { "ma_bien": "R.403b", "ten_bien": "Đường dành cho ô tô xe máy" }, { "ma_bien": "R.404a", "ten_bien": "Hết đường dành cho xe ô tô" }, { "ma_bien": "R.404b", "ten_bien": "Hết đường dành cho ô tô xe máy" }, { "ma_bien": "R.411", "ten_bien": "Hướng đi trên mỗi làn đường" }, { "ma_bien": "R.412a", "ten_bien": "Làn đường dành cho ô tô khách" }, { "ma_bien": "R.412b", "ten_bien": "Làn đường dành cho ô tô con" }, { "ma_bien": "R.412c", "ten_bien": "Làn đường dành cho ô tô tải" }, { "ma_bien": "R.412d", "ten_bien": "Làn đường dành cho xe máy" }, { "ma_bien": "R.415", "ten_bien": "Biển gộp làn đường theo phương tiện" }, { "ma_bien": "I.401", "ten_bien": "Bắt đầu đường ưu tiên" }, { "ma_bien": "I.402", "ten_bien": "Hết đoạn đường ưu tiên" }, { "ma_bien": "I.405a", "ten_bien": "Đường cụt bên phải" }, { "ma_bien": "I.405b", "ten_bien": "Đường cụt bên trái" }, { "ma_bien": "I.407a", "ten_bien": "Đường một chiều" }, { "ma_bien": "I.407b", "ten_bien": "Đường một chiều rẽ phải" }, { "ma_bien": "I.408", "ten_bien": "Nơi đỗ xe" }, { "ma_bien": "I.408a", "ten_bien": "Nơi đỗ xe một phần trên vỉa hè" }, { "ma_bien": "I.414a", "ten_bien": "Chỉ hướng đường" }, { "ma_bien": "I.417", "ten_bien": "Chỉ hướng cầu vượt" }, { "ma_bien": "I.423a", "ten_bien": "Đường người đi bộ sang ngang" }, { "ma_bien": "I.423b", "ten_bien": "Đường người đi bộ sang ngang bên trái" }, { "ma_bien": "I.424a", "ten_bien": "Cầu vượt qua đường cho người đi bộ" }, { "ma_bien": "I.424b", "ten_bien": "Hầm chui qua đường cho người đi bộ" }, { "ma_bien": "I.439", "ten_bien": "Tên đường" }, { "ma_bien": "I.440", "ten_bien": "Di tích lịch sử" }, { "ma_bien": "I.441a", "ten_bien": "Báo hiệu phía trước có công trường" }, { "ma_bien": "I.443", "ten_bien": "Xe kéo moóc" }, { "ma_bien": "S.501", "ten_bien": "Phạm vi tác dụng của biển" }, { "ma_bien": "S.502", "ten_bien": "Khoảng cách đến đối tượng báo hiệu" }, { "ma_bien": "S.503a", "ten_bien": "Hướng tác dụng trái" }, { "ma_bien": "S.503b", "ten_bien": "Hướng tác dụng phải" }, { "ma_bien": "S.503c", "ten_bien": "Hướng tác dụng cả hai bên" }, { "ma_bien": "S.504", "ten_bien": "Làn đường" }, { "ma_bien": "S.505a", "ten_bien": "Loại xe" }, { "ma_bien": "S.506a", "ten_bien": "Hướng đường ưu tiên" }, { "ma_bien": "S.507", "ten_bien": "Hướng rẽ nguy hiểm" }, { "ma_bien": "S.508a", "ten_bien": "Biểu thị thời gian" }, { "ma_bien": "S.509a", "ten_bien": "Thuyết minh biển chính" } ]'

const user_prompt = `
    RULE: 
    ${rule}

    Đọc và phân tích kĩ biển báo theo luật đường bộ Việt Nam hiện hành, đưa ra kết quả chính xác nhất
`

const AI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
  // apiKey: GOOGLE_API_KEY // test
})

async function fileToBase64(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = "";
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }

    const base64Data = btoa(binaryString);
    return base64Data;
  } catch (error) {
    console.error("File Image Conversion Error:", error);
    throw error;
  }
}

//MINDSET ///// file_image được truyền vào bên dưới hàm call ai // Xử lý từ fontend ----------------------
// document.getElementById('upload_image').addEventListener('click', async () => {
//   const fileInput = document.getElementById('imageInput');
//  
//   if (fileInput.files.length === 0) {
//     return;
//   }

//   const file_image = fileInput.files[0];
//--------------------------------------------------------------------------------------------------------

//DESCRIPTION -------------------------------
//return type for {call_ai}

//json -- {
//   content: content_in,
//   status: status_code
// }

// content_in sẽ là chuỗi nếu lỗi
// content_in sẽ là json {"Sign_id": "vdP.101"} nếu status == 200
// ------------------------------------------

export const call_ai = async (image_prompt) => {

  try {

    const image_prompt = {
      inlineData: {
        data: await fileToBase64(file_image),
        mimeType: file_image.type
      }
    };

    const response = await AI.models.generateContent({
      model: 'gemma-4-31b-it',
      contents: [
        user_prompt,
        image_prompt
      ],
      config: {
        systemInstruction: system_prompt,
        responseMimeType: "application/json",

        //Dịnh dạng trả về JSon -- nếu định dạng khác thì nói t hoặc đưa lên gemini nha
        // {
        //   "Sign_id": ...
        // }
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            Sign_id: {
              type: Type.STRING,
              description: "Mã số biển báo giao thông trong hình theo luật đường bộ Việt Nam"
            }
          },
          required: ["Sign_id"]
        },
      }
    });

    return {
      content: response.text,
      status: 200
    }
  } catch (error) {

    if (error.status === 429 || error.message?.includes('429'))
      return {
        content: "Out of Request today, try it later",
        status: 429
      }
    else
      return {
        content: `Error: ${error}`,
        status: 404
      }
  }
}