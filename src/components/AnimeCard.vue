<template>
  <div class="anime-card bg-white rounded-xl shadow-lg overflow-hidden border-l-4 max-w-2xl mx-auto" :style="{ borderLeftColor: anime.color || '#cccccc' }">
    <!-- Header: Tên tác phẩm cấp độ 1, căn giữa, font lớn, ngoặc góc -->
    <div class="header p-6 text-center relative overflow-hidden" :style="{ background: `linear-gradient(135deg, ${anime.color || '#4A5568'}, ${lightenColor(anime.color || '#4A5568')})` }">
      <div class="absolute inset-0 bg-black/10"></div>
      <h2 class="text-3xl font-bold text-white mb-4 relative z-10 shadow-sm">
        「{{ anime.title }}」
      </h2>
      <a :href="anime.url" target="_blank" class="text-white/90 hover:text-white/100 hover:underline text-sm relative z-10 transition-colors">
        Xem trên MyAnimeList →
      </a>
    </div>
    
    <!-- Highlights: Layout dọc căn giữa cho cấp độ 2, spoilers cấp độ 3 căn phải -->
    <div class="highlights p-6 space-y-4">
      <div
        v-for="(highlight, hIndex) in anime.highlights"
        :key="hIndex"
        class="highlight-item space-y-2"
      >
        <!-- Cấp độ 2: Dòng episode/movie với timestamps, căn giữa -->
        <div class="text-center space-y-1">
          <!-- Episode hoặc Movie title -->
          <div class="flex items-center justify-center space-x-2">
            <span v-if="highlight.type === 'episode'" class="text-blue-500 font-semibold text-lg">
              episode {{ highlight.number }}
            </span>
            <span v-else class="text-blue-500 font-semibold text-lg">
              {{ highlight.title || 'Movie' }}
            </span>
            <!-- Play link nếu có -->
            <a v-if="highlight.url" :href="highlight.url" @click.stop target="_blank" class="text-blue-500 hover:text-blue-700 transition-colors ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
          </div>

          <!-- Timestamps với ～ và ⁘, nếu có moments -->
          <div v-if="highlight.moments.length > 0" class="flex items-center justify-center space-x-1">
            <!-- Dấu ～ màu đỏ -->
            <span class="text-red-500 text-lg font-bold">～</span>
            <!-- Các timestamps xanh lá, phân cách ⁘ -->
            <span
              v-for="(moment, mIndex) in highlight.moments"
              :key="mIndex"
              class="text-green-500 font-mono text-lg"
            >
              {{ moment.timestamp }}
              <span v-if="mIndex < highlight.moments.length - 1" class="text-green-500">⁘</span>
            </span>
          </div>
          <div v-else class="text-gray-500 italic text-sm">
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
                  showSpoilers[hIndex] && showSpoilers[hIndex][mIndex] ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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
              <p
                v-if="showSpoilers[hIndex] && showSpoilers[hIndex][mIndex]"
                class="inline-block bg-blue-50 text-blue-600 text-sm italic px-3 py-2 rounded-lg shadow-sm border border-blue-200 text-right"
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
.anime-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.anime-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.header {
  /* Đảm bảo text-center hoạt động */
}
.highlight-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 1.5rem;
}
.highlight-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
</style>