<template>
    <main
        class="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-homeMain to-homeSec font-poppins">
        <form @submit.prevent="forgotPassword"
            class="flex flex-col justify-center p-4 text-slate-400 rounded gap-4 w-80 md:w-96 bg-white/5 border border-black">
            <h1 class="text-blue-400 font-inter text-xs">Input your email below to send link for reset password</h1>
            <div class="flex flex-col">
                <label for="">Email</label>
                <input v-model="payload.email" type="text" name="email" id="email"
                    class="w-64 rounded outline-none text-sm text-white bg-transparent" placeholder="send email"
                    autocomplete="off">
                <small v-if="message" class="text-red-700 bg-red-300 p-1 rounded w-fit mt-2">
                    {{ message }}
                </small>
            </div>
            <button
                class=" bg-slate-500 h-8 w-32 rounded font-semibold hover:bg-slate-600 transition-color duration-300 text-white text-sm">
                <p v-if="!isLoading">
                    Submit
                </p>
                <p v-else class="animate-spin">
                    <font-awesome-icon icon="fa-solid fa-spinner" size="lg" />
                </p>
            </button>
        </form>
    </main>
</template>

<script setup>
import { userStore } from '@/stores/userStore';
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';


const user = userStore()
const isLoading = ref(false)

const payload = reactive({
    email: ''
})
const router = useRouter()

const message = ref('')

const forgotPassword = async () => {
    isLoading.value = !isLoading.value
    await user.forgotPassowrd(payload)
        .catch(error => {
            message.value = error.response.data.message
        })
        .finally(() => {
            isLoading.value = !isLoading.value
            if (message.value) return
            router.push({
                name: 'login', query: {
                    isSent: true
                }
            })
        })
}

watch(() => payload.email, () => {
    message.value = ''
})

</script>