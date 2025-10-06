<script setup>
import { ref, onMounted, computed } from 'vue';
import AnimeCard from './AnimeCard.vue';
// ✅ SỬA: Import 'db' trực tiếp từ file cấu hình firebase
import { db } from '../firebase'; // Giả sử file của bạn là 'src/firebase.js'
import { collection, getDocs } from 'firebase/firestore';

const animeListRaw = ref([]);
const sortOption = ref('newest');
// ✅ CẢI TIẾN: Thêm biến trạng thái loading
const isLoading = ref(true); 
const errorMsg = ref('');

const fetchData = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    // ✅ SỬA: Đúng tên collection là 'anime'
    const animeCollectionRef = collection(db, 'anime');
    const snapshot = await getDocs(animeCollectionRef);

    const fetchedAnimeList = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(0), // Dùng optional chaining cho an toàn
      };
    });

    animeListRaw.value = fetchedAnimeList;
    console.log("Dữ liệu anime đã được tải thành công.");
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ Firestore:", error);
    errorMsg.value = "Không thể tải danh sách anime. Vui lòng thử lại sau.";
  } finally {
    // Luôn đặt isLoading = false sau khi hoàn tất
    isLoading.value = false;
  }
};

onMounted(fetchData);

const sortedAnimeList = computed(() => {
  // Logic sắp xếp của bạn đã rất tốt, không cần thay đổi
  const list = [...animeListRaw.value];
  if (sortOption.value === 'az') {
    return list.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sortOption.value === 'za') {
    return list.sort((a, b) => b.title.localeCompare(a.title));
  }
  return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
});
</script>

<template>
  <div class="anime-list-container">
    <div class="p-4 flex justify-end sticky top-0 bg-gray-100/80 backdrop-blur-sm z-10">
      <select v-model="sortOption" class="p-2 border rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500">
        <option value="newest">Mới nhất</option>
        <option value="az">Tên A-Z</option>
        <option value="za">Tên Z-A</option>
      </select>
    </div>
    
    <!-- ✅ CẢI TIẾN: Quản lý trạng thái loading và lỗi tốt hơn -->
    <div v-if="isLoading" class="text-center p-10 text-gray-500">
      Đang tải dữ liệu...
    </div>
    <div v-else-if="errorMsg" class="text-center p-10 text-red-500">
      {{ errorMsg }}
    </div>
    <div v-else-if="sortedAnimeList.length" class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      <AnimeCard
        v-for="(anime, index) in sortedAnimeList"
        :key="anime.id" 
        :anime="anime"
        class="fade-in"
        :style="{ 'animation-delay': `${index * 50}ms` }" 
      />
    </div>
    <div v-else class="text-center p-10 text-gray-500">
      Chưa có anime nào trong danh sách.
    </div>
  </div>
</template>

<style scoped>
/* Style của bạn đã tốt, chỉ cần sửa một chút animation delay */
.anime-list-container {
  background-color: #f8f9fa;
  min-height: 100vh;
}
.fade-in {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>