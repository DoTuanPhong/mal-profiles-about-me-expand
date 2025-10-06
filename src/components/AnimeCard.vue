<template>
  <div class="anime-card bg-white rounded-xl shadow-lg overflow-hidden border-l-4" :style="{ borderLeftColor: anime.color || '#cccccc' }">
    <!-- Header -->
    <div class="header p-6 relative overflow-hidden" :style="{ background: `linear-gradient(135deg, ${anime.color || '#4A5568'}, ${lightenColor(anime.color || '#4A5568')})` }">
      <div class="absolute inset-0 bg-black/10"></div>
      <h2 class="text-2xl font-bold text-white mb-2 relative z-10 shadow-sm">
        {{ anime.title }}
      </h2>
      <a :href="anime.url" target="_blank" class="text-white/90 hover:text-white/100 hover:underline text-sm relative z-10 transition-colors">
        Xem trên MyAnimeList →
      </a>
    </div>
    
    <!-- Highlights: Layout phẳng dọc như hình ảnh, với toggle spoiler cho comments -->
    <div class="highlights p-6 space-y-4">
      <div
        v-for="(highlight, hIndex) in anime.highlights"
        :key="hIndex"
        class="highlight-item space-y-2"
      >
        <!-- Episode/Movie title với play link -->
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold text-gray-800">
            {{ highlight.type === 'episode' ? `Tập ${highlight.number}` : 'Movie' }}
          </span>
          <a v-if="highlight.url" :href="highlight.url" @click.stop target="_blank" class="text-blue-500 hover:text-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </a>
        </div>

        <!-- Moments: List timestamps inline, comments toggle spoiler -->
        <div v-if="highlight.moments.length > 0" class="moments space-y-1 pl-4 border-l-2 border-gray-200">
          <div
            v-for="(moment, mIndex) in highlight.moments"
            :key="mIndex"
            class="moment-item flex items-start space-x-3 py-1"
          >
            <!-- Timestamp badge -->
            <span class="timestamp flex-shrink-0 w-20 font-mono text-xs font-bold text-blue-800 bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-1 rounded-full text-center shadow-sm">
              {{ moment.timestamp }}
            </span>

            <!-- Comment với toggle spoiler -->
            <div class="comment flex-1">
              <div v-if="moment.comment" class="space-y-1">
                <!-- Toggle button -->
                <button
                  @click="toggleSpoiler(hIndex, mIndex)"
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all',
                    showSpoilers[hIndex] && showSpoilers[hIndex][mIndex] ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  ]"
                >
                  <svg v-if="!showSpoilers[hIndex] || !showSpoilers[hIndex][mIndex]" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ showSpoilers[hIndex] && showSpoilers[hIndex][mIndex] ? 'Ẩn spoiler' : 'Xem spoiler' }}
                </button>

                <!-- Spoiler content -->
                <p
                  v-if="showSpoilers[hIndex] && showSpoilers[hIndex][mIndex]"
                  class="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm italic text-gray-700 shadow-inner"
                >
                  {{ moment.comment }}
                </p>
              </div>
              <p v-else class="text-sm text-gray-500 italic">
                Khoảnh khắc đáng nhớ
              </p>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500 italic pl-4">
          Không có khoảnh khắc nổi bật.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

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

// Hàm helper để làm sáng màu cho gradient, thêm kiểm tra đầu vào
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
  max-width: 100%;
}
.anime-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.header {
  /* Fix lỗi class từ code cũ: class.="header" → class="header" */
}
.moments {
  /* Thêm style cho border-left để tạo timeline effect */
}
.highlight-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 1rem;
}
.highlight-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
</style>