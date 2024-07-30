<template>
    <NavBarMain />
    <LoadingPage :isLoading="isLoading"/>
    <section class="w-full h-full flex flex-col items-center font-poppins gap-1 p-4 ">
        <!-- profile -->
        <div class="h-80 max-sm:h-64 w-full overflow-hidden flex flex-col gap-1 rounded-md">
            
            <div class="w-full flex flex-col justify-center items-center">
                <h4 class="w-full text-center text-6xl font-bold text-white bg-gradient-to-r from-indigo-900 to-main p-5 max-sm:text-2xl ">
                    {{ store.dataAllStore[0].name }}
                </h4>
            </div>

            <div class="w-full h-full rounded-md overflow-hidden ">
                <div class="w-full h-full flex justify-center items-center overflow-hidden relative">
                    <img class="h-full w-full object-cover" :src="`${URL}source/image/${store.dataAllStore[0].img}`" alt="">
                    <p class="absolute text-white  w-full h-full bg-main/30 backdrop-blur-sm text-center p-10 overflow-auto" >
                        {{ store.dataAllStore[0].description }} Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae, animi!
                    </p>
                </div>
            </div>

        </div>
        <!-- list product -->
        <div  v-if="store.dataAllStore[0].products !== undefined && Object.entries(store.dataAllStore[0].products).length !== 0"  class="w-full h-full pl-28 pr-28 p-2 flex flex-wrap gap-2 bg-gradient-to-b from-indigo-900 to-black rounded-t-md ">
            <div class="w-full h-full flex flex-wrap gap-2 justify-center items-center">
                <div class="border-2 border-dashed  w-60 h-90 overflow-hidden rounded relative bg-black/50 backdrop-blur-md text-white "
                    v-for="product, i of store.dataAllStore[0].products" :key="i">
                    <div class="h-40 overflow-hidden flex justify-center items-center ">
                        <picture>
                            <img :src="`${URL}source/image/${product.img}`" alt="">
                        </picture>
                    </div>
                    <!-- products information -->
                    <div class="p-2 text-sm w-full flex flex-col gap-y-3">
                        <div class="flex flex-row h-10 w-full items-center">
                            <h3 class="font-bold w-full">{{ product.name }}</h3>
                            <h4 class="font-semibold overflow-auto w-full">
                                {{ formatterRupiah.formatPriceToIDR(product.price) }}
                            </h4>
                        </div>
                        <p class="text-[12px] text-justify">
                            {{ product.description }}
                        </p>
                        <button
                            class=" bg-green-700 w-40 h-8 rounded text-white hover:bg-green-500 transition-colors duration-300">
                            order
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="w-full h-full text-center">
            <h1 class="text-3xl text-black/50 font-bold max-sm:text-lg ">This shop doesn't have any products yet</h1>
        </div>

    </section>
</template>

<script setup>
import NavBarMain from '@/components/navigations/navBarMain.vue';
import { storeShop } from '@/stores/storeShop';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import formatterRupiah from '@/service/utils/formatterRupiah';
import LoadingPage from '@/components/util/loadingPage.vue';

const store = storeShop()
const route = useRoute()
const URL = import.meta.env.VITE_APP_BASE_URL;

const isLoading = ref(false)

const getDetailStore = async () => {
    isLoading.value = !isLoading.value
    await store.getAllStore(route.params.code)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error.response);
        })
        .finally(() => {
            isLoading.value = !isLoading.value
        })
}

onMounted(async () => {
    await getDetailStore()
})
</script>
