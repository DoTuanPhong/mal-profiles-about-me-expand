<script setup>
import { ref, onMounted } from 'vue';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import AnimeList from './components/AnimeList.vue';
import AdminDashboard from './components/AdminDashboard.vue';
import Login from './components/Login.vue';

const isLoggedIn = ref(false);
const showPopup = ref(false);

// Theo dõi trạng thái đăng nhập
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

const handleLogout = () => {
  signOut(auth);
  showPopup.value = false; // Đóng popup sau khi đăng xuất
};

const togglePopup = () => {
  showPopup.value = !showPopup.value;
};
</script>

<template>
  <div>
    <!-- Nút nổi ở cuối màn hình -->
    <button class="floating-btn" @click="togglePopup">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <!-- Popup/Modal -->
    <div v-if="showPopup" class="popup-overlay" @click="togglePopup">
      <div class="popup-content" @click.stop>
        <h1>My Anime List</h1>
        <button v-if="isLoggedIn" @click="handleLogout">Đăng xuất</button>
        <button class="close-btn" @click="togglePopup">Đóng</button>
      </div>
    </div>

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
  </div>
</template>

<style>
.floating-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4a6cf7;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.3s ease;
}

.floating-btn:hover {
  background-color: #3a5bd9;
  transform: scale(1.1);
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.close-btn {
  margin-top: 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #5a6268;
}
</style>