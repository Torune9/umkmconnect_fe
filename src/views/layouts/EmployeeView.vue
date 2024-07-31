<template>
    <MainLayout>
        <LoadingPage :is-loading="isLoading" />
        <template v-slot:body>
            <section class="p-8 mt-10 flex flex-col gap-y-2 font-poppins ">
                <h1 class="text-2xl  font-bold text-center border-b p-1">List Employee</h1>
                <div class="flex flex-wrap gap-x-2 justify-center gap-y-2 max-sm:p-4">
                    <div v-for="employee,i of employees "  class="rounded overflow-hidden shadow-md w-64 h-fit max-sm:w-full  relative" :key="i">
                        <picture>
                            <div class="border h-56 w-full overflow-hidden flex items-center">
                                <img v-if="employee.profile" :src="`${URL}source/profile/${employee.profile}`" alt="profile image" class="h-full w-full object-cover" >
                                <div v-else class="bg-slate-300 h-full w-full flex justify-center items-center" >
                                    <div class="w-40 h-40 bg-slate-400 border flex justify-center items-center rounded-full text-7xl text-slate-500">
                                        <font-awesome-icon icon="fa-solid fa-user"/>
                                    </div>
                                </div>
                            </div>
                        </picture>
                        <div class=" p-2 sm:p-4 text-[12px] flex flex-col gap-y-2 text-blue-900 font-semibold ">
                            <h1 class="font-bold bg-blue-600 p-1 rounded text-zinc-100 text-center">Member</h1>
                            <h1>Name : {{ employee.username }}</h1>
                            <h1>Email : {{ employee.email }}</h1>
                        </div>
                    </div>
                </div>
            </section>
        </template>
    </MainLayout>
</template>

<script setup>
import LoadingPage from '@/components/util/loadingPage.vue';
import MainLayout from '@/layout/mainLayout.vue';
import { storeShop } from '@/stores/storeShop';
import { userStore } from '@/stores/userStore';
import { onMounted, ref } from 'vue';

const store = storeShop()

const URL = import.meta.env.VITE_APP_BASE_URL

const isLoading = ref(false)
const employees = ref([])

const getEmployee = async () => {
    isLoading.value = !isLoading.value
    return await store.getEmployee(store.dataStore?.id ? store.dataStore.id : userStore().dataStoreEmployee.id)
        .then(response => {
            employees.value = [...response.data]
        })
        // .catch(error => {
        //     console.log(error);
        // })
        .finally(() => {
            isLoading.value = !isLoading.value
        })
}

onMounted(async ()=>{
    await getEmployee()
})
</script>