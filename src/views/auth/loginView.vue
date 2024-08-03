<template>
    <LoadingPage :isLoading="loading" />
    <main
        class="w-screen h-screen flex flex-col justify-center items-center gap-y-2 font-inter bg-gradient-to-r from-homeMain to-homeSec">
        <fwb-alert v-if="info" icon :type="inform.type" class="bg-white">
            {{ inform.errors.message ?? inform.success.message }}
        </fwb-alert>
        <h1 class="text-3xl font-bold font-poppins text-slate-400 tracking-[.30em]">LOGINFORM</h1>
        <form @submit.prevent="login"
            class="p-4 flex flex-col justify-center items-center h-80 w-80 gap-y-1 bg-white/10 backdrop-blur-md border border-slate-500 rounded-lg shadow-xl ">
            <section class="flex flex-col">
                <div class="relative">
                    <label class="absolute top-2 left-2 text-white" for="email">
                        <font-awesome-icon icon="fa-solid fa-envelope" size="lg" />
                    </label>
                    <input v-model="formData.email" name="email" id="email" type="email" autocomplete="off"
                        placeholder="email"
                        class="border-b-4 bg-transparent placeholder-white/50 outline-none w-56 h-10 pl-8 pr-2 rounded text-sm text-white focus:bg-black/30 transition-all duration-300">
                </div>
                <div class="max-w-56 h-6 text-yellow-200 text-[11px]">
                    <div v-for="error of v$.email.$errors" :key="error.$uid">
                        <small>{{ error.$message }}</small>
                    </div>
                </div>
            </section>
            <section class="flex flex-col">
                <div class="relative">
                    <label class="absolute top-2 left-2 text-white" for="password">
                        <font-awesome-icon icon="fa-solid fa-lock" size="lg" />
                    </label>
                    <input v-model="formData.password" name="password" id="password" type="password"
                        placeholder="password"
                        class="border-b-4 bg-transparent placeholder-white/50 outline-none w-56 h-10 pl-8 pr-2 rounded text-sm text-white focus:bg-black/30 transition-all duration-300">
                </div>
                <div class="max-w-56 h-6 text-yellow-200 text-[11px]">
                    <div v-for="error of v$.password.$errors" :key="error.$uid">
                        <small>{{ error.$message }}</small>
                    </div>
                </div>
            </section>
            <section>
                <button
                    class="h-10 rounded w-56 font-semibold text-white bg-slate-950 hover:bg-slate-900 transition-all">Login</button>
            </section>
            <section>
                <div class="text-center text-white/70">
                    <div>
                        <router-link to="/password/forgot">
                            <small class="underline">Forgot Password?</small>
                        </router-link>
                    </div>
                    <div>
                        <small>
                            Don't have account? <router-link to="/user/register">
                                <span class=" underline text-black font-bold">
                                    Sign up
                                </span>
                            </router-link>
                        </small>
                    </div>
                </div>
            </section>
        </form>
    </main>
</template>

<script setup>
import LoadingPage from '@/components/util/loadingPage.vue';
import { userStore } from '@/stores/userStore';
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { computed, onMounted, reactive, ref ,watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FwbAlert } from 'flowbite-vue';

const inform = reactive({
    type : '',
    errors : {
        message : ''
    },
    success : {
        message : ''
    }
})
const info = ref(false)
const rule = computed(() => {
    return {
        email: { required, email },
        password: { required }
    }
})

const formData = reactive({
    email: '',
    password: ''
})
const store = userStore()
const router = useRouter()
const route = useRoute()


const v$ = useVuelidate(rule, formData)
const loading = ref()

const login = async () => {
    v$.value.$touch()
    if (v$.value.$invalid) return
    loading.value = true
    return await store.login(formData)
        .then(response => {
            if (response) {
                router.replace('/dashboard')
            }
        })
        .catch(error => {
            console.log(error);
            const {data:{message}} = error.response
            inform.errors.message = message ? message : 'login failed'
            inform.type = 'danger'
            inform.success.message = null
        })
        .finally(() => {
            info.value = true
            loading.value = false;
        })
}

onMounted(()=>{
    localStorage.clear()
    if (route?.query?.isLogin) {
        inform.errors.message = null
        info.value = true
        inform.success.message = 'Register Success'
         inform.type = 'success'
    }
    if (route?.query.isSent) {
        inform.errors.message = null
        info.value = true
        inform.success.message = 'Password reset link has been sent if the email is correct, please check your email'
         inform.type = 'success'
    }
})

watch(formData,()=>info.value = false)

</script>