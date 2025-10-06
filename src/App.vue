<script setup>
import { ref, onMounted } from 'vue';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import AnimeList from './components/AnimeList.vue';
// Sửa thành component quản lý toàn bộ logic Admin/Login
import AdminModal from './components/AdminModal.vue'; 
import { HomeIcon, UserCircleIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/vue/24/solid' // Thêm icons cho FAB

const isLoggedIn = ref(false);
const isModalOpen = ref(false); // Trạng thái kiểm soát Modal

// Theo dõi trạng thái đăng nhập
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
    if (user) {
        // Tự động đóng modal nếu đăng nhập thành công
        isModalOpen.value = false; 
    }
  });
});

const handleLogout = () => {
  signOut(auth);
};

// Đóng modal từ bên ngoài hoặc từ bên trong component
const closeModal = () => {
    isModalOpen.value = false;
}
</script>

<template>
  <main class="relative min-h-screen">
    <header class="text-center py-6">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">My Anime List</h1>
    </header>

    <div 
        class="fixed bottom-6 right-6 z-50 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg cursor-pointer transition-all"
        @click="isModalOpen = true"
    >
        <UserCircleIcon class="w-8 h-8" v-if="!isLoggedIn" />
        <ArrowLeftEndOnRectangleIcon class="w-8 h-8" v-else />
    </div>

    <Teleport to="body">
        <AdminModal 
            :is-open="isModalOpen" 
            :is-logged-in="isLoggedIn" 
            @close="closeModal" 
            @logout="handleLogout" 
        />
    </Teleport>

    <section class="max-w-7xl mx-auto p-4 pt-0">
        <hr class="my-6 border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Danh sách Anime công khai</h2>
        <AnimeList />
    </section>
  </main>
</template>