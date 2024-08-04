<template>
    <div v-if="isShowModal"
        class="w-full h-full  fixed z-50 bg-black/20 flex justify-center items-center font-poppins">
        <form @submit.prevent="createOrJoin" enctype="multipart/form-data"
            class="border flex flex-col items-center justify-center p-4 rounded gap-4 bg-white overflow-x-hidden overflow-y-auto max-h-screen max-w sm:max-w-md lg:max-w-lg">
            <div class="flex flex-row justify-between w-full">
                <h1 class="text-xl sm:text-2xl font-semibold">{{ isShowCreate ? 'Create' : 'Join' }} Store</h1>
                <button type="button" @click="closeModal"
                    class="text-red-700 hover:text-red-500 transition-colors duration-300">
                    <font-awesome-icon icon="fa-solid fa-rectangle-xmark" size="lg" />
                </button>
            </div>
            <div v-if="isShowCreate" class="flex flex-col items-center rounded gap-4 w-full">
                <div class="flex flex-col w-full">
                    <label for="name" class="text-sm">Name</label>
                    <input v-model="payload.name" required type="text" id="name" name="name"
                        class="outline-none rounded text-sm w-full" placeholder="store name..." />
                </div>
                <div class="flex flex-col w-full">
                    <label for="phoneNumber" class="text-sm">Phone Number</label>
                    <input required id="phoneNumber" v-model="payload.noHp" type="text" placeholder="e.g., 628123456789"
                    class="outline-none rounded text-sm w-full"/>
                </div>
                <div class="flex flex-col w-full gap-2">
                    <label for="img" class="text-sm">Image</label>
                    <input @change="setProfileImg" ref="files" type="file" id="img" name="img"
                        class="outline-none rounded text-sm border w-full" />
                    <div class="h-52" v-if="fileUpload.length > 0">
                        <img :src="src" class="object-cover h-full w-full border text-xs" />
                    </div>
                </div>
                <div class="flex flex-col w-full">
                    <label for="description" class="text-sm">Description</label>
                    <textarea v-model="payload.description" required name="description" id="description" cols="30"
                        rows="5" class="outline-none rounded text-sm w-full" placeholder="description here...">
                    </textarea>
                    <small v-if="infoDesc" class="text-yellow-600">{{ infoDesc }}</small>
                </div>
            </div>
            <div v-else class="flex flex-col w-full">
                <label for="join" class="text-sm">Code</label>
                <input v-model="code" required type="text" name="store" id="store" placeholder="add code here..."
                    class="rounded outline-none text-sm w-full" />
            </div>
            <div class="text-right w-full mt-4">
                <button :disabled="isDisable" :class="[
                    'text-white w-full sm:w-40 h-10 rounded transition-colors duration-300 font-semibold',
                    isShowCreate
                        ? isDisable
                            ? 'bg-black/70 outline outline-slate-950 hover:bg-slate-600'
                            : 'bg-blue-700 hover:bg-blue-500'
                        : 'bg-red-800 hover:bg-red-600'
                ]">
                    <p v-if="!loading">
                        {{ isShowCreate ? 'Create' : 'Join' }}
                    </p>
                    <p v-else class="animate-spin">
                        <font-awesome-icon icon="fa-solid fa-spinner" size="lg" />
                    </p>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { userStore } from '@/stores/userStore'
import { storeShop } from '@/stores/storeShop'
import { reactive, ref, watch } from 'vue'

const props = defineProps({
    isShowModal: {
        type: Boolean,
        default: false
    },
    isShowCreate: {
        type: Boolean,
        default: false
    }
})

const usrStore = userStore()
const shopStore = storeShop()
const loading = ref(false)

const files = ref([])
const fileUpload = ref([])
const src = ref('')
const infoDesc = ref('')
const isDisable = ref(false)
const setProfileImg = () => {
    const file = files.value.files
    fileUpload.value = [...file]
    console.log(fileUpload.value)
    src.value = URL.createObjectURL(new Blob(fileUpload.value))
}

const payload = reactive({
    name: '',
    description: '',
    userId: usrStore.userData.id,
    noHp: ''
})

const code = ref('')

const emits = defineEmits(['close'])
const closeModal = () => {
    payload.description = ''
    payload.name = ''
    payload.userId = ''
    emits('close', false)
}

const createOrJoin = async () => {
    loading.value = !loading.value
    if (props.isShowCreate) {
        const formData = new FormData()
        formData.append('name', payload.name)
        formData.append('description', payload.description)
        formData.append('userId', payload.userId)
        formData.append('phoneNumber', payload.noHp)
        formData.append('image', fileUpload.value[0])
        await shopStore
            .createStore(formData)
            .then((response) => {
                shopStore.isShowStore = true
                console.log(response)
            })
            .finally(() => {
                loading.value = !loading.value
                closeModal()
            })
    } else {
        console.log('test')
        usrStore.isEmployee = true
        await usrStore
            .joinStore({
                code: code.value.trim(),
                id: usrStore.userData.id
            })
            .then((response) => {
                shopStore.isShowStore = true
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                loading.value = !loading.value
                closeModal()
            })
    }
}

watch(
    () => payload.description,
    () => {
        if (payload.description.length > 50) {
            infoDesc.value = 'Warning,max description is 225 character'
        } else {
            infoDesc.value = ''
        }
        if (payload.description.length >= 255) {
            isDisable.value = true
        } else {
            isDisable.value = false
        }
    }
)
</script>
