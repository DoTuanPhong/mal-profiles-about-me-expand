<template>
  <!-- THAY ĐỔI: Thêm class dark:bg-gray-800 -->
  <div class="anime-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-l-4 max-w-2xl mx-auto transition-all duration-300" :style="{ borderLeftColor: anime.color || '#cccccc' }">
    <!-- Header: Tên tác phẩm cấp độ 1, căn giữa, font lớn, ngoặc góc, clickable toàn bộ -->
    <div class="header p-6 text-center relative overflow-hidden" :style="{ background: `linear-gradient(135deg, ${anime.color || '#4A5568'}, ${lightenColor(anime.color || '#4A5568')})` }">
      <div class="absolute inset-0 bg-black/10"></div>
      <a :href="anime.url" target="_blank" class="block relative z-10 transition-colors hover:text-white/100">
        <h2 class="text-3xl font-bold text-white mb-4 shadow-sm">
          「{{ anime.title }}」
        </h2>
      </a>
    </div>
    
    <!-- Highlights: Layout dọc căn giữa cho cấp độ 2, spoilers cấp độ 3 căn phải -->
    <!-- THAY ĐỔI: Thêm class dark:border-gray-700 cho viền của highlight-item -->
    <div class="highlights p-6 space-y-4">
      <div
        v-for="(highlight, hIndex) in anime.highlights"
        :key="hIndex"
        class="highlight-item space-y-2 border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0"
      >
        <!-- Cấp độ 2: Dòng episode/movie với timestamps, căn giữa, episode clickable -->
        <div class="text-center space-y-1">
          <!-- Episode hoặc Movie title, clickable toàn bộ -->
          <div class="flex items-center justify-center space-x-2">
            <a
              v-if="highlight.url"
              :href="highlight.url"
              target="_blank"
              <!-- THAY ĐỔI: Thêm class dark:text-blue-400, dark:hover:text-blue-300 -->
              class="text-blue-500 dark:text-blue-400 font-semibold text-lg hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {{ highlight.type === 'episode' ? `episode ${highlight.number}` : 'Movie' }}
            </a>
            <!-- THAY ĐỔI: Thêm class dark:text-blue-400 -->
            <span v-else class="text-blue-500 dark:text-blue-400 font-semibold text-lg">
              {{ highlight.type === 'episode' ? `episode ${highlight.number}` : 'Movie' }}
            </span>
          </div>

          <!-- Timestamps với ～ và ⁘, nếu có moments -->
          <div v-if="highlight.moments.length > 0" class="flex items-center justify-center space-x-1">
            <!-- Dấu ～ màu đỏ -->
            <!-- THAY ĐỔI: Thêm class dark:text-red-400 -->
            <span class="text-red-500 dark:text-red-400 text-lg font-bold">～</span>
            <!-- Các timestamps xanh lá, phân cách ⁘ -->
            <span
              v-for="(moment, mIndex) in highlight.moments"
              :key="mIndex"
              <!-- THAY ĐỔI: Thêm class dark:text-green-400 -->
              class="text-green-500 dark:text-green-400 font-mono text-lg"
            >
              {{ moment.timestamp }}
              <!-- THAY ĐỔI: Thêm class dark:text-green-400 -->
              <span v-if="mIndex < highlight.moments.length - 1" class="text-green-500 dark:text-green-400">⁘</span>
            </span>
          </div>
          <!-- THAY ĐỔI: Thêm class dark:text-gray-400 -->
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
                  // Trạng thái hiện
                  showSpoilers[hIndex] && showSpoilers[hIndex][mIndex] 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800' 
                    // Trạng thái ẩn
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
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
                class="inline-block bg-blue-50 text-blue-600 text-sm italic px-3 py-2 rounded-lg shadow-sm border border-blue-200 text-right dark:bg-gray-700 dark:text-blue-300 dark:border-blue-600"
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