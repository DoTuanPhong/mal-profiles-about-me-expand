<template>
  <!-- Bỏ phần v-if/v-else không cần thiết nếu bạn chỉ dùng 1 layout -->
  <div class="anime-card bg-white rounded-xl shadow-lg overflow-hidden border-l-4" :style="{ borderLeftColor: anime.color || '#cccccc' }">
    <!-- Header -->
    <div class.="header p-6" :style="{ background: `linear-gradient(135deg, ${anime.color || '#4A5568'}, ${lightenColor(anime.color || '#4A5568')})` }">
      <h2 class="text-2xl font-bold text-white mb-2 shadow-sm">
        {{ anime.title }}
      </h2>
      <a :href="anime.url" target="_blank" class="text-white/80 hover:underline text-sm">
        Xem trên MyAnimeList →
      </a>
    </div>
    
    <!-- Highlights: Chỉ giữ lại layout details/summary vì nó không phụ thuộc thư viện ngoài -->
    <div class="highlights p-4">
      <details v-for="(highlight, hIndex) in anime.highlights" :key="hIndex" class="mb-2 border rounded-lg overflow-hidden last:mb-0">
        <summary class="flex items-center justify-between p-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors">
          <span>{{ highlight.type === 'episode' ? `Tập ${highlight.number}` : 'Movie' }}</span>
          <a :href="highlight.url" @click.stop target="_blank" class="text-blue-500 hover:text-blue-700 text-lg">
            <!-- Thay bằng icon SVG hoặc component icon để không phụ thuộc FontAwesome -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </a>
        </summary>
        <div class="bg-gray-50 p-4 border-t">
          <div class="moments-timeline space-y-2">
            <div
              v-for="(moment, mIndex) in highlight.moments"
              :key="mIndex"
              class="moment-item flex items-start py-2"
            >
              <span class="timestamp w-20 font-mono text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded-full text-center">{{ moment.timestamp }}</span>
              <span class="comment ml-4 flex-1 text-sm pt-1" :class="{ 'italic text-gray-700': moment.comment, 'text-gray-500': !moment.comment }">
                {{ moment.comment || 'Khoảnh khắc đáng nhớ' }}
              </span>
            </div>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
// ✅ SỬA: Import 'ref'
import { ref } from 'vue';

const props = defineProps({
  anime: {
    type: Object,
    required: true
  }
});

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
/* Giữ nguyên style của bạn vì nó đã rất tốt */
.anime-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.anime-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
details[open] > summary {
  background-color: #f0f4f8;
}
</style>