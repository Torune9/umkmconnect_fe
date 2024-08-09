<template>
    <SideBar class="fixed h-full w-full max-md:z-50 md:hidden" @click="sideBar(false)" v-if="dataSide" />
    <NavBarMain v-if="user.isLogin" @showSidebar="sideBar" />
    <NavBarHome v-else class="bg-white sticky top-0 z-50" />
    <LoadingPage :isLoading="isLoading" />
    <Transition name="sidebar">
    </Transition>
    <!-- Lists Store-->
    <section class="flex flex-col items-center w-full h-full">
        <header>
            <h1 class="text-4xl font-black p-4 font-inter text-second">STORE</h1>
        </header>
        <main
            class="h-full w-full grid lg:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 justify-items-center  p-4 gap-3 "
            v-if="Object.entries(store.dataAllStore).length !== 0">
            <cardStore :dataStore="[...store.dataAllStore]" />
        </main>
        <div v-else class="flex justify-center items-center h-screen w-full bg-black/20">
            <h1 class="font-semibold text-3xl text-slate-400 text-center">
                STORES NOT FOUND
            </h1>
        </div>
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
import SideBar from '@/components/navigations/sideBar.vue';

const store = storeShop()
const user = userStore()

const isLoading = ref(false)
const dataSide  = ref(false)


const getAllStore = async () => {
    isLoading.value = !isLoading.value
    await store.getAllStore()
        // .catch(error => {
        //     console.log(error.response);
        // })
        .finally(() => {
            isLoading.value = !isLoading.value
        })
}


const sideBar = (data) => {
    dataSide.value = data
    console.log(data);
}

onMounted(async () => {
    await getAllStore()
})
</script>