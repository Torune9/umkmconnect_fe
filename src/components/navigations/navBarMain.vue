<template>
    <nav class="h-14 w-full bg-main flex justify-between items-center font-poppins font-semibold z-50">
        <h1 class="font-bold text-xl text-white pl-4">UMKMCONNECT</h1>
        <div class="flex flex-row items-center gap-x-10 text-sm text-white max-sm:p-2">
            <router-link to="/store">
                <button>
                    Stores
                </button>
            </router-link>
            <div
                class="flex flex-row items-center max-md:hidden bg-white p-1 rounded-tl-full rounded-bl-full w-48 gap-x-5">
                <picture>
                    <router-link to="/user/profile">
                        <div class="w-12 h-12 rounded-full overflow-hidden cursor-pointer flex justify-center items-center">
                            <img v-if="userData.image"  :src=" userData.image" alt="" class="w-90 h-90r">
                            <div v-else :class="randomBgClass"
                                class="h-full w-full flex justify-center items-center text-white">
                                {{ userData.username.charAt(0).toUpperCase() }}
                            </div>
                        </div>
                    </router-link>
                </picture>
                <router-link to="/store/profile">
                    <button
                        class="text-main border hover:bg-slate-200 rounded p-2 hover:text-white transition-colors duration-200">
                        {{ userData.username.length > 5 ? userData.username.slice(0,6) : userData.username}}...
                    </button>
                </router-link>
            </div>
            <div class="md:hidden">
                <button @click="showSidebar" class="text-white">
                    <font-awesome-icon icon="fa-solid fa-bars" size="xl" />
                </button>
            </div>
        </div>
    </nav>
</template>


<script setup>
import { userStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const emits = defineEmits(['showSidebar']);
const props = defineProps({
    showSide: {
        type: Boolean,
        default: false
    }
});

const store = userStore();
const { userData } = storeToRefs(store);

const bgColors = [
    'bg-red-600',
    'bg-green-600',
    'bg-blue-600',
    'bg-yellow-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-indigo-600',
    'bg-teal-600'
];

const randomBgClass = computed(() => {
    const index = Math.floor(Math.random() * bgColors.length);
    return bgColors[index];
});

const showSidebar = () => {
    emits('showSidebar', !props.showSide);
};
</script>
