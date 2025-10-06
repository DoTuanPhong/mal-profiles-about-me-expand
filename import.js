// import.js

// 1. Khởi tạo Firebase Admin
const admin = import("firebase-admin");
// Đọc file key bạn vừa tải về
const serviceAccount = import("./mal-profiles-about-me-expand-firebase-adminsdk-fbsvc-0379de740a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Lấy tham chiếu đến Firestore
const db = admin.firestore();

// 2. Đọc file dữ liệu JSON của bạn
const data = require("./data.json");

// 3. Hàm để import dữ liệu
async function importData() {
  // Chỉ định collection bạn muốn thêm vào, ở đây là 'anime'
  const animeCollection = db.collection('anime');
  console.log('Bắt đầu import dữ liệu...');

  try {
    // Dùng Promise.all để đợi tất cả các thao tác ghi hoàn tất
    await Promise.all(data.map(async (anime) => {
      // Dùng add() để Firestore tự tạo ID cho mỗi document
      await animeCollection.add(anime);
      console.log(`Đã thêm thành công: ${anime.title}`);
    }));
    console.log('=================================');
    console.log('✅ Import toàn bộ dữ liệu thành công!');
  } catch (error) {
    console.error('❌ Có lỗi xảy ra trong quá trình import:', error);
  }
}

// Chạy hàm import
importData();