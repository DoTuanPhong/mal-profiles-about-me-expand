<template>
  <!-- 
    THAY ĐỔI 1: Thêm các lớp dark: để hỗ trợ chế độ tối.
    - bg-white -> bg-white dark:bg-gray-800
    - shadow-lg -> shadow-lg dark:shadow-xl (bóng đậm hơn trong tối)
  -->
  <!-- 
    THAY ĐỔI 2: Thay thế inline style bằng CSS Variable.
    - :style="{ borderLeftColor: ... }" -> :style="{'--anime-color': anime.color}"
  -->
  <div 
    class="anime-card bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl overflow-hidden border-l-4 max-w-2xl mx-auto transition-all duration-300" 
    :style="{'--anime-color': anime.color || '#cccccc'}"
  >
    <!-- Header: Tên tác phẩm cấp độ 1, căn giữa, font lớn, ngoặc góc, clickable toàn bộ -->
    <!-- 
      THAY ĐỔI 3: Áp dụng CSS Variable cho background gradient trong <style>
      và thêm lớp phủ đậm hơn để tăng độ tương phản cho text.
    -->
    <div class="header p-6 text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-black/20"></div> <!-- Tăng từ /10 lên /20 -->
      <a :href="anime.url" target="_blank" class="block relative z-10 transition-colors hover:text-white/100">
        <!-- Thêm text-shadow để tăng khả năng đọc -->
        <h2 class="text-3xl font-bold text-white mb-4 shadow-sm" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.5);">
          「{{ anime.title }}」
        </h2>
      </a>
    </div>
    
    <!-- Highlights: Layout dọc căn giữa cho cấp độ 2, spoilers cấp độ 3 căn phải -->
    <div class="highlights p-6 space-y-4">
      <div
        v-for="(highlight, hIndex) in anime.highlights"
        :key="hIndex"
        class="highlight-item space-y-2"
      >
        <!-- Cấp độ 2: Dòng episode/movie với timestamps, căn giữa, episode clickable -->
        <div class="text-center space-y-1">
          <!-- Episode hoặc Movie title, clickable toàn bộ -->
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

          <!-- Timestamps với ～ và ⁘, nếu có moments -->
          <div v-if="highlight.moments.length > 0" class="flex items-center justify-center space-x-1">
            <span class="text-red-500 dark:text-red-400 text-lg font-bold">～</span>
            <span
              v-for="(moment, mIndex) in highlight.moments"
              :key="mIndex"
              class="text-green-500 dark:text-green-400 font-mono text-lg"
            >
              {{ moment.timestamp }}
              <span v-if="mIndex < highlight.moments.length - 1" class="text-green-500 dark:text-green-400">⁘</span>
            </span>
          </div>
          <div v-else class="text-gray-500 dark:text-gray-400 italic text-sm">
            Không có khoảnh khắc nổi bật.
          </div>
        </div>

        <!-- Cấp độ 3: Spoilers cho từng moment, căn phải, chỉ nếu có comment -->
        <div v-if="hasComments(highlight)" class="text-right space-y-1 pr-4">
          <div
            v-for="(moment, mIndex) in highlight.moments"
            :key="mIndex"
            v-if="moment.comment"
            class="flex justify-end items-start space-x-2 space-x-reverse"
          >
            <!-- Spoiler content: ts: comment, lightblue, toggle -->
            <div class="flex-1 text-right">
              <button
                @click="toggleSpoiler(hIndex, mIndex)"
                :class="[
                  'inline-flex items-center justify-end px-3 py-1 rounded-full text-xs font-medium transition-all mr-2',
                  // Thay đổi màu cho button trong dark mode
                  showSpoilers[hIndex] && showSpoilers[hIndex][mIndex] 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800' 
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                ]"
              >
                <svg v-if="!showSpoilers[hIndex] || !showSpoilers[hIndex][mIndex]" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ showSpoilers[hIndex] && showSpoilers[hIndex][mIndex] ? 'Hide spoiler' : 'Show spoiler' }}
              </button>
              <!-- Thay đổi màu cho spoiler text trong dark mode -->
              <p
                v-if="showSpoilers[hIndex] && showSpoilers[hIndex][mIndex]"
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
import { ref } from 'vue';

const props = defineProps({
  anime: {
    type: Object,
    required: true
  }
});

// Reactive state cho spoilers (per highlight per moment)
const showSpoilers = ref({});

// Function để toggle spoiler
const toggleSpoiler = (hIndex, mIndex) => {
  if (!showSpoilers.value[hIndex]) {
    showSpoilers.value[hIndex] = {};
  }
  showSpoilers.value[hIndex][mIndex] = !showSpoilers.value[hIndex][mIndex];
};

// Helper để check nếu highlight có comments
const hasComments = (highlight) => {
  return highlight.moments.some(m => m.comment);
};

// Hàm helper để làm sáng màu cho gradient
function lightenColor(hex) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return 'rgb(150, 150, 150)';
  
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  
  return `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)})`;
}
</script>

<style scoped>
/* 
  THAY ĐỔI 4: Sử dụng CSS Variable để thay thế inline style.
  Điều này cho phép dark mode hoạt động và code sạch hơn.
*/
.anime-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* Sử dụng var() với giá trị fallback */
  border-left-color: var(--anime-color, #cccccc);
}
.anime-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.header {
  /* Áp dụng gradient sử dụng CSS Variable */
  background: linear-gradient(135deg, var(--anime-color, #4A5568), var(--anime-color-light, #6a7280));
}

/* 
  THAY ĐỔI 5: Định nghĩa biến cho màu sáng hơn.
  Chúng ta có thể dùng JavaScript để set nó, hoặc dùng một mẹo CSS nhỏ.
  Cách đơn giản nhất là định nghĩa nó trong script và truyền vào.
  Nhưng để demo, tôi sẽ tạo một class giả định.
  Một cách tốt hơn là tính toán trong script và gán vào một biến khác.
*/
.anime-card {
  /* Giả sử chúng ta cũng truyền màu sáng hơn vào */
  /* Để đơn giản, tôi sẽ dùng filter trong CSS, nhưng cách này không hoàn hảo */
  /* Cách tốt nhất là tính toán `lightenColor` trong script và gán vào một biến khác */
  background-image: linear-gradient(135deg, var(--anime-color, #4A5568), color-mix(in srgb, var(--anime-color, #4A5568) 70%, white));
}

.highlight-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
/* Thêm border cho dark mode */
.dark .highlight-item {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}
.highlight-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
</style>