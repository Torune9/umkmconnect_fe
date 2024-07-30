<template>
    <MainLayout>
        <template v-slot:body>
            <section class="p-8 mt-10 relative font-poppins">
                <recapModal :is-recap="isRecap" :is-invent="isInvent" @close="closeModalRecap" @sendInfo="acceptInfo"/>
                <div class="flex flex-col gap-y-2">
                    <h1 class="w-full text-center text-xl font-poppins font-bold border-b sm:text-2xl">Inventories</h1>
                    <button type="button" @click="showModalRecap"
                        class="bg-indigo-600 p-2 font-poppins text-sm rounded font-bold w-28 text-white hover:bg-indigo-500 transition-all duration-300">
                        Create
                    </button>
                    <div class="flex flex-col gap-4">
                        <div v-if="info.message" class="flex justify-center">
                            <h1 class="p-[10px] border rounded w-64 text-center relative" :class="[
                                info.type == 'success' ? 'bg-green-200 text-green-800 border-green-900' : 'bg-red-300 text-red-800 border-red-900'
                            ]">
                                <small>{{ info.message }}</small>
                                <button @click="info.message=''" type="button" class="absolute -right-1 -top-2 text-red-950">
                                    <font-awesome-icon icon="fa-solid fa-circle-xmark"/>
                                </button>
                            </h1>
                        </div>
                        <EasyDataTable :headers="headers" :items="items" :loading="isLoading" :rows-per-page="10"
                            :rows-items="[5, 10]" table-class-name="customize-table" alternating>
                            <template #item-price="{ price }">
                                {{ formatterRupiah.formatPriceToIDR(price) ?? 0 }}
                            </template>
                            <template #item-information="{ information }">
                                {{ information ? information
                                    : 'information not available' }}
                            </template>
                        </EasyDataTable>
                    </div>
                </div>
            </section>
        </template>
    </MainLayout>
</template>

<script setup>
import MainLayout from '@/layout/mainLayout.vue';
import recapModal from '@/components/modal/recapModal.vue'
import { computed, onMounted, ref, reactive} from 'vue';
import { inventStore } from '@/stores/inventoryStore';
import { storeShop } from '@/stores/storeShop';
import formatterRupiah from '@/service/utils/formatterRupiah';

const invent = inventStore()
const store = storeShop()

const headers = [
    {
        text: 'Name',
        value: 'name'
    },
    {
        text: 'Stock',
        value: 'stock'
    },
    {
        text: 'Price',
        value: 'price'
    },
    {
        text: 'Information',
        value: 'information'
    }
]
const items = computed(() => invent.getDataInventories)

const isRecap = ref(false),
    isInvent = ref(false),
    isLoading = ref(false)

const showModalRecap = () => {
    isRecap.value = !isRecap.value
    isInvent.value = !isInvent.value
}
const closeModalRecap = async (data) => {
    isRecap.value = data
    isInvent.value = data
    await getInventories()
}

const info = reactive({
    message: '',
    type: ''
})

const acceptInfo = ({ message, type }) => {
    return info.message = message, info.type = type
}

const getInventories = async () => {
    isLoading.value = !isLoading.value
    await invent.getInventories(store.dataStore.id)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            isLoading.value = !isLoading.value
        })
}

onMounted(async () => {
    if (store.dataStore.id) {
        
        await getInventories()
    }
})

</script>

<style scoped>
.customize-table {
    --easy-table-header-font-size: 16px;
    --easy-table-body-row-font-size: 14px;
    --easy-table-header-background-color: #3f0950;
    --easy-table-header-font-color: #ffffffec;
    --easy-table-body-row-height: 48px;

    --easy-table-body-row-font-color: #141E46;
}
</style>