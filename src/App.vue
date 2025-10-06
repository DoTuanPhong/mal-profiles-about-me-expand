<script setup>
import { ref, onMounted } from 'vue';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import AnimeList from './components/AnimeList.vue';
import AdminDashboard from './components/AdminDashboard.vue';
import Login from './components/Login.vue';

const isLoggedIn = ref(false);

// Theo dõi trạng thái đăng nhập
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

const handleLogout = () => {
  signOut(auth);
};
</script>

<template>
  <header>
    <h1>My Anime List</h1>
    <button v-if="isLoggedIn" @click="handleLogout">Đăng xuất</button>
  </header>

  <main>
    <div v-if="isLoggedIn">
      <AdminDashboard />
    </div>
    <div v-else>
      <!-- Hiển thị trang login nếu bạn muốn, hoặc chỉ hiển thị list anime -->
      <Login />
    </div>
    <hr>
    <h2>Danh sách Anime công khai</h2>
    <AnimeList />
  </main>
</template>