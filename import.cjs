// import.cjs

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const data = require("./data.json");

async function importData() {
  const animeCollection = db.collection('anime');
  console.log('Bắt đầu import dữ liệu với trường createdAt...');

  // Lấy thời gian hiện tại LÀM MỐC
  const now = new Date();

  try {
    // Dùng for...of loop để đảm bảo thứ tự import
    for (let i = 0; i < data.length; i++) {
      const anime = data[i];

      // TẠO TIMESTAMP GIẢM DẦN
      // Anime đầu tiên trong file JSON sẽ có timestamp gần 'now' nhất.
      // Anime tiếp theo sẽ có timestamp lùi lại 1 giây, v.v...
      // Điều này đảm bảo thứ tự ban đầu được giữ nguyên khi sắp xếp giảm dần.
      const createdAt = new Date(now.getTime() - i * 1000); // Lùi lại i giây

      // Tạo một object mới bao gồm dữ liệu cũ và trường createdAt
      const dataToImport = {
        ...anime, // Sao chép tất cả các trường từ file JSON
        createdAt: createdAt // Thêm trường mới
      };

      await animeCollection.add(dataToImport);
      console.log(`Đã thêm thành công: ${anime.title}`);
    }

    console.log('=================================');
    console.log('✅ Import toàn bộ dữ liệu thành công!');
  } catch (error) {
    console.error('❌ Có lỗi xảy ra trong quá trình import:', error);
  }
}

importData();