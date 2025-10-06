<script setup>
import { ref, onMounted, computed } from 'vue';
import AnimeCard from './components/AnimeCard.vue'; // Giả sử AnimeCard nằm ở đường dẫn này

// Dữ liệu gốc
const animeListRaw = ref([]);
// Tùy chọn sắp xếp mặc định
const sortOption = ref('newest'); // 'newest', 'az', 'za'

// Hàm mô phỏng việc lấy dữ liệu (thay thế bằng code lấy dữ liệu thực tế của bạn, ví dụ: từ Firestore)
// Dữ liệu mẫu giả định: id, title, createdAt (timestamp hoặc Date object)
const fetchData = async () => {
  // Thay thế phần này bằng code lấy dữ liệu Firestore thực tế
  const dummyData = [
    { id: 1, title: 'Attack on Titan', createdAt: new Date('2023-01-15T10:00:00Z') },
    { id: 2, title: 'Jujutsu Kaisen', createdAt: new Date('2023-03-20T12:00:00Z') },
    { id: 3, title: 'One Piece', createdAt: new Date('2022-05-10T08:00:00Z') },
    { id: 4, title: 'Chainsaw Man', createdAt: new Date('2023-11-01T15:30:00Z') },
  ];

  // Giả lập độ trễ
  await new Promise(resolve => setTimeout(resolve, 500)); 
  
  // Gán dữ liệu vào ref
  animeListRaw.value = dummyData; 
};

// Lấy dữ liệu 1 lần khi component được tạo
onMounted(() => {
  fetchData();
});

/**
 * Computed property để sắp xếp danh sách anime
 * Sẽ tự động chạy lại khi animeListRaw hoặc sortOption thay đổi
 */
const sortedAnimeList = computed(() => {
  const list = [...animeListRaw.value]; // Tạo bản sao để không thay đổi list gốc
  
  if (sortOption.value === 'az') {
    // Sắp xếp theo tên A-Z
    return list.sort((a, b) => a.title.localeCompare(b.title));
  }
  
  if (sortOption.value === 'za') {
    // Sắp xếp theo tên Z-A
    return list.sort((a, b) => b.title.localeCompare(a.title));
  }
  
  // Mặc định là 'newest' (Mới nhất)
  return list.sort((a, b) => {
    // Chuyển đổi Firestore Timestamp sang Date nếu cần, sau đó trừ để so sánh
    // Giả sử: nếu là Timestamp, dùng .toDate()
    const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
    const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();

    // Sắp xếp giảm dần (mới nhất lên đầu)
    return dateB - dateA;
  });
});
</script>

<template>
  <div class="anime-list-container">
    <div class="p-4 flex justify-end">
      <select v-model="sortOption" class="p-2 border rounded shadow-md bg-white">
        <option value="newest">Mới nhất</option>
        <option value="az">Tên A-Z</option>
        <option value="za">Tên Z-A</option>
      </select>
    </div>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      <AnimeCard
        v-for="(anime, index) in sortedAnimeList"
        :key="anime.id" 
        :anime="anime"
        :class="['fade-in', `delay-${index * 100}ms`]"
      />
      
      <p v-if="!animeListRaw.length && sortOption !== null" class="col-span-full text-center text-gray-500">
        Đang tải dữ liệu...
      </p>
      <p v-if="animeListRaw.length > 0 && !sortedAnimeList.length" class="col-span-full text-center text-gray-500">
        Không tìm thấy anime nào phù hợp.
      </p>
    </div>
  </div>
</template>

<style scoped>
.anime-list-container {
  /* Thiết kế nền theo mẫu bạn cung cấp */
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  min-height: 100vh;
}

/* Hiệu ứng Fade In và Delay */
.fade-in {
  opacity: 0; /* Khởi tạo ẩn */
  animation: fadeIn 0.6s ease-in-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Tạo các lớp delay động cho hiệu ứng xếp tầng */
.delay-0ms { animation-delay: 0ms; }
.delay-100ms { animation-delay: 100ms; }
.delay-200ms { animation-delay: 200ms; }
.delay-300ms { animation-delay: 300ms; }
.delay-400ms { animation-delay: 400ms; }
.delay-500ms { animation-delay: 500ms; }
.delay-600ms { animation-delay: 600ms; }
.delay-700ms { animation-delay: 700ms; }
.delay-800ms { animation-delay: 800ms; }
/* ... có thể thêm nhiều delay hơn nếu cần cho danh sách lớn ... */
</style>