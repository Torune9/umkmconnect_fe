<template>
    <NavBarMain v-if="user.isLogin"/>
    <NavBarHome v-else  class="bg-white"/>
    <LoadingPage :isLoading="isLoading"/>
    <!-- Lists Store-->
    <section class="flex flex-col items-center w-full h-full">
        <header>
            <h1 class="text-4xl font-black p-4 font-inter text-second">STORE</h1>
        </header>
        <main class="h-full w-full grid lg:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 justify-items-center  p-4 gap-3 ">
            <cardStore :dataStore="[...store.dataAllStore]"/>
        </main>
    </section>
</template>

<script setup>
import NavBarMain from '@/components/navigations/navBarMain.vue';
import cardStore from '@/components/card/cardStore.vue'
import { storeShop } from '@/stores/storeShop';
import { onMounted, ref } from 'vue';
import LoadingPage from '@/components/util/loadingPage.vue';
import NavBarHome from '@/components/navigations/navBarHome.vue';
import { userStore } from '@/stores/userStore';

const store = storeShop()
const user = userStore()

const isLoading = ref(false)


const getAllStore = async ()=>{
    isLoading.value = !isLoading.value
    await store.getAllStore()
    // .catch(error => {
    //     console.log(error.response);
    // })
    .finally(()=>{
        isLoading.value = !isLoading.value
    })
}

onMounted(async()=>{
    await getAllStore()
})
</script>