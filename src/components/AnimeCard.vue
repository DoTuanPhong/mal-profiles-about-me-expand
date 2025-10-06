<template>
  <div class="anime-card bg-white rounded-xl shadow-lg overflow-hidden border-l-4" :style="{ borderLeftColor: anime.color }">
    <!-- Header -->
    <div class="header p-6" :style="{ background: `linear-gradient(135deg, ${anime.color}, ${lightenColor(anime.color)})` }">
      <h2 class="text-2xl font-bold text-white mb-2">
        {{ anime.title }}
      </h2>
      <a :href="anime.url" target="_blank" class="text-white/80 hover:underline text-sm">
        Xem trên MyAnimeList →
      </a>
    </div>
    
    <!-- Highlights Accordion -->
    <div class="highlights p-4">
      <v-expansion-panels v-if="useVuetify" v-model="activePanels">
        <v-expansion-panel v-for="(highlight, hIndex) in anime.highlights" :key="hIndex">
          <v-expansion-panel-header>
            <template v-slot:default="{ open }">
              <div class="flex items-center w-full">
                <span class="text-lg font-semibold mr-2">
                  {{ highlight.type === 'episode' ? `Tập ${highlight.number}` : 'Movie' }}
                </span>
                <a :href="highlight.url" target="_blank" class="ml-auto text-blue-500 hover:text-blue-700">
                  <i class="fas fa-play-circle"></i>
                </a>
              </div>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="moments-timeline">
              <div
                v-for="(moment, mIndex) in highlight.moments"
                :key="mIndex"
                class="moment-item flex items-center py-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 rounded-lg px-3"
              >
                <div class="timestamp w-16 font-mono text-sm text-gray-600">
                  {{ moment.timestamp }}
                </div>
                <div class="comment flex-1 ml-4">
                  <p v-if="moment.comment" class="text-sm italic text-gray-700">{{ moment.comment }}</p>
                  <p v-else class="text-sm text-gray-500">Khoảnh khắc nổi bật</p>
                </div>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Fallback nếu không dùng Vuetify: Sử dụng details/summary cho collapsible -->
      <details v-else v-for="(highlight, hIndex) in anime.highlights" :key="hIndex" class="mb-4 border rounded-lg">
        <summary class="p-4 font-semibold cursor-pointer hover:bg-gray-50">
          {{ highlight.type === 'episode' ? `Tập ${highlight.number}` : 'Movie' }}
          <a :href="highlight.url" target="_blank" class="float-right text-blue-500">
            <i class="fas fa-play-circle ml-2"></i>
          </a>
        </summary>
        <div class="p-4">
          <div class="moments-timeline space-y-2">
            <div
              v-for="(moment, mIndex) in highlight.moments"
              :key="mIndex"
              class="moment-item flex items-center py-2 hover:bg-blue-50 rounded px-3 transition-colors"
            >
              <span class="timestamp w-16 font-mono text-sm bg-blue-100 px-2 py-1 rounded-full">{{ moment.timestamp }}</span>
              <span class="comment ml-4 flex-1 text-sm" :class="{ 'italic text-gray-700': moment.comment }">
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
import { computed } from 'vue'

const props = defineProps({
  anime: {
    type: Object,
    required: true
  }
})

const activePanels = ref([])

// Hàm helper để làm sáng màu cho gradient
function lightenColor(hex) {
  const match = hex.match(/\w{1,6}/)[0]
  const [r, g, b] = [1, 3, 5].map(i => parseInt(match.substr(i * 2, 2), 16))
  return `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`
}
</script>

<style scoped>
.moments-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.anime-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.anime-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>