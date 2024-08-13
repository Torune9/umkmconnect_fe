<template>
  <Transition name="modals">
    <div class="absolute z-50 w-full h-screen flex justify-center items-center" v-if="showModalCreateProd">
      <form @submit.prevent="createOrUpdate" class="flex flex-col justify-center border rounded p-4 gap-2 bg-white w-96"
        enctype="multipart/form-data">
        <div class="flex flex-row justify-between">
          <h1 class="text-xl font-semibold">Create product</h1>
          <button type="button" @click="close" class="text-red-700 hover:text-red-500 transition-colors duration-300">
            <font-awesome-icon icon="fa-solid fa-rectangle-xmark" size="xl" />
          </button>
        </div>
        <div class="flex flex-col">
          <label for="name">Product name</label>
          <input type="text" id="name" name="name" class="rounded outline-none text-sm" v-model="payload.name" />
        </div>
        <div class="flex flex-row gap-1 w-full ">
          <div class="w-full">
            <label for="price">Price</label>
            <input type="text" name="price" id="price" class="rounded outline-none text-sm w-full"
              v-model="payload.price" />
          </div>
        </div>
        <div class="flex flex-col">
          <label for="image">Image</label>
          <input @change="setImgProduct" class="rounded border" type="file" name="image" id="image" ref="fileInput" />
          <div class="w-40 h-20 overflow-hidden rounded relative" v-if="fileUpload.length !== 0">
            <button type="button" @click="clearFile" class="absolute right-0 top-2">
              <font-awesome-icon icon="fa-solid fa-circle-xmark" />
            </button>
            <figure class="h-full w-full">
              <img class="h-full w-full object-fill" :src="src" alt="" />
            </figure>
          </div>
          <FwbAlert v-if="infoFileUpload" type="danger">
            {{ infoFileUpload }}
          </FwbAlert>
        </div>
        <div class="flex flex-col">
          <label for="info">Description</label>
          <textarea name="information" id="info" cols="10" rows="5" v-model="payload.information"></textarea>
        </div>
        <div class="w-full text-right">
          <button v-if="isCreate"
            class="bg-blue-700 w-40 h-10 text-white font-semibold hover:bg-blue-500 transition-colors duration-200 rounded">
            <p v-if="!loading">Create</p>
            <p v-else class="animate-spin">
              <font-awesome-icon icon="fa-solid fa-spinner" size="xl" />
            </p>
          </button>
          <button v-else
            class="bg-blue-700 w-40 h-10 text-white font-semibold hover:bg-blue-500 transition-colors duration-200 rounded">
            <p v-if="!loading">Edit</p>
            <p v-else class="animate-spin">
              <font-awesome-icon icon="fa-solid fa-spinner" size="xl" />
            </p>
          </button>
        </div>
      </form>
    </div>
  </Transition>
</template>

<script setup>
import { storeShop } from '@/stores/storeShop'
import { FwbAlert } from 'flowbite-vue'
import { reactive, ref, watch } from 'vue'
import formatterRupiah from '@/service/utils/formatterRupiah';
import { userStore } from '@/stores/userStore';

const store = storeShop()
const fileInput = ref(null)
const fileUpload = ref([])
const infoFileUpload = ref('')
const src = ref('')

const props = defineProps({
  productData: {
    default: {}
  },
  showModalCreateProd: {
    type: Boolean,
    default: false
  },
  isCreate: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'sendMessage'])

const close = () => {
  emits('close', !props.showModalCreateProd)
  payload.name = ''
  payload.price = ''
  payload.information = ''
  clearFile()
}

const messages = ref('')

const payload = reactive({
  name: '',
  price: 0,
  information: '',
})

const loading = ref(false)

const setImgProduct = () => {
  const files = fileInput.value.files
  fileUpload.value = files
  if (files.length > 0) {
    const valid = validateFile(files[0])
    if (!valid) {
      src.value = URL.createObjectURL(new Blob(fileUpload.value))
      infoFileUpload.value = ''
    } else {
      fileUpload.value = []
      fileInput.value.value = null
      infoFileUpload.value = valid
    }
  }
}

const validateFile = (file) => {
  const type = ['image/jpg', 'image/jpeg', 'image/png']
  const MAX_SIZE = 7 * 1024 * 1024

  if (file.size > MAX_SIZE) {
    return `Max size of image is 7MB`
  }
  if (!type.includes(file.type)) {
    return `File is not image`
  }
  return null
}

const clearFile = () => {
  fileUpload.value = []
  src.value = ''
  if (fileInput.value) {
    fileInput.value.value = null // Clear the file input
  }
}

const pairsPayload = (data) => {
  const formData = new FormData()
  Object.keys(data).forEach((key) => formData.append(key, data[key]))
  formData.append('image', fileUpload.value[0])
  return formData
}

const createProduct = async () => {
  loading.value = true
  const newPayload = {
    name: payload.name,
    price: formatterRupiah.convertToNumber(payload.price),
    information: payload.information,
    storeId: store.dataStore?.id ? store.dataStore.id : userStore().userData.member
  }
  const dataForm = pairsPayload(newPayload)
  await store
    .createProduct(dataForm)
    .then(() => {
      messages.value = 'Success adding product'
      emits('sendMessage', {
        message: messages.value,
        type: 'success'
      })
    })
    .catch((error) => {
      const {
        error: { message }
      } = error.response.data
      messages.value = 'Failed to add product ' + message
      emits('sendMessage', {
        message: messages.value,
        type: 'danger'
      })
    })
    .finally(() => {
      loading.value = false
      close() // Close the modal after submission
    })
}

const updateProduct = async () => {
  loading.value = true
  const newPayload = {
    name: payload.name,
    price: formatterRupiah.convertToNumber(payload.price),
    information: payload.information,
    storeId: store.dataStore.id,
  }
  const dataForm = pairsPayload(newPayload)
  await store
    .updateProduct(props.productData.id, dataForm)
    .then(() => {
      messages.value = 'Success update product'
      emits('sendMessage', {
        message: messages.value,
        type: 'success'
      })
    })
    .catch((error) => {
      const { message } = error.response.data
      messages.value = 'Failed to update product,' + message
      emits('sendMessage', {
        message: messages.value,
        type: 'danger'
      })
    })
    .finally(() => {
      loading.value = false
      close() // Close the modal after submission
    })
}

const createOrUpdate = async () => (props.isCreate ? await createProduct() : await updateProduct())

watch(
  () => props.productData,
  () => {
    if (!props.isCreate) {
      for (const key in payload) {
        payload[key] = props.productData[key]
      }
    }
  }
)

watch(() => payload.price, (newValue) => {

  payload.price = formatterRupiah.formatRupiah(newValue.toString());
});




</script>
