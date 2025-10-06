<script setup>
import { ref, onMounted, computed } from 'vue';
import AnimeCard from './AnimeCard.vue';
// ⚠️ CẦN IMPORT CÁC THƯ VIỆN FIREBASE CẦN THIẾT
// Ví dụ (thay đổi tùy theo cách bạn cấu hình):
import { getFirestore, collection, getDocs } from 'firebase/firestore'; 
// import { app } from '@/firebaseConfig'; // Giả sử bạn import app từ file cấu hình

// Khởi tạo Firestore instance (thay đổi nếu cần)
// const db = getFirestore(app); 
const db = getFirestore(); // Giả sử db đã được cung cấp global hoặc qua provide/inject

// Dữ liệu gốc
const animeListRaw = ref([]);
// Tùy chọn sắp xếp mặc định
const sortOption = ref('newest');

/**
 * Hàm lấy dữ liệu từ Firestore
 */
 
const fetchData = async () => {
  try {
    // 1. Tạo reference đến collection 'animes'
    const animeCollectionRef = collection(db, 'animes');

    // 2. Lấy tất cả documents (KHÔNG dùng orderBy ở đây để việc sắp xếp do client xử lý)
    const snapshot = await getDocs(animeCollectionRef);

    // 3. Xử lý và lưu dữ liệu
    const fetchedAnimeList = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Đảm bảo createdAt là Date object để sắp xếp
        // Firestore Timestamp có hàm .toDate()
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(0), 
      };
    });

    animeListRaw.value = fetchedAnimeList;
    console.log("Dữ liệu anime đã được tải từ Firestore.");

  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ Firestore:", error);
    // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
  }
};

// Lấy dữ liệu 1 lần khi component được tạo
onMounted(() => {
  fetchData();
});

/**
 * Computed property để sắp xếp danh sách anime
 */
const sortedAnimeList = computed(() => {
  const list = [...animeListRaw.value];
  
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
    // Sắp xếp giảm dần (mới nhất lên đầu)
    return b.createdAt.getTime() - a.createdAt.getTime();
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
      <p v-if="!animeListRaw.length && sortOption !== null" class="col-span-full text-center text-gray-500">
        Đang tải dữ liệu...
      </p>
      
      <AnimeCard
        v-for="(anime, index) in sortedAnimeList"
        :key="anime.id" 
        :anime="anime"
        :class="['fade-in', `delay-${index * 100}ms`]"
      />
      
      <p v-if="animeListRaw.length > 0 && !sortedAnimeList.length" class="col-span-full text-center text-gray-500">
        Không tìm thấy anime nào phù hợp.
      </p>
    </div>
  </div>
</template>

<style scoped>
.anime-list-container {
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  min-height: 100vh;
}
.fade-in {
  opacity: 0;
  animation: fadeIn 0.6s ease-in-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Các lớp delay động (có thể tạo tự động nếu danh sách quá lớn) */
.delay-0ms { animation-delay: 0ms; }
.delay-100ms { animation-delay: 100ms; }
.delay-200ms { animation-delay: 200ms; }
.delay-300ms { animation-delay: 300ms; }
.delay-400ms { animation-delay: 400ms; }
/* ... */
</style>