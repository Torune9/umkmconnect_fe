<template>
    <div v-if="isDetail" @click="close"
        class="fixed z-50 w-full h-full bg-black/40 backdrop-blur-sm font-poppins flex justify-center items-center">
        <div class="flex flex-col h-fit max-h-[500px] rounded  bg-white p-4 gap-2 w-80 ">
            <div class="flex flex-row justify-between border-b">
                <h1>
                    Detail Product for : <span class="font-semibold text-red-700 text-lg">{{ dataProduct.name }}</span>
                </h1>
                <button @click="close" type="button" class="hover:text-red-700 text-black/60">
                    <font-awesome-icon icon="fa-solid fa-rectangle-xmark" size="lg" />
                </button>
            </div>
            <div class="w-full overflow-hidden">
                <img v-if="dataProduct.img" :src="dataProduct.img" alt="image product"
                    class="w-full h-full object-cover">
                <div v-else class="w-full h-full bg-slate-100 flex justify-center items-center text-4xl text-black/50">
                    <font-awesome-icon icon="fa-solid fa-store" />
                </div>
            </div>
            <div class="flex flex-col gap-2 h-full overflow-hidden">
                <h1>
                    Price : <span class="font-semibold text-red-700
                        text-lg">{{ formatterRupiah.formatPriceToIDR(dataProduct.price) }}</span>
                </h1>
                <h2>
                    Stock : <span class="font-semibold text-red-700 text-lg">{{ dataProduct.stock }}</span>
                </h2>
                <h3>
                    Description :
                </h3>
                <h4 class="h-full w-full overflow-auto break-words bg-slate-50 p-1 rounded">
                    <small>
                        {{ dataProduct.information }}
                    </small>
                </h4>
            </div>
        </div>
    </div>
</template>

<script setup>
import formatterRupiah from '@/service/utils/formatterRupiah';

const props = defineProps({
    isDetail: {
        type: Boolean,
        default: false
    },
    dataProduct: {
        type: Object,
        default: () => { }
    }
})
const emits = defineEmits(['close'])


const close = () => {
    emits('close', false)
}

</script>