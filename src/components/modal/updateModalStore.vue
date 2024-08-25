<template>
    <div v-if="isShowModal" class="w-full h-full fixed z-50 bg-black/20 flex justify-center items-center font-poppins pt-14">
        <form @submit.prevent="updateStore" enctype="multipart/form-data" class="border flex flex-col p-4 rounded gap-4 bg-white overflow-x-hidden overflow-y-auto max-h-full h-fit sm:max-w-md lg:max-w-lg">
            <div class="flex flex-row justify-between w-full">
                <h1 class="text-xl sm:text-2xl font-semibold">Update Store</h1>
                <button type="button" @click="closeModal" class="text-red-700 hover:text-red-500 transition-colors duration-300">
                    <font-awesome-icon icon="fa-solid fa-rectangle-xmark" size="lg" />
                </button>
            </div>
            <div class="flex flex-col items-center rounded gap-4 w-full">
                <div class="flex flex-col w-full">
                    <label for="name" class="text-sm">Name</label>
                    <input v-model="payload.name" required type="text" id="name" name="name" class="outline-none rounded text-sm w-full" placeholder="store name..." />
                </div>
                <div class="flex flex-col w-full">
                    <label for="phoneNumber" class="text-sm">Phone Number</label>
                    <input required id="phoneNumber" v-model="payload.noHp" type="text" maxlength="12" placeholder="e.g., 081234567890" class="outline-none rounded text-sm w-full" />
                    <p v-if="phoneNumberError" class="text-sm text-red-600">{{ phoneNumberError }}</p>
                </div>
                <div class="flex flex-col w-full gap-2">
                    <label for="img" class="text-sm">Image</label>
                    <input @change="setProfileImg" ref="fileInput" type="file" id="img" name="img" class="outline-none rounded text-sm border w-full" />
                    <div class="h-52" v-if="fileUpload.length > 0">
                        <img :src="src" class="object-cover h-full w-full border text-xs" />
                    </div>
                </div>
                <div class="flex flex-row w-full items-center gap-x-3">
                    <div class="flex flex-col w-full">
                        <label for="address" class="text-sm">Address</label>
                        <input v-model="payload.address" required type="text" id="address" name="address" class="outline-none rounded text-sm w-full" placeholder="https://maps.app.goo.gl/JthWsBZHB4NXUdeA7" />
                        <p v-if="messageLink" class="text-sm text-red-600">{{ messageLink }}</p>
                    </div>
                    <button @mouseover="showTooltip" @mouseleave="hideTooltip" type="button" class="h-5 w-5 bg-black rounded-full text-white text-center relative ">
                        !
                        <p v-if="visible" class="absolute top-0 right-0 rounded-md bg-black/50 backdrop-blur-md text-sm w-60 p-1">
                            get your address from google maps, copy it, and paste in address field
                        </p>
                    </button>
                </div>
                <div class="flex flex-col w-full">
                    <label for="description" class="text-sm">Description</label>
                    <textarea v-model="payload.description" required name="description" id="description" cols="30" rows="5" class="outline-none rounded text-sm w-full" placeholder="description here..."></textarea>
                    <small v-if="infoDesc" class="text-yellow-600">{{ infoDesc }}</small>
                </div>
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
                        update
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
import { storeShop } from '@/stores/storeShop'
import { reactive, ref, watch } from 'vue'

defineProps({
    isShowModal: {
        type: Boolean,
        default: false
    },
})

const shopStore = storeShop()
const loading = ref(false)

const fileInput = ref(null)
const fileUpload = ref([])
const src = ref('')
const infoDesc = ref('')
const isDisable = ref(false)
const phoneNumberError = ref('')

const setProfileImg = () => {
    const file = fileInput.value.files
    fileUpload.value = [...file]
    src.value = URL.createObjectURL(new Blob(fileUpload.value))
}

const payload = reactive({
    name: shopStore.dataStore.name,
    description: shopStore.dataStore.description,
    noHp: shopStore.dataStore.phoneNumber,
    address: shopStore.dataStore.address
})

const emits = defineEmits(['close'])

const closeModal = () => {

    payload.name =  shopStore.dataStore.name,
    payload.description =  shopStore.dataStore.description,
    payload.noHp =  shopStore.dataStore.phoneNumber,
   payload. address =  shopStore.dataStore.address
    if (fileInput.value) {
        fileInput.value.value = '' // Hapus value file input
    }
    emits('close', false)
}

const updateStore = async () => {
    if (!validatePhoneNumber(payload.noHp)) {
        phoneNumberError.value = 'Invalid phone number. It must be a valid 12-digit Indonesian number.';
        return;
    }

    loading.value = !loading.value
    const formData = new FormData()
    formData.append('name', payload.name)
    formData.append('address', payload.address)
    formData.append('description', payload.description)
    formData.append('userId', payload.userId)
    formData.append('phoneNumber', payload.noHp)
    formData.append('image', fileUpload.value[0])
    
    await shopStore
        .updateStore(shopStore.dataStore.id, formData)
        .then((response) => {
            shopStore.isShowStore = true
            console.log(response)
            alert(response.message)
        })
        .finally(() => {
            loading.value = !loading.value
            closeModal()
        })
}

const validatePhoneNumber = (phoneNumber) => {
    // Validasi nomor telepon yang hanya boleh terdiri dari angka dan memiliki panjang maksimal 12 digit
    const phoneNumberRegex = /^0\d{11}$/;
    return phoneNumberRegex.test(phoneNumber);
}

watch(
    () => payload.noHp,
    (newPhoneNumber) => {
        if (!validatePhoneNumber(newPhoneNumber)) {
            phoneNumberError.value = 'Invalid phone number. It must be a valid 12-digit Indonesian number.';
            isDisable.value = true;
        } else {
            phoneNumberError.value = '';
            isDisable.value = false;
        }
    }
)

const visible = ref(false)

const showTooltip = () => {
    visible.value = true;
};

const hideTooltip = () => {
    visible.value = false;
};

watch(
    () => payload.description,
    () => {
        if (payload.description.length > 50) {
            infoDesc.value = 'Warning, max description is 255 characters'
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

const googleMapsRegex = /^(https:\/\/www\.google\.com\/maps\/place\/.+|https:\/\/maps\.app\.goo\.gl\/.+)$/;

const messageLink = ref('')

watch(
    () => payload.address,
    (newAddress) => {
        if (!googleMapsRegex.test(newAddress)) {
            isDisable.value = true;
            messageLink.value = 'value invalid'
        } else {
            isDisable.value = false;
            messageLink.value = ''
        }
    }
);

</script>
