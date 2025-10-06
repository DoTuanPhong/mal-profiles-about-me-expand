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
        <!-- Cấp độ 2 -->
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
            Không có khoảnh khắc nổi bật.
          </div>
        </div>

        <!-- Cấp độ 3: Spoilers - ĐÃ TỐI ƯU -->
        <div v-if="hasCommentsWithSpoilers(highlight)" class="text-right space-y-2 pr-2">
          <div
            v-for="(moment, mIndex) in highlight.moments"
            :key="mIndex"
            v-if="moment.comment"
            class="flex justify-end items-start space-x-2"
          >
            <!-- Spoiler content mới - nhỏ gọn và đẹp hơn -->
            <div class="flex flex-col items-end space-y-1 max-w-full">
              <!-- Nút spoiler nhỏ gọn -->
              <button
                @click="toggleSpoiler(hIndex, mIndex)"
                :class="[
                  'inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 border',
                  isSpoilerVisible(hIndex, mIndex) 
                    ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800' 
                    : 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                ]"
                :title="isSpoilerVisible(hIndex, mIndex) ? 'Ẩn spoiler' : 'Hiện spoiler'"
              >
                <svg v-if="!isSpoilerVisible(hIndex, mIndex)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ isSpoilerVisible(hIndex, mIndex) ? 'Ẩn' : 'Hiện' }}
              </button>
              
              <!-- Spoiler text với hiệu ứng mượt mà -->
              <transition
                enter-active-class="transition-all duration-200 ease-out"
                leave-active-class="transition-all duration-150 ease-in"
                enter-from-class="opacity-0 transform -translate-y-2"
                leave-to-class="opacity-0 transform -translate-y-2"
              >
                <div
                  v-if="moment.comment && isSpoilerVisible(hIndex, mIndex)"
                  class="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300 text-sm px-3 py-2 rounded-lg border border-blue-200 dark:border-gray-600 shadow-sm max-w-full text-right"
                >
                  <div class="font-medium text-blue-800 dark:text-blue-200 mb-1">{{ moment.timestamp }}</div>
                  <div class="italic">{{ moment.comment }}</div>
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
  return highlight.moments && highlight.moments.some(m => m.comment);
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