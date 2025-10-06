<script setup>
import AdminDashboard from './AdminDashboard.vue'; // Giả định đường dẫn đúng
import Login from './Login.vue'; // Giả định đường dẫn đúng
import { XMarkIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  isOpen: Boolean,
  isLoggedIn: Boolean,
});

const emit = defineEmits(['close', 'logout']);
</script>

<template>
  <div v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div 
        class="relative w-full max-w-md mx-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all duration-300 animate-slide-down"
        @click.stop
    >
        <button @click="emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <XMarkIcon class="w-6 h-6" />
        </button>

        <div v-if="isLoggedIn" class="space-y-4">
            <div class="flex justify-between items-center mb-4 border-b pb-2 border-gray-100 dark:border-gray-700">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h3>
                <button 
                    @click="emit('logout')" 
                    class="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                >
                    Đăng xuất
                </button>
            </div>
            <AdminDashboard />
        </div>
        <div v-else class="space-y-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Admin Login</h3>
            <Login />
        </div>
    </div>
  </div>
</template>

<style scoped>
/* Thêm animation cơ bản cho Modal */
@keyframes slide-down {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate-slide-down {
    animation: slide-down 0.3s ease-out forwards;
}
</style>