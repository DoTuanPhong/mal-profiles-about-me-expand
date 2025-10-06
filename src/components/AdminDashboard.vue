<script setup>
import { ref } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const newAnime = ref({ title: '', url: '' });

const handleAddAnime = async () => {
  if (!newAnime.value.title) return;
  await addDoc(collection(db, "anime"), {
    title: newAnime.value.title,
    url: newAnime.value.url,
    // Thêm các trường khác ở đây
  });
  // Xóa form sau khi thêm
  newAnime.value = { title: '', url: '' };
  // Bạn có thể thêm logic để load lại list
};
</script>

<template>
  <div>
    <h2>Bảng điều khiển Admin</h2>
    <div>
      <h3>Thêm Anime mới</h3>
      <input v-model="newAnime.title" placeholder="Tên Anime" />
      <input v-model="newAnime.url" placeholder="Link MAL" />
      <button @click="handleAddAnime">Thêm</button>
    </div>
    <!-- Danh sách anime với các nút Sửa/Xóa sẽ nằm ở đây -->
  </div>
</template>