<template>
  <div v-for="(store, i) in dataStore" class="w-full h-full rounded overflow-hidden flex flex-col font-poppins shadow-md"
    :key="i">
    <div class="w-full h-72 overflow-hidden">
      <CorouselImage :images="imageProduct(store.products)" />
    </div>
    <div class="flex flex-col gap-y-2 p-2">
      <router-link :to="`${url}${store.code}`">
        <h1
          class="font-black text-lg  duration-300 transition-colors rounded text-center cursor-pointer text-slate-800 hover:text-green-8 border-b hover:bg-slate-50">
          {{ store.name.toUpperCase() }}
        </h1>
      </router-link>
      <router-link :to="`${url}${store.code}`">
        <div class="flex flex-row h-full  gap-2 overflow-hidden ">
          <!-- image store -->
          <div class="h-20 w-24 rounded-md overflow-hidden flex justify-center items-center shadow-md border border-slate-400 hover:scale-75 transition-transform duration-200  ">
            <img v-if="store.img"  :src="`${URL}source/image/${store.img}`" alt="" class="h-full w-full object-cover">
            <div v-else class="w-full h-full bg-slate-100 flex justify-center items-center text-4xl text-black/50">
              <font-awesome-icon icon="fa-solid fa-store" />
            </div>
          </div>

          <div class="w-full h-20  cursor-pointer hover:underline text-[12px] text-zinc-100 text-justify rounded-md p-2 flex items-center bg-slate-950 ">
            {{ store.description.length > 130 ? `${store.description.slice(0, 120)}...` : store.description }}
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import CorouselImage from './corouselImage.vue';

const URL = import.meta.env.VITE_APP_BASE_URL;

const props = defineProps({
  dataStore: {
    type: Array,
    default: () => []
  }
});


const imageProduct = (products) => {
  return products.map(product => ({
    src: `${URL}source/image/${product.img}`,
    alt: product.name || 'Product Image'
  }));
}

const url = '/store/profile/detail/';

watch(() => props.dataStore, () => {
  console.log(props.dataStore);
});
</script>