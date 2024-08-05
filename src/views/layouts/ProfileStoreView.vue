<template>
    <MainLayout>
        <template v-slot:body>
            <productModal :show-modal-create-prod="showModal" @close="closeModalCreateprod" @sendMessage="acceptMessage"
                :product-data="productData" :is-create="isCreate" />
            <!-- confirm button -->
            <popupConfirm :isConfirm="isShowConfirm" @close="closeConfirm" :id="productId" :productData="productData"
                @sendMessage="acceptMessage" />
            <detailProductModal :isDetail="isDetail" :data-product="dataProduct" @close="close" />
            <div v-if="userStore().isShowStore || store.isShowStore">
                <!-- description store -->
                <section
                    class="mt-16 mb-2 flex justify-center flex-row h-60 p-2 gap-x-2 max-md:flex-col max-md:gap-y-2 ">
                    <div
                        class="p-4 font-poppins w-full flex flex-col justify-center items-center bg-gradient-to-b from-indigo-600 to-red-800 rounded-md text-white relative">
                        <h1 class="font-bold text-center text-4xl max-sm:text-xl">
                            {{ store.dataStore?.name ? store.dataStore?.name.toUpperCase() : userStore().dataStoreEmployee.name.toUpperCase() }}
                        </h1>
                        <p class=" text-center text-sm">
                            {{ store.dataStore?.description ? store.dataStore?.description : userStore().dataStoreEmployee.description }}
                        </p>
                        <small
                            class="font-semibold absolute  text-white/50 bottom-2 right-2">code:#{{ store.dataStore.code ? store.dataStore?.code : userStore().dataStoreEmployee.code }}
                        </small>
                    </div>
                    <div class="w-full  h-full flex justify-center items-center overflow-hidden rounded-md">
                        <img v-if="store.dataStore.img || userStore().dataStoreEmployee.img" :src="`${URL}source/image/${store.dataStore?.img ? store.dataStore.img : userStore().dataStoreEmployee.img}`"
                            alt="image store" class="h-full w-full object-cover">
                            <div v-else class=" text-9xl bg-slate-200 w-full h-full flex justify-center items-center text-black/40">
                        <font-awesome-icon icon="fa-solid fa-image" />
                    </div>
                    </div>
                </section>
                <!-- button create -->
                <setion class="p-2">
                    <button
                        class="bg-green-700 w-48 h-11 rounded text-white font-semibold hover:bg-green-500 duration-300 transition-colors"
                        @click="() => {
                            showModalProd()
                            isCreate = true
                        }">
                        Create Product
                    </button>
                </setion>
                <!-- alert -->
                <section class="w-full flex justify-center items-center mt-1" v-if="infoMessage">
                    <div class="w-fit p-4 rounded-md relative"
                        :class="infoType == 'success' ? 'bg-green-200' : 'bg-red-200'">
                        <small :class="infoType == 'success' ? 'text-green-800' : 'text-red-800'">
                            {{ infoMessage }}
                        </small>
                        <button type="button" @click="infoMessage = ''" class="absolute right-1 top-0 text-red-600">
                            <font-awesome-icon icon="fa-solid fa-circle-xmark" />
                        </button>
                    </div>
                </section>
                <!-- List product -->
                <section class="w-full border-t flex justify-center items-center flex-wrap p-2 font-poppins gap-2 mt-5"
                    v-if="!loading && Object.entries(store.dataProducts).length != 0">
                    <!-- card wrapper -->
                    <div class="w-60 h-90 overflow-hidden rounded relative  shadow-md"
                        v-for="product, index of store.dataProducts" :key="index">
                        <div @click="detailProduct(product)"  class="absolute cursor-pointer z-20 w-full h-full">
                        </div>
                        <!-- button confirm -->
                        <button @click="showConfirm(product.id)" type="button"
                            class="absolute top-2 right-2 text-red-600 hover:text-red-500 transition-colors duration-200 z-30">
                            <font-awesome-icon icon="fa-solid fa-rectangle-xmark" size="xl" />
                        </button>
                        <div class="h-40 overflow-hidden ">
                            <picture v-if="product.img != null">
                                <img :src="`${URL}source/image/${product.img}`" class="h-full w-full object-cover"
                                    alt="product image">
                            </picture>
                            <div v-else class="w-full h-full flex justify-center items-center bg-slate-100">
                                <font-awesome-icon icon="fa-solid fa-image" size="2xl" />
                            </div>
                        </div>

                        <!-- products information -->
                        <div class="p-2 text-sm w-full flex flex-col gap-y-3">
                            <div class="flex flex-row h-10 w-full items-center">
                                <div class="flex flex-col w-full">
                                    <h3 class="font-bold w-full">{{ product.name }}</h3>
                                    <p class="text-[12px] text-justify">
                                        stock : {{ product.stock }}
                                    </p>
                                </div>
                                <h4 class="font-semibold overflow-auto w-full">
                                    {{ formatterRupiah.formatPriceToIDR(product.price) }}</h4>
                            </div>
                            <p class="text-[12px] text-justify cursor-pointer">
                                {{ product.information.length > 20 ? product.information.slice(0, 30) : product.information }}....
                            </p>
                            <button type="button" @click="updateProduct(product)"
                                class=" bg-fuchsia-700 w-40 h-8 rounded text-white hover:bg-fuchsia-500 transition-colors duration-300 z-30">
                                edit
                            </button>
                        </div>
                    </div>
                    <!-- laoding page -->
                </section>
                <div v-if="loading" class="flex justify-center items-center w-full h-96">
                    <FwbSpinner size="12" color="purple" />
                </div>
                <div v-if="!loading && Object.entries(store.dataProducts).length == 0"
                    class="flex justify-center items-center w-full h-96">
                    <h1 class="text-3xl font-bold text-black/20 text-center max-md:text-xl ">
                        Don't have any products at all
                    </h1>
                </div>
            </div>
            <div v-else class="w-full h-screen flex justify-center items-center">
                <h1 class="text-4xl max-md:text-2xl  max-sm:text-xl font-bold text-black/40 text-center">
                    you have not created or joined a shop
                </h1>
            </div>
        </template>
    </MainLayout>
