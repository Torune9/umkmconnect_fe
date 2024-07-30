<template>
    <Transition name="confirm">
        <div v-if="isConfirm" class="flex flex-col top-20 right-72 rounded-lg absolute z-20 bg-white p-8 gap-5 border">
            <button @click="closeConfirm" type="button" class="w-full text-center text-2xl text-red-800">
                <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2xl"/>
            </button>
            <button @click="closeConfirm" type="button" class="w-full absolute top-2 right-2 text-right text-black/50 hover:text-black transition-colors duration-200">
                <font-awesome-icon icon="fa-solid fa-circle-xmark" size="xl" />
            </button>
            <div class="flex flex-col gap-y-2">
                
            <h1 class="text-lg font-semibold text-black/50">Are you sure you want to delete this product?</h1>
            
            <div class="flex flex-row gap-x-8 text-white">
                <button @click="deleteProduct" type="button" class="w-full h-10 bg-green-600 hover:bg-green-800 rounded-lg font-semibold">Yes,I'm Sure</button>
                <button @click="closeConfirm" type="button" class="w-full h-10 bg-black/80 hover:bg-slate-600 rounded-lg font-semibold">No,Cancel</button>
            </div>    
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { storeShop } from '@/stores/storeShop';


const store = storeShop()

const props = defineProps({
    isConfirm :{
        type : Boolean,
        default : false
    },
    id :{
        type : Number,
    }
})

const emits = defineEmits(['close','sendMesage'])

const closeConfirm = ()=>{
    emits('close',props.isConfirm)
}

const deleteProduct = async ()=>{
    return await store.deleteProduct(props.id)
    .then(response =>{
        const {message} = response
        emits('sendMessage', {
        message,
        type: 'success'
      })
    })
    .catch(error => {
        const {message} = error.response
        emits('sendMessage', {
        message: message,
        type: 'danger'
      })
    })
    .finally(()=>{
        return closeConfirm()
    })
}


</script>

<style scoped>
.confirm-enter-active,
.confirm-leave-active {
  transition: transform 0.2s ease-in-out;
}

.confirm-enter-from{
    transform: scale(0);
}
.confirm-enter-to{
    transform: scale(1);
}
.confirm-leave-from {
    transform: scale(1);
}
.confirm-leave-to {
  transform: scale(0);
}

</style>