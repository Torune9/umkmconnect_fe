<template>
  <div class="relative w-full h-full overflow-hidden">
    <div v-if="images.length > 0" class="flex transition-transform duration-500" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(image, index) in images" :key="index" class="min-w-full h-full">
        <img v-if="image.src && !image.src.includes('null')" :src="image.src" :alt="image.alt" class="w-full h-full object-cover">
        <div v-else class="flex justify-center items-center bg-slate-950/60 text-white h-72 text-7xl">
          <font-awesome-icon icon="fa-solid fa-image" size="2xl" />
        </div>
      </div>
    </div>
    <div v-else class="w-full h-full flex justify-center items-center bg-slate-100 text-7xl text-black/50">
      <font-awesome-icon icon="fa-solid fa-image" size="2xl" />
    </div>
    <button v-if="images.length > 0" @click="prev" class="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 cursor-pointer hover:bg-slate-600 ">‹</button>
    <button v-if="images.length > 0" @click="next" class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 cursor-pointer hover:bg-slate-600 ">›</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  images: {
    type: Array,
    required: true
  }
})

const currentIndex = ref(0)

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

let interval

onMounted(() => {
  interval = setInterval(next, 2000)  // Ganti slide setiap 2 detik
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

