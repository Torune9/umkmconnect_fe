<template>
    <nav
        class="bg md:h-14 w-full h-12 flex items-center justify-between p-4 font-inter backdrop-blur-sm fixed bg-black/20">
        <div class="font-black group cursor-pointer">
            <router-link to="/dashboard">
                <h1 class="text-xl text-slate-700 group-hover:text-slate-600 transition-colors duration-300">UMKM<span
                        class="text-slate-600 group-hover:text-slate-500 transition-colors duration-300">CONNECT</span>
                </h1>
            </router-link>
        </div>
        <div>
            <router-link to="/user/login">
                <button
                    class="bg-red-700 p-2 font-poopins font-bold text-white rounded-md w-20 text-sm hover:bg-red-500 transition-colors duration-300">Login</button>
            </router-link>
        </div>
    </nav>
</template>
<script setup>
</script>