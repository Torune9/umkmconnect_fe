<template>
    <div v-if="isUpdateHours" class="fixed w-full h-full flex justify-center items-center bg-black/50 z-50">
        <form @submit.prevent="createHoursOrUpdateOp"
            class="bg-white w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-2xl rounded p-4 mx-4 sm:mx-auto overflow-auto mt-14 h-[90%]">
            <div class="w-full flex flex-row justify-between">
                <h1 class="font-semibold text-lg sm:text-xl">Pengaturan Jam Operasional Toko</h1>
                <button @click="close" type="button" class="text-red-700 text-2xl hover:text-red-500">
                    <font-awesome-icon icon="fa-solid fa-rectangle-xmark" />
                </button>
            </div>
            <div id="operation-date" v-for="(hours, day) in storeHours" :key="day"
                class="flex flex-col sm:flex-row items-center justify-between p-4 mt-4 box-border border rounded-md overflow-x-auto">
                <h3 class="font-semibold text-center sm:text-left w-full sm:w-1/4">{{ day }}</h3>
                <div class="flex flex-col sm:flex-row items-center w-full sm:w-3/4 gap-4">
                    <label class="flex items-center space-x-2 w-full sm:w-1/2">
                        <span class="text-sm">Buka:</span>
                        <input type="time" v-model="hours.open" :disabled="hours.closed"
                            class="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
                    </label>
                    <label class="flex items-center space-x-2 w-full sm:w-1/2">
                        <span class="text-sm">Tutup:</span>
                        <input type="time" v-model="hours.close" :disabled="hours.closed"
                            class="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
                    </label>
                    <label class="flex items-center space-x-2 w-full sm:w-auto">
                        <input type="checkbox" v-model="hours.closed"
                            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span class="text-sm">Toko Tutup</span>
                    </label>
                </div>
            </div>
            <div class="w-full text-right mt-2">
                <button class="bg-green-700 p-2 rounded w-32 hover:bg-green-500 text-white font-semibold">
                    <p v-if="!loading">Submit</p>
                    <p v-else class="animate-spin"><font-awesome-icon icon="fa-solid fa-spinner" /></p>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { storeShop } from '@/stores/storeShop';
import { userStore } from '@/stores/userStore';
import { ref, watchEffect} from 'vue'

const store = storeShop()
const user = userStore()

const loading = ref(false)

 defineProps({
    isUpdateHours: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['close'])

const storeHours = ref({
    Monday: { open: '07:00', close: '18:00', closed: false },
    Tuesday: { open: '07:00', close: '18:00', closed: false },
    Wednesday: { open: '07:00', close: '18:00', closed: false },
    Thursday: { open: '07:00', close: '18:00', closed: false },
    Friday: { open: '07:00', close: '18:00', closed: false },
    Saturday: { open: '10:00', close: '14:00', closed: false },
    Sunday: { open: 'Closed', close: 'Closed', closed: true },
})

const close = () => {
    emits('close', false)
}

const createHoursOrUpdateOp = async () => {
    loading.value = !loading.value

    await store.updateHours({
        storeHours: storeHours.value,
        storeId: store.dataStore.id ? store.dataStore.id : user.dataStoreEmployee.id
    })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            loading.value = !loading.value
            close()
        })
}

watchEffect(() => {
    if (store.currentHours.length > 0) {
        store.currentHours.forEach(hour => {
            storeHours.value[hour.day_of_week].open = hour.open_time || storeHours.value[hour.day_of_week].open;
            storeHours.value[hour.day_of_week].close = hour.closed_time || storeHours.value[hour.day_of_week].close;
            storeHours.value[hour.day_of_week].closed = hour.is_closed;
        });
    }
});


</script>

<style scoped>
::-webkit-scrollbar {
    height: 8px;
    width: 4px;
}

::-webkit-scrollbar-thumb {
    background-color: #5d5d5d;
}
</style>
