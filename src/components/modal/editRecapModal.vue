<template>
    <section v-if="isShowUpdate" class="absolute p-4 top-10 right-1/2 z-20">
        <form @submit.prevent="updateInvOrFin" class=" p-4 flex flex-col gap-3 w-80 bg-white rounded-md shadow-lg">
            <div class="flex flex-row">
                <h1 class="p-2 border-b font-bold w-full">
                    Update {{ isUpdateFin ? 'Finance' : '' || isUpdateInv ? 'Inventory' : '' }}
                </h1>
                <button type="button" @click="close" class="hover:text-red-600">
                    <font-awesome-icon icon="fa-solid fa-rectangle-xmark" size="lg" />
                </button>
            </div>
            <div class="flex flex-col gap-4" v-if="isUpdateFin">
                <div class="flex flex-col">
                    <label for="inc">Income</label>
                    <input v-model="payloadRecap.income" class="rounded outline-none" type="text" id="inc" name="inc">
                </div>
                <div class="flex flex-col">
                    <label for="exp">Expenditure</label>
                    <input v-model="payloadRecap.exp" class="rounded outline-none" type="text" id="exp" name="exp">
                </div>
                <div class="flex flex-col">
                    <label for="information">Information</label>
                    <textarea class="outline-none rounded" v-model="payloadRecap.information" name="information" id="information" cols="10" rows="5"></textarea>
                </div>
            </div>
            <div class="flex flex-col" v-if="isUpdateInv">
                <div class="flex flex-col">
                    <label for="name">Name</label>
                    <input v-model="payloadInvent.name" class="rounded outline-none" type="text" name="name" id="name">
                </div>
                <div class="flex flex-col">
                    <label for="price">Price</label>
                    <input v-model="payloadInvent.price" class="rounded outline-none" type="text" name="price"
                        id="price">
                </div>
                <div class="flex flex-col">
                    <label for="stock">Stock</label>
                    <input v-model="payloadInvent.stock" class="rounded outline-none" type="number" name="stock"
                        id="stock">
                </div>
                <div class="flex flex-col">
                    <label for="desc">Description</label>
                    <textarea class="outline-none rounded" v-model="payloadInvent.description" name="desc" id="desc" cols="10" rows="5"></textarea>
                </div>

            </div>
            <div class="w-full text-right">
                <button class="w-40 bg-cyan-500 h-10 rounded text-white font-semibold hover:bg-cyan-400">
                    <p v-if="!isLoading">
                        Update
                    </p>
                    <p v-else class="animate-spin">
                        <font-awesome-icon icon="fa-solid fa-spinner" size="lg" />
                    </p>
                </button>
            </div>
        </form>
    </section>
</template>

<script setup>
import { inventStore } from '@/stores/inventoryStore';
import { recapStore } from '@/stores/recapStore';
import { storeShop } from '@/stores/storeShop';
import { reactive, ref, watch } from 'vue';
import formatterRupiah from '@/service/utils/formatterRupiah';

const props = defineProps({
    isUpdateInv: {
        type: Boolean,
        default: false
    },
    isUpdateFin: {
        type: Boolean,
        default: false
    },
    isShowUpdate: {
        type: Boolean,
        default: false
    },
    dataFin: {
        default: {}
    },
    dataInvent: {
        default: {}
    }

})

const emits = defineEmits(['close'])

const close = () => {
    emits('close', false)
}

const payloadRecap = reactive({
    income: '',
    exp: '',
    information : ''
})

const payloadInvent = reactive({
    name: '',
    price: '',
    stock: '',
    description: ''
})

const recap = recapStore()
const invent = inventStore()
const store = storeShop()

const isLoading = ref(false)

const updateInvOrFin = async () => {
    if (props.isUpdateInv) {
        isLoading.value = !isLoading.value
        const payload = {
            name: payloadInvent.name,
            price: formatterRupiah.convertToNumber(payloadInvent.price),
            stock: payloadInvent.stock,
            description: payloadInvent.description
        }
        return await invent.updateInventory(store.dataStore.id, payload)
            .finally(() => {
                isLoading.value = !isLoading.value
                close()
            })
    }

    if (props.isUpdateFin) {
        isLoading.value = !isLoading.value
         const payload = {
            income : formatterRupiah.convertToNumber(payloadRecap.income),
            exp : formatterRupiah.convertToNumber(payloadRecap.exp),
            information : payloadRecap.information
        }
        return await recap.updateRecapFinance(store.dataStore.id,payload)
            .finally(() => { 
                isLoading.value = !isLoading.value
                close()
            })
    }
}

watch(() => props.dataInvent, () => {
    payloadInvent.name = props.dataInvent.name,
        payloadInvent.price = props.dataInvent.price,
        payloadInvent.stock = props.dataInvent.stock,
        payloadInvent.description = props.dataInvent.description
})
watch(() => props.dataFin, () => {
    payloadRecap.income = props.dataFin.income
    payloadRecap.exp = props.dataFin.expenditure
    payloadRecap.information = props.dataFin.information
})

watch(() => payloadRecap.income, (newValue) => {

    payloadRecap.income = formatterRupiah.formatRupiah(newValue.toString());
});
watch(() => payloadRecap.exp, (newValue) => {

    payloadRecap.exp = formatterRupiah.formatRupiah(newValue.toString());
});
watch(() => payloadInvent.price, (newValue) => {

    payloadInvent.price = formatterRupiah.formatRupiah(newValue.toString());
});

</script>