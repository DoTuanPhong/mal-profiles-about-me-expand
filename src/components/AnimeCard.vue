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

        <!-- Cấp độ 3: Spoilers - ĐÃ SỬA -->
        <div v-if="hasVisibleComments(highlight)" class="text-right space-y-1 pr-4">
          <div
            v-for="(moment, mIndex) in highlight.moments"
            :key="mIndex"
            class="flex justify-end items-start space-x-2 space-x-reverse"
          >
            <!-- Spoiler content -->
            <div class="flex-1 text-right">
              <button
                @click="toggleSpoiler(hIndex, mIndex)"
                :class="[
                  'inline-flex items-center justify-end px-3 py-1 rounded-full text-xs font-medium transition-all mr-2',
                  isSpoilerVisible(hIndex, mIndex) 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800' 
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                ]"
              >
                <svg v-if="!isSpoilerVisible(hIndex, mIndex)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ isSpoilerVisible(hIndex, mIndex) ? 'Hide spoiler' : 'Show spoiler' }}
              </button>
              <!-- Spoiler text -->
              <p
                v-if="moment.comment && isSpoilerVisible(hIndex, mIndex)"
                class="inline-block bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 text-sm italic px-3 py-2 rounded-lg shadow-sm border border-blue-200 dark:border-gray-600 text-right"
              >
                {{ moment.timestamp }}: {{ moment.comment }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  anime: {
    type: Object,
    required: true
  }
});

// Sửa state management
const showSpoilers = ref({});

// Helper function để kiểm tra spoiler visibility
const isSpoilerVisible = (hIndex, mIndex) => {
  return !!(showSpoilers.value[hIndex] && showSpoilers.value[hIndex][mIndex]);
};

// Function để toggle spoiler - ĐÃ SỬA
const toggleSpoiler = (hIndex, mIndex) => {
  // Đảm bảo highlight index tồn tại
  if (!showSpoilers.value[hIndex]) {
    showSpoilers.value[hIndex] = {};
  }
  
  // Toggle trạng thái
  showSpoilers.value[hIndex][mIndex] = !showSpoilers.value[hIndex][mIndex];
  
  // Force reactivity nếu cần
  showSpoilers.value = {...showSpoilers.value};
};

// Helper để check nếu highlight có comments VÀ có ít nhất một comment đang hiển thị hoặc có thể hiển thị
const hasVisibleComments = (highlight) => {
  return highlight.moments && 
         highlight.moments.some(m => m.comment);
};

// Debug: log data để kiểm tra
console.log('Anime data:', props.anime);
if (props.anime.highlights) {
  props.anime.highlights.forEach((highlight, hIndex) => {
    console.log(`Highlight ${hIndex}:`, highlight);
    if (highlight.moments) {
      highlight.moments.forEach((moment, mIndex) => {
        console.log(`  Moment ${mIndex}:`, moment);
      });
    }
  });
}
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
</style>