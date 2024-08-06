<template>
    <Transition name="recap">
        <section v-if="isRecap" class="z-50 fixed w-full h-full bg-black/40 flex justify-center items-center">
            <form @submit.prevent="recapFinanceOrInvent" class="flex flex-col gap-y-4 bg-white rounded-md justify-center items-center w-80 p-4">

                <div class="flex flex-row border-b w-full justify-between">
                    <h1 class="p-2 w-full font-semibold">
                        {{ isFinance ? 'Recap Finance' : '' || isInvent ? 'Recap Inventory' : '' }}
                    </h1>
                    <button @click="closeModal" type="button"
                        class="text-black/70 hover:text-black/90 transition-colors duration-200">
                        <font-awesome-icon icon="fa-solid fa-rectangle-xmark" size="lg" />
                    </button>
                </div>

                <div v-if="isFinance" class="w-full">
                    <div class="flex flex-col">
                        <label for="inc">Income</label>
                        <input v-model="payloadFinance.income" type="text" name="inc" id="inc"
                            class="rounded outline-none w-full" placeholder="0" />
                    </div>
                    <div class="flex flex-col">
                        <label for="exp">Expenditure</label>
                        <input v-model="payloadFinance.exp" type="text" name="exp" id="exp" class="rounded outline-none w-full"
                            placeholder="0" />
                    </div>
                    <div class="flex flex-col">
                        <label for="information">Information</label>
                        <textarea v-model="payloadFinance.information" name="information" id="information"
                            class="rounded outline-none w-full" placeholder="information" cols="20" rows="5"></textarea>
                        <small class="text-red-600">
                            {{ message }}
                        </small>
                    </div>
                </div>

                <div v-if="isInvent" class="w-full">
                    <div class="flex flex-col">
                        <label for="name">Name</label>
                        <input v-model="payloadInventory.name" type="text" name="name" id="name" class="rounded outline-none w-full"
                            placeholder="name" />
                    </div>
                    <div class="flex flex-row gap-x-2">
                        <div class="flex flex-col">
                            <label for="price">Price</label>
                            <input v-model="payloadInventory.price" type="text" name="price" id="price" class="rounded outline-none w-full"
                                placeholder="0" />
                        </div>
                        <div class="flex flex-col">
                            <label for="stock">Stock</label>
                            <input v-model="payloadInventory.stock" type="number" name="stock" id="stock" class="rounded outline-none w-20"
                                placeholder="0" />
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label for="desc">Description</label>
                        <textarea v-model="payloadInventory.description" name="desc" id="desc" cols="10" rows="5" class="rounded">

                        </textarea>
                    </div>
                </div>

                <div class="text-right w-full">
                    <button class="bg-green-600 p-2 w-24 rounded text-white font-semibold">
                        <p v-if="!isLoading">Submit</p>
                        <p v-else class="animate-spin">
                            <font-awesome-icon icon="fa-solid fa-spinner" size="lg" />
                        </p>
                    </button>
                </div>
            </form>
        </section>
    </Transition>
</template>

<script setup>

import { inventStore } from '@/stores/inventoryStore';
import { recapStore } from '@/stores/recapStore';
import { storeShop } from '@/stores/storeShop';
import { reactive, ref, watch } from 'vue';
import formatterRupiah from '@/service/utils/formatterRupiah';

const recap = recapStore()
const store = storeShop()
const invent = inventStore()

const props = defineProps({
    isRecap: {
        type: Boolean,
        default: false
    },
    isFinance: {
        type: Boolean,
        default: false
    },
    isInvent: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['close','sendInfo'])

const closeModal = () => {
    payloadFinance.income = ''
    payloadFinance.exp = ''
    payloadFinance.information = ''
    emits('close', false)
}

const isLoading = ref(false)
const message = ref('')

const payloadFinance = reactive({
    income: '',
    exp: '',
    information: '',
})

const payloadInventory = reactive({
    name : '',
    price : '',
    stock : 0,
    description : ''
})


const sendInfo = (message,type)=>{
    emits('sendInfo',{message,type})
}

const recapFinance = async ()=> {
    isLoading.value = !isLoading.value

    const newpayloadFinance = {
        exp: formatterRupiah.convertToNumber(payloadFinance.exp),
        income: formatterRupiah.convertToNumber(payloadFinance.income),
        information: payloadFinance.information,
        storeId: store.dataStore.id,

    }
    return await recap.createRecapFinance(newpayloadFinance)
        .then(() => {
            sendInfo('Success adding recap','success')
        })
        .catch(error => {
            const {data:{message}} = error.response
            sendInfo(`Failed adding recap,${message}`,'danger')
        })
        .finally(() => {
            isLoading.value = !isLoading.value
            closeModal()
        })
}

const createInvent = async ()=>{
    isLoading.value = !isLoading.value
    const newpayloadFinance = {
        name: payloadInventory.name,
        price: formatterRupiah.convertToNumber(payloadInventory.price),
        stock: payloadInventory.stock,
        defineSlots : payloadInventory.description,
        storeId: store.dataStore.id,

    }
    await invent.createInventory(newpayloadFinance)
    .then(() => {
        sendInfo('Success adding inventory','success')
    })
    .catch(error => {
        const {data:{message}} = error.response
        sendInfo(`Failed adding inventory,${message}`,'danger')
    })
    .finally(()=>{
        isLoading.value = !isLoading.value
        closeModal()
    })
}

const recapFinanceOrInvent = async ()=>{
    if (props.isFinance) {
        await recapFinance()
    }
    if (props.isInvent) {
        await createInvent()
    }
} 

watch(() => payloadFinance.information, () => {
    if (payloadFinance.information.length > 50) {
        message.value = 'Warning, max length of information is 225 char'
    } else {
        message.value = ''
    }
})

watch(() => payloadFinance.income, (newValue) => {
    payloadFinance.income =formatterRupiah.formatRupiah(newValue);
});

watch(() => payloadFinance.exp, (newValue) => {
    payloadFinance.exp =formatterRupiah.formatRupiah(newValue);
});
watch(() => payloadInventory.price, (newValue) => {
    payloadInventory.price =formatterRupiah.formatRupiah(newValue);
});

</script>

<style>
.recap-enter-active,
.recap-leave-active {
    transition: transform 0.2s ease;
}

.recap-enter-from,
.recap-leave-to {
    transform: scale(0);
}
</style>
