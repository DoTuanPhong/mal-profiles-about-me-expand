<script setup>
import { ref, onMounted } from 'vue';
// Thêm 'orderBy' và 'query' từ firebase/firestore
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const animeList = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  // Tạo một câu truy vấn có sắp xếp
  const q = query(collection(db, "anime"), orderBy("createdAt", "desc")); // "desc" = descending = giảm dần

  // Thực thi câu truy vấn
  const querySnapshot = await getDocs(q);
  animeList.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading">Đang tải...</div>
  <div v-else>
    <div v-for="anime in animeList" :key="anime.id" class="anime-card">
      <h3><a :href="anime.url" target="_blank">{{ anime.title }}</a></h3>
      <!-- Hiển thị các tập và timestamps ở đây -->
    </div>
  </div>
</template>