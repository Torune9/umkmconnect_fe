<template>
    <nav class="bg md:h-14 w-full h-12 flex items-center justify-between p-4 font-inter backdrop-blur-sm bg-black/20">
        <div class="font-black group cursor-pointer">
            <router-link to="/dashboard">
                <h1 class="text-xl text-slate-700 group-hover:text-slate-600 transition-colors duration-300">UMKM
                    <span class="text-slate-600 group-hover:text-slate-500 transition-colors duration-300">CONNECT</span>
                </h1>
            </router-link>
        </div>
        <div class="md:hidden">
            <!-- Button for toggling dropdown -->
            <button @click="isMenuOpen = !isMenuOpen" class="text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
        </div>
        <div class="hidden md:flex flex-row gap-4">
            <router-link to="/" active-class="text-white bg-white/20 rounded" exact-active-class="text-white">
                <button
                    class="text-main  p-2 font-poopins font-bold rounded-md w-20 text-sm hover:bg-black/20 transition-colors duration-300">Home</button>
            </router-link>
            <router-link to="/user/login">
                <button
                    class="bg-red-700 p-2 font-poopins font-bold text-white rounded-md w-20 text-sm hover:bg-red-500 transition-colors duration-300">Login</button>
            </router-link>
            <router-link to="/store">
                <button
                    class="bg-indigo-700 p-2 font-poopins font-bold text-white rounded-md w-20 text-sm hover:bg-indigo-500 transition-colors duration-300">Store</button>
            </router-link>
        </div>
        <!-- Mobile dropdown menu -->
        <div v-show="isMenuOpen" class="absolute top-full left-0 w-full bg-black/20 md:hidden flex flex-col gap-2 p-4">
            <router-link to="/" active-class="text-white bg-white/20 rounded" exact-active-class="text-white">
                <button
                    class="text-main  p-2 font-poopins font-bold rounded-md w-full text-sm hover:bg-black/20 transition-colors duration-300">Home</button>
            </router-link>
            <router-link to="/user/login">
                <button
                    class="bg-red-700 p-2 font-poopins font-bold text-white rounded-md w-full text-sm hover:bg-red-500 transition-colors duration-300">Login</button>
            </router-link>
            <router-link to="/store">
                <button
                    class="bg-indigo-700 p-2 font-poopins font-bold text-white rounded-md w-full text-sm hover:bg-indigo-500 transition-colors duration-300">Store</button>
            </router-link>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue';

// Define a reactive variable to control the dropdown menu visibility
const isMenuOpen = ref(false);
</script>
