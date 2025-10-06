<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const animeList = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  const q = query(collection(db, "anime"), orderBy("title"));
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