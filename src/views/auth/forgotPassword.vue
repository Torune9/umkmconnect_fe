<template>
    <main class="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-homeMain to-homeSec font-poppins">
        <form action="" class="flex flex-col justify-center p-4 text-slate-400 rounded gap-4 w-80 md:w-96 bg-white/5 border border-black">
            <h1 class="text-blue-400 font-inter text-xs">Input your email below to send link for reset password</h1>
            <div class="flex flex-col">
                <label for="">Email</label>
            <input type="text" name="email" id="email" class="w-64 rounded outline-none text-sm text-white bg-transparent" placeholder="send email" autocomplete="off">
            </div>
            <button class=" bg-slate-500 h-8 w-32 rounded font-semibold hover:bg-slate-600 transition-color duration-300 text-white text-sm">Sumbit</button>
        </form>
    </main>
</template>

<script setup>

</script>