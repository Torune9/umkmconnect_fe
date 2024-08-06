<template>
    <MainLayout>
        <template v-slot:body>
            <main class="p-8 mt-10 h-screen flex flex-col justify-center items-center font-poppins gap-2">
                <div v-if="info.message"  class="p-1 text-center rounded-md relative" :class="[info.type == 'danger' ? 'bg-red-200 text-red-600' : 'bg-green-200 text-green-600']">
                    {{ info.message }}
                    <button @click="info.message=''" class="absolute -top-2 -right-2">
                        <font-awesome-icon icon="fa-solid fa-circle-xmark"/>
                    </button>
                </div>
                <form @submit.prevent="updateUser"  class="flex flex-col justify-center border p-4 gap-y-4 w-96 rounded max-sm:w-80 ">
                    <div class="relative flex flex-col items-center justify-center">
                        <div class="w-32 h-32 max-sm:h-24 max-sm:w-24  rounded-full overflow-hidden flex justify-center items-center ">
                           <div class="h-full w-full" v-if="src || userData.image">
                            <img  :src="src ? src : userData.image" alt="" class="w-full h-full object-cover">
                           </div>
                            <div v-else class="bg-yellow-400 w-full h-full text-white flex justify-center items-center text-7xl max-sm:text-4xl " >
                                {{ userData.username.charAt(0).toUpperCase() }}
                            </div>
                        </div>
                        <label for="img"
                            class="absolute bottom-0 right-0 cursor-pointer text-black/60 hover:text-black/80">
                            <font-awesome-icon icon="fa-solid fa-camera" size="xl" />
                        </label>
                        <input hidden @change="setProfileImg" ref="files" type="file" name="image" id="img">
                        <h1 class="font-semibold">{{ userData.username }}</h1>
                    </div>
                    <div class="flex flex-col">
                        <label for="username">username</label>
                        <input type="text" name="username" id="username" v-model="payload.username"
                            class="w-full rounded outline-none border-slate-400 text-sm">
                    </div>
                    <div class="flex flex-col">
                        <label for="email">email</label>
                        <input type="text" name="email" id="email" v-model="payload.email"
                            class="w-full rounded outline-none border-slate-400 text-sm" :placeholder="userData.email" >
                            <small class="text-red-700" >{{ message }}</small>
                    </div>
                    <div class="justify-start items-center">
                        <div class="flex flex-col col-span-2">
                            <label for="password">password</label>
                            <div class="flex flex-row gap-2 h-full justify-center items-center">
                                <input :disabled="!isDisabled" type="password" name="password" id="password" v-model="payload.password"
                                    class="w-full rounded outline-none border-slate-400 text-sm">
                                <input type="checkbox" name="change" id="change" class=" active:outline-none focus:outline-none" v-model="isDisabled">
                                <label for="change" class="text-xs">change password</label>
                            </div>
                        </div>
                    </div>
                    <div class="w-full text-right">
                        <button
                            class="bg-cyan-500 w-40 h-10 hover:bg-cyan-600 transition-colors duration-300 rounded text-white">
                            <p v-if="!isLoading">
                                Edit
                            </p>
                            <p v-else class="animate-spin" >
                                <font-awesome-icon icon="fa-solid fa-spinner" size="xl" />
                            </p>
                        </button>
                    </div>
                </form>
            </main>
        </template>
    </MainLayout>
</template>

<script setup>
import MainLayout from '@/layout/mainLayout.vue';
import { userStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { reactive, ref, watch } from 'vue'
const files = ref([])
const fileUpload = ref([])
const isDisabled = ref(false),
    isLoading = ref(false)
const src = ref('')
const info = reactive({
    message : '',
    type : ''
})
const setProfileImg = () => {
    const file = files.value.files
    fileUpload.value = [...file]
    src.value = URL.createObjectURL(new Blob(fileUpload.value))
}

const user = userStore()
const { userData } = storeToRefs(user)

const payload = reactive({
    username : userData.value.username,
    email : '',
    id : userData.value.id,
    password : ''
})

const message = ref('')


const getImageUser = async ()=>{
    await user.getUserImage(userData.value.id)
    .then(response => {
       userData.value.image = response.data
    })
    .catch(error => {
        console.log(error);
    })
    .finally(()=>{})
}

const updateUser = async ()=>{
    isLoading.value = !isLoading.value
    const formData = new FormData()
    formData.append('name',payload.username)
    formData.append('email',payload.email)
    formData.append('id',payload.id)
    formData.append('password',payload.password)
    formData.append('image',fileUpload.value[0])
    await user.updateUser(formData)
        .then(response => {
            userData.value.username = payload.username ? payload.username : userData.value.username
            userData.value.email = payload.email ? payload.email : userData.value.email

            info.message = response.message
            console.log(response);
        })
        .catch(error => {
            message.value = error.response.data.message
            info.message = 'failed update data'
            info.type = 'danger'
            console.log(error);
        })
        .finally(async ()=>{
            isLoading.value = !isLoading.value
            await getImageUser()
            
        })
}

watch(()=>payload.email,()=>message.value = '')

</script>