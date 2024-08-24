<template>
    <updateHoursOperational :is-update-hours="isUpdateHours" @close="closeUpdateOperational"/>
    <productModal :show-modal-create-prod="showModal" @close="closeModalCreateprod" @sendMessage="acceptMessage"
        :product-data="productData" :is-create="isCreate" />
    <!-- confirm button -->
    <popupConfirm :isConfirm="isShowConfirm" @close="closeConfirm" :id="productId" :productData="productData"
        @sendMessage="acceptMessage" />
    <detailProductModal :isDetail="isDetail" :data-product="dataProduct" @close="close" />
    <MainLayout>
        <template v-slot:body>
            <div v-if="user.isShowStore || store.isShowStore">
                <!-- description store -->
                <section
                    class="mt-16 mb-2 flex justify-center flex-row h-60 p-2 gap-x-2 max-md:flex-col max-md:gap-y-2 ">
                    <div
                        class="p-4 font-poppins w-full flex flex-col justify-center items-center bg-gradient-to-b from-indigo-600 to-red-800 rounded-md text-white relative">
                        <h1 class="font-bold text-center text-4xl max-sm:text-xl">
                            {{ store.dataStore?.name ? store.dataStore?.name.toUpperCase() : user.dataStoreEmployee.name.toUpperCase() }}
                        </h1>
                        <p class=" text-center text-sm">
                            {{ store.dataStore?.description ? store.dataStore?.description : user.dataStoreEmployee.description }}
                        </p>
                        <small
                            class="font-semibold absolute  text-white/50 bottom-2 right-2">code:#{{ store.dataStore.code ? store.dataStore?.code : user.dataStoreEmployee.code }}
                        </small>
                    </div>
                    <div class="w-full  h-full flex justify-center items-center overflow-hidden rounded-md">
                        <img v-if="store.dataStore.img || user.dataStoreEmployee.img"
                            :src="store.dataStore?.img ? store.dataStore.img : user.dataStoreEmployee.img"
                            alt="image store" class="h-full w-full object-cover">
                        <div v-else
                            class=" text-9xl bg-slate-200 w-full h-full flex justify-center items-center text-black/40">
                            <font-awesome-icon icon="fa-solid fa-image" />
                        </div>
                    </div>
                </section>
                <!-- button create -->
                <setion class="p-2 flex flex-row gap-4"
                    v-if="!user.isEmployee || (user.isEmployee && user.userData.role == 'operator')">
                    <button
                        class="bg-green-700 w-48 h-11 rounded text-white font-semibold hover:bg-green-500 duration-300 transition-colors"
                        @click="() => {
                            showModalProd()
                            isCreate = true
                        }">
                        Create Product
                    </button>
                    <button
                        class="bg-red-700 w-48 h-11 rounded text-white font-semibold hover:bg-red-500 duration-300 transition-colors"
                        @click="() => {
                            showUpdateOperational()
                        }">
                        Update Operational Date
                    </button>
                </setion>

                <section v-if="store.currentHours.length !== 0" class="mt-5 bg-white p-4 rounded-lg shadow-md">
                    <h2 class="font-bold text-xl mb-4 text-indigo-700">Operational Hours</h2>
                    <ul class="divide-y divide-gray-200">
                        <li v-for="(hour, index) in store.currentHours" :key="index" class="flex justify-between py-2">
                            <div class="flex items-center">
                                <font-awesome-icon
                                    :icon="hour.is_closed ? 'fa-solid fa-calendar-xmark' : 'fa-solid fa-clock'"
                                    class="text-lg mr-2" :class="hour.is_closed ? 'text-red-500' : 'text-green-500'" />
                                <span class="font-semibold text-gray-700">{{ hour.day_of_week }}</span>
                            </div>
                            <div>
                                <span v-if="!hour.is_closed" class="text-gray-600">
                                    {{ hour.open_time.slice(0, 5) }} - {{ hour.closed_time.slice(0, 5) }}
                                </span>
                                <span v-else class="text-red-500 font-medium">Closed</span>
                            </div>
                        </li>
                    </ul>
                </section>

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
                        <div @click="detailProduct(product)" class="absolute cursor-pointer z-20 w-full h-full">
                        </div>
                        <!-- button confirm -->
                        <button @click="showConfirm(product.id)" type="button"
                            class="absolute top-2 right-2 text-red-600 hover:text-red-500 transition-colors duration-200 z-30">
                            <font-awesome-icon icon="fa-solid fa-rectangle-xmark" size="xl" />
                        </button>
                        <div class="h-40 overflow-hidden ">
                            <picture v-if="product.img != null">
                                <img :src="product.img" class="h-full w-full object-cover" alt="product image">
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
                                </div>
                                <h4 class="font-semibold overflow-auto w-full">
                                    {{ formatterRupiah.formatPriceToIDR(product.price) }}</h4>
                            </div>
                            <p class="text-[12px] text-justify cursor-pointer">
                                {{ product.information.length > 20 ? product.information.slice(0, 30) : product.information }}....
                            </p>
                            <div class="flex flex-row  gap-x-1 items-center w-full">
                                <button type="button" @click="updateProduct(product)"
                                    class=" bg-fuchsia-700 w-full h-8 rounded text-white hover:bg-fuchsia-500 transition-colors duration-300 z-30">
                                    edit
                                </button>
                            </div>
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
import updateHoursOperational from '@/components/modal/updateHoursOperational.vue'
import { storeShop } from '@/stores/storeShop';
import { FwbSpinner } from 'flowbite-vue';
import { onMounted, ref } from 'vue';
import formatterRupiah from '@/service/utils/formatterRupiah';
import { userStore } from '@/stores/userStore';

const store = storeShop()
const user = userStore()

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
    await store.getproducts(store.dataStore?.id ? store.dataStore.id : user.userData.member)
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
const close = (data) => {
    isDetail.value = data
    dataProduct.value = []
}

const isUpdateHours = ref(false)

const showUpdateOperational = () => {
    isUpdateHours.value = !isUpdateHours.value
}

const closeUpdateOperational =async (data) => {
    isUpdateHours.value = data
    await getHourOp()
}


const getHourOp = async () => {
    await store.getHours(store.dataStore.id ? store.dataStore.id : user.dataStoreEmployee.id)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
}
onMounted(async () => {

    await getHourOp()
    if (user.isJoin || store.isShowStore) {

        await getProductsStore()
    }
})

</script>