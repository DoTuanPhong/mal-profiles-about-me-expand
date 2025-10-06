<script setup>
import { ref, onMounted, computed } from 'vue';
import AnimeCard from './components/AnimeCard.vue'; // Giả sử AnimeCard đã tồn tại
// ⚠️ Cần import các hàm FIREBASE cần thiết
import { collection, getDocs, query } from 'firebase/firestore'; 
// KHÔNG CẦN 'orderBy' nếu ta muốn sắp xếp trên client.
import { db } from '../firebase'; // Giả sử db được export từ './firebase'

// --- STATE ---
const animeListRaw = ref([]); // Dữ liệu gốc từ Firestore
const sortOption = ref('newest'); // 'newest', 'az', 'za'
const isLoading = ref(true);

// --- LẤY DỮ LIỆU TỪ FIRESTORE ---
onMounted(async () => {
  try {
    // Lấy dữ liệu KHÔNG CẦN orderBy (hoặc chỉ orderBy cơ bản nếu cần index)
    // Query đơn giản để lấy tất cả tài liệu
    const q = query(collection(db, "animes")); 

    const querySnapshot = await getDocs(q);
    
    animeListRaw.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        // Chuyển đổi Firestore Timestamp thành Date object để dễ sắp xếp
        // Thêm kiểm tra nếu trường createdAt không tồn tại
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(0), 
      };
    });

  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ Firestore:", error);
  } finally {
    isLoading.value = false;
  }
});

// --- LOGIC SẮP XẾP BẰNG COMPUTED ---
/**
 * Computed property để sắp xếp danh sách anime
 * Sẽ tự động chạy lại khi animeListRaw hoặc sortOption thay đổi
 */
const sortedAnimeList = computed(() => {
  if (!animeListRaw.value.length) return [];
  
  const list = [...animeListRaw.value]; // Tạo bản sao để sắp xếp
  
  if (sortOption.value === 'az') {
    // Sắp xếp theo tên A-Z
    return list.sort((a, b) => a.title.localeCompare(b.title));
  }
  
  if (sortOption.value === 'za') {
    // Sắp xếp theo tên Z-A
    return list.sort((a, b) => b.title.localeCompare(a.title));
  }
  
  // Mặc định là 'newest' (Mới nhất)
  // Sắp xếp giảm dần (mới nhất lên đầu)
  return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
    
    <div v-if="isLoading" class="text-center p-8 text-xl text-gray-600">
      Đang tải dữ liệu...
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      
      <AnimeCard
        v-for="(anime, index) in sortedAnimeList"
        :key="anime.id" 
        :anime="anime"
        :class="['fade-in', `delay-${index * 100}ms`]"
      />
      
      <p v-if="!sortedAnimeList.length" class="col-span-full text-center text-gray-500">
        Không tìm thấy anime nào.
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

.delay-0ms { animation-delay: 0ms; }
.delay-100ms { animation-delay: 100ms; }
.delay-200ms { animation-delay: 200ms; }
/* ... Thêm các lớp delay khác ... */
</style>