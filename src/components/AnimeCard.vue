<template>
  <div 
    class="anime-card bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl overflow-hidden border-l-4 max-w-2xl mx-auto transition-all duration-300" 
    :style="{'--anime-color': anime.color || '#cccccc'}"
  >
    <!-- Header -->
    <div class="header p-6 text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-black/20"></div>
      <a :href="anime.url" target="_blank" class="block relative z-10 transition-colors hover:text-white/100">
        <h2 class="text-3xl font-bold text-white mb-4 shadow-sm" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.5);">
          「{{ anime.title }}」
        </h2>
      </a>
    </div>
    
    <!-- Highlights -->
    <div class="highlights p-6 space-y-4">
      <div
        v-for="(highlight, hIndex) in anime.highlights"
        :key="hIndex"
        class="highlight-item space-y-2"
      >
        <!-- Cấp độ 2 - LUÔN HIỂN THỊ -->
        <div class="text-center space-y-1">
          <div class="flex items-center justify-center space-x-2">
            <a
              v-if="highlight.url"
              :href="highlight.url"
              target="_blank"
              class="text-blue-500 dark:text-blue-400 font-semibold text-lg hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {{ highlight.type === 'episode' ? `episode ${highlight.number}` : 'Movie' }}
            </a>
            <span v-else class="text-blue-500 dark:text-blue-400 font-semibold text-lg">
              {{ highlight.type === 'episode' ? `episode ${highlight.number}` : 'Movie' }}
            </span>
          </div>

          <!-- Timestamps -->
          <div v-if="highlight.moments && highlight.moments.length > 0" class="flex items-center justify-center space-x-1">
            <span class="text-red-500 dark:text-red-400 text-lg font-bold"> ～ </span>
            <span
              v-for="(moment, mIndex) in highlight.moments"
              :key="mIndex"
              class="text-green-500 dark:text-green-400 font-mono text-lg"
            >
              {{ moment.timestamp }}
              <span v-if="mIndex < highlight.moments.length - 1" class="text-green-500 dark:text-green-400"> ⁘ </span>
            </span>
          </div>
          <div v-else class="text-gray-500 dark:text-gray-400 italic text-sm">
            No highlighted moments.
          </div>
        </div>

        <!-- Cấp độ 3: Spoilers - CHỈ ẨN KHI KHÔNG CÓ COMMENT -->
        <div v-if="hasCommentsWithSpoilers(highlight)" class="text-right space-y-2 pr-2">
          <div
            v-for="(moment, mIndex) in getMomentsWithComments(highlight)"
            :key="mIndex"
            class="flex justify-end items-start space-x-2"
          >
            <!-- Spoiler content -->
            <div class="flex flex-col items-end space-y-1 max-w-full">
              <!-- Nút spoiler mới với gradient -->
              <button
                @click="toggleSpoiler(hIndex, mIndex)"
                :class="[
                  'spoiler-btn inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  isSpoilerVisible(hIndex, mIndex) 
                    ? 'spoiler-btn-hide' 
                    : 'spoiler-btn-show'
                ]"
              >
                <span class="flex items-center">
                  <svg v-if="!isSpoilerVisible(hIndex, mIndex)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 5 10" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 10 10" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ isSpoilerVisible(hIndex, mIndex) ? 'Hide Spoiler' : 'Show Spoiler' }}
                </span>
              </button>
              
              <!-- Spoiler text với hiệu ứng mượt mà -->
              <transition
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in"
                enter-from-class="opacity-0 transform -translate-y-2"
                leave-to-class="opacity-0 transform -translate-y-2"
              >
                <div
                  v-if="isSpoilerVisible(hIndex, mIndex)"
                  class="spoiler-content bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300 text-sm px-4 py-3 rounded-lg border border-blue-200 dark:border-gray-600 shadow-sm max-w-full text-right mt-2"
                >
                  <div class="font-medium text-blue-800 dark:text-blue-200 mb-1">{{ moment.timestamp }}</div>
                  <div class="italic leading-relaxed">{{ moment.comment }}</div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  anime: {
    type: Object,
    required: true
  }
});

const showSpoilers = ref({});

const isSpoilerVisible = (hIndex, mIndex) => {
  return !!(showSpoilers.value[hIndex] && showSpoilers.value[hIndex][mIndex]);
};

const toggleSpoiler = (hIndex, mIndex) => {
  if (!showSpoilers.value[hIndex]) {
    showSpoilers.value[hIndex] = {};
  }
  showSpoilers.value[hIndex][mIndex] = !showSpoilers.value[hIndex][mIndex];
  showSpoilers.value = {...showSpoilers.value};
};

// Chỉ hiển thị spoiler section nếu có ít nhất một moment có comment
const hasCommentsWithSpoilers = (highlight) => {
  return highlight.moments && highlight.moments.some(m => m.comment && m.comment.trim() !== '');
};

// Lọc chỉ những moments có comment để hiển thị nút spoiler
const getMomentsWithComments = (highlight) => {
  if (!highlight.moments) return [];
  return highlight.moments.filter(m => m.comment && m.comment.trim() !== '');
};
</script>

<style scoped>
.anime-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left-color: var(--anime-color, #cccccc);
}
.anime-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.header {
  background: linear-gradient(135deg, var(--anime-color, #4A5568), var(--anime-color-light, #6a7280));
}

.highlight-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.dark .highlight-item {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}
.highlight-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* Nút spoiler mới với gradient */
.spoiler-btn-show {
  background: linear-gradient(135deg, #ec4899, #f97316);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(236, 72, 153, 0.3), 0 2px 4px -1px rgba(236, 72, 153, 0.2);
  border: none;
}

.spoiler-btn-show:hover {
  box-shadow: 0 6px 8px -1px rgba(236, 72, 153, 0.4), 0 4px 6px -1px rgba(236, 72, 153, 0.3);
}

.spoiler-btn-hide {
  background: transparent;
  color: #f97316;
  border: 2px solid;
  border-image: linear-gradient(135deg, #ec4899, #f97316) 1;
  box-shadow: 0 2px 4px -1px rgba(249, 115, 22, 0.2);
}

.spoiler-btn-hide:hover {
  box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.3);
}

/* Focus styles */
.spoiler-btn:focus {
  ring: 2px;
  ring-color: rgba(249, 115, 22, 0.5);
  ring-offset: 2px;
}

/* Tùy chỉnh scrollbar cho spoiler text nếu content dài */
.spoiler-content {
  max-height: 200px;
  overflow-y: auto;
}
.spoiler-content::-webkit-scrollbar {
  width: 4px;
}
.spoiler-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}
.spoiler-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}
.dark .spoiler-content::-webkit-scrollbar-track {
  background: #374151;
}
.dark .spoiler-content::-webkit-scrollbar-thumb {
  background: #6b7280;
}
</style>