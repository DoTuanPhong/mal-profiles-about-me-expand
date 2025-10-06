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
    if (user) {
      showPopup.value = false; // Đóng popup nếu đã đăng nhập
    }
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
  <main>
    <h1>My Anime List</h1>
    
    <div v-if="isLoggedIn">
      <AdminDashboard />
    </div>
    
    <hr>
    <h2>Danh sách Anime công khai</h2>
    <AnimeList />
    
    <!-- Nút nổi ở cuối màn hình -->
    <button class="floating-btn" @click="togglePopup">
      {{ isLoggedIn ? 'Admin' : 'Đăng nhập' }}
    </button>
    
    <!-- Popup ở cuối màn hình -->
    <div v-if="showPopup" class="popup" @click.self="showPopup = false">
      <div class="popup-content">
        <div v-if="isLoggedIn">
          <h3>Quản trị viên</h3>
          <p>Bạn đã đăng nhập thành công!</p>
          <button @click="handleLogout">Đăng xuất</button>
        </div>
        <div v-else>
          <h3>Admin Login</h3>
          <Login @login-success="showPopup = false" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.floating-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-btn:hover {
  background-color: #0056b3;
}

.popup {
  position: fixed;
  bottom: 80px; /* Cách nút nổi một chút */
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  z-index: 1001;
  background: transparent;
}

.popup-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
}

main {
  padding-bottom: 80px; /* Để tránh nút nổi che nội dung */
}
</style>