</template>

<script setup>
import productModal from '@/components/modal/productModal.vue';
import detailProductModal from '@/components/modal/detailProduct.vue';
import popupConfirm from '@/components/util/popupConfirm.vue';
import MainLayout from '@/layout/mainLayout.vue';
import { storeShop } from '@/stores/storeShop';
import { FwbSpinner } from 'flowbite-vue';
import { onMounted, ref } from 'vue';
import formatterRupiah from '@/service/utils/formatterRupiah';
import { userStore } from '@/stores/userStore';

const URL = import.meta.env.VITE_APP_BASE_URL

const store = storeShop()

const productData = ref(null)
const dataProduct = ref([])

const showModal = ref(false),
    loading = ref(false),
    isShowConfirm = ref(false),
    isCreate = ref(false),
    isDetail = ref(false)
const productId = ref(),
    infoMessage = ref(''),
    infoType = ref('')

const showModalProd = () => {

    showModal.value = !showModal.value
}
const closeModalCreateprod = async (data) => {
    showModal.value = data
    // if (Object.entries(store.dataProducts) !== 0) return
    await getProductsStore()
}
const acceptMessage = ({ message, type }) => {
    infoMessage.value = message
    infoType.value = type
}

const getProductsStore = async () => {
    loading.value = true
    await store.getproducts(store.dataStore?.id ? store.dataStore.id : userStore().userData.member)
        .then(response => {
            const { products } = response.data
            store.dataProducts = products
        })
        // .catch(error => {
        //     console.log(error);
        // })
        .finally(() => loading.value = !loading.value)
}

const updateProduct = (data) => {
    showModalProd()
    productData.value = data
    isCreate.value = false
}

const showConfirm = (id) => {
    productId.value = id
    isShowConfirm.value = !isShowConfirm.value
}

const closeConfirm = async (data) => {
    isShowConfirm.value = !data
    await getProductsStore()
}

const detailProduct = (data) => {
    isDetail.value = !isDetail.value
    dataProduct.value = data
}
const close = (data)=>{
    isDetail.value = data
    dataProduct.value = []
}

onMounted(async () => {
    if (userStore().isJoin || store.isShowStore) {

        await getProductsStore()
    }
})

</script>