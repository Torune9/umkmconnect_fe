<template>
    <div v-if="isCheckout"
        class="fixed z-50 inset-0 bg-black/40 backdrop-blur-sm font-poppins flex justify-center items-center">
        <div class="flex flex-col max-h-[90vh] rounded bg-white p-4 gap-4 w-full max-w-md mx-4">
            <div class="flex flex-row justify-between border-b pb-2">
                <h1 class="text-base sm:text-lg">
                    Checkout Product: <span class="font-semibold text-red-700">{{ dataProduct.name }}</span>
                </h1>
                <button @click="close" type="button" class="hover:text-red-700 text-black/60">
                    <font-awesome-icon icon="fa-solid fa-rectangle-xmark" size="lg" />
                </button>
            </div>
            <div class="w-full overflow-hidden">
                <img v-if="dataProduct.img" :src="dataProduct.img" alt="image product"
                    class="w-full h-32 sm:h-48 object-cover rounded">
                <div v-else class="w-full h-32 bg-slate-100 flex justify-center items-center text-3xl sm:text-4xl text-black/50">
                    <font-awesome-icon icon="fa-solid fa-image" />
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <h2 class="text-sm sm:text-base">
                    Price: <span class="font-semibold text-red-700">{{ formatterRupiah.formatPriceToIDR(dataProduct.price) }}</span>
                </h2>
                <form @submit.prevent="confirmCheckout">
                    <label class="text-sm sm:text-base">Name:</label>
                <input required type="text" v-model="payload.name" class="p-2 border rounded w-full text-sm sm:text-base" placeholder="Enter your name" />
                
                <label class="text-sm sm:text-base">Quantity:</label>
                <input required type="number" v-model="payload.quantity" min="1" class="p-2 border rounded w-full text-sm sm:text-base" />
                <h3 class="font-semibold text-red-700 text-lg sm:text-xl">
                    Total Price: {{ formatterRupiah.formatPriceToIDR(totalPrice) }}
                </h3>
                <div class="flex flex-col sm:flex-row justify-between gap-2 mt-4">
                    <button
                        class="bg-green-500 hover:bg-green-600 text-white p-2 rounded w-full sm:w-auto">
                        Confirm
                    </button>
                    <button @click="close" type="button"
                        class="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded w-full sm:w-auto">
                        Cancel
                    </button>
                </div>
                </form>
                
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import formatterRupiah from '@/service/utils/formatterRupiah';
import { userStore } from '@/stores/userStore';

const props = defineProps({
    isCheckout: {
        type: Boolean,
        default: false
    },
    dataProduct: {
        type: Object,
        default: () => { }
    }
})

const user = userStore()
const emits = defineEmits(['close', 'confirmCheckout'])

const payload = reactive({
    name: '',
    email: user.userData.email,
    quantity: 1
});

const totalPrice = computed(() => {
    return props.dataProduct.price * payload.quantity;
});

const close = () => {
    payload.name = ''
    payload.quantity = 1
    emits('close', false)
}

const confirmCheckout = () => {
    emits('confirmCheckout', { 
        product: props.dataProduct, 
        ...payload, 
        totalPrice: totalPrice.value 
    });
    close();
}
</script>
