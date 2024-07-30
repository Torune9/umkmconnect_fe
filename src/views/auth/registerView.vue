<template>
    <LoadingPage :isLoading="loading"/>
    <main class="w-screen h-screen flex flex-col justify-center items-center gap-y-2 font-inter bg-gradient-to-r from-homeMain to-homeSec">
        <fwb-alert v-if="errors.isError" icon type="danger">
            {{ errors.message }}
        </fwb-alert>
        <h1 class="text-3xl font-black text-slate-400 tracking-[.30em]">REGISTER</h1>
        <form @submit.prevent="register" class="p-4 flex flex-col justify-center items-center h-80 w-80 gap-y-1 bg-white/10 rounded-lg shadow-xl border border-slate-500">
            <section class="flex flex-col">
                <div class="relative">
                    <label class="absolute top-2 left-2 text-white" for="username">
                        <font-awesome-icon icon="fa-solid fa-user" size="lg"/>
                    </label>
                    <input v-model="formData.username" name="username" id="username" type="text"  placeholder="username" class="border-b-4 bg-transparent placeholder-white/50 outline-none w-56 h-10 pl-8 pr-2 rounded text-sm text-white focus:bg-black/30 transition-all duration-300">
                </div>
                <div class="max-w-56 h-6 text-yellow-200 text-[11px]" >
                    <div v-for="error of v$.username.$errors" :key="error.$uid">
                        <small>{{ error.$message }}</small>
                    </div>
                </div>
            </section>
            <section class="flex flex-col">
                <div class="relative">
                    <label class="absolute top-2 left-2 text-white" for="email">
                        <font-awesome-icon icon="fa-solid fa-envelope" size="lg"/>
                    </label>
                    <input v-model="formData.email" name="email" id="email" type="email" autocomplete="off" placeholder="email" class="border-b-4 bg-transparent placeholder-white/50 outline-none w-56 h-10 pl-8 pr-2 rounded text-sm text-white focus:bg-black/30 transition-all duration-300">
                </div>
                <div class="max-w-56 h-6 text-yellow-200 text-[11px]" >
                    <div v-for="error of v$.email.$errors" :key="error.$uid">
                        <small>{{ error.$message }}</small>
                    </div>
                </div>
            </section>
            <section class="flex flex-col">
                <div class="relative">
                    <label class="absolute top-2 left-2 text-white" for="password">
                        <font-awesome-icon icon="fa-solid fa-lock" size="lg"/>
                    </label>
                    <input v-model="formData.password" name="password" id="password" type="password" placeholder="password" class="border-b-4 bg-transparent placeholder-white/50 outline-none w-56 h-10 pl-8 pr-2 rounded text-sm text-white focus:bg-black/30 transition-all duration-300">
                </div>
                <div class="max-w-56 h-6 text-yellow-200 text-[11px]" >
                    <div v-for="error of v$.password.$errors" :key="error.$uid">
                        <small>{{ error.$message }}</small>
                    </div>
                </div>
            </section>
            <section>
                <button class="h-10 rounded w-56 font-semibold text-white bg-slate-950 hover:bg-slate-900 transition-all">Register</button>
            </section>
            <section>
                <router-link to="/user/login">
                    <small class="underline text-white/50">
                        Back to login 
                    </small>
                </router-link>
            </section>
        </form>
    </main>
</template>

<script setup>
import LoadingPage from '@/components/util/loadingPage.vue';
import { userStore } from '@/stores/userStore';
import { useVuelidate } from '@vuelidate/core'
import { required, email,minLength } from '@vuelidate/validators'
import { computed, onMounted, reactive,ref, watch} from 'vue';
import { useRouter } from 'vue-router'
import { FwbAlert } from 'flowbite-vue';

const errors = reactive({
    isError : false,
    message  :''
})

const rule = computed(() => {
    return {
        username : {required},
        email: { 
            required, 
            email },
        password: { 
            required,
            minLength: minLength(8)}
    }
})
const formData = reactive({
    username :'',
    email: '',
    password: ''
})

const route = useRouter()

const loading = ref(false)

const store = userStore()

const v$ = useVuelidate(rule, formData)

const register = async () => {
    v$.value.$touch()
    if (v$.value.$invalid) return
    loading.value = !loading.value
    store.register(formData)
    .then(response => {
        if(!response) return
        route.replace({
            path : '/user/login',
            query : {
                isLogin : true
            }
        })
    })
    .catch(error => {
        errors.isError = true
        errors.message = 'Email has been used,try another username'
    })
    .finally(()=>loading.value = !loading.value)
}

watch(()=>formData.email,()=>errors.isError = false)
</script>