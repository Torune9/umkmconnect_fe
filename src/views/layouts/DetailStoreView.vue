<template>
    <detailProductModal :isDetail="isDetail" :data-product="dataProduct" @close="close" />
   <NavBarMain v-if="user.isLogin" />
   <NavBarHome v-else class="bg-white" />
    <LoadingPage :isLoading="isLoading"/>
    <section class="w-full h-full flex flex-col items-center font-poppins gap-1 p-4 ">
        <!-- profile -->
        <div class="h-80 max-sm:h-64 w-full overflow-hidden flex flex-col gap-1 rounded-md">
            
            <div class="w-full flex flex-col justify-center items-center">
                <h4 class="w-full text-center text-6xl font-bold text-white bg-gradient-to-r from-indigo-900 to-main p-5 max-sm:text-2xl ">
                    {{ store.dataAllStore[0].name }}
                </h4>
            </div>

            <div class="w-full h-full rounded-md overflow-hidden ">
                <div class="w-full h-full flex justify-center items-center overflow-hidden relative">
                    <img v-if="store.dataAllStore[0].img"  class="h-full w-full object-cover" :src="store.dataAllStore[0].img" alt="">
                    <div v-else class=" text-9xl">
                        <font-awesome-icon icon="fa-solid fa-store" />
                    </div>
                    <p class="absolute text-white  w-full h-full bg-main/30 backdrop-blur-sm text-center p-10 overflow-auto" >
                        {{ store.dataAllStore[0].description }} Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae, animi!
                    </p>
                </div>
            </div>
        </div>
        <!-- list product -->
        <div  v-if="store.dataAllStore[0].products !== undefined && Object.entries(store.dataAllStore[0].products).length !== 0"  class="w-full h-full pl-28 pr-28 p-2 flex flex-wrap justify-center items-center  gap-2 bg-gradient-to-b from-indigo-900 to-black rounded-t-md border max-md:p-2 ">
            <div class="border h-90 w-60 max-sm:w-full overflow-hidden rounded relative bg-black/50 backdrop-blur-md text-white "
                v-for="product, i of store.dataAllStore[0].products" :key="i">
                <div @click="detailProduct(product)"  class="absolute cursor-pointer z-20 w-full h-full">
                </div>
                <div class="h-40 overflow-hidden flex justify-center items-center ">
                    <picture v-if="product.img">
                        <img :src="product.img" alt="">
                    </picture>
                    <div v-else class="w-full h-full flex justify-center items-center text-4xl bg-slate-50 text-black/40 ">
                        <font-awesome-icon icon="fa-solid fa-image"/>
                    </div>
                </div>
                <!-- products information -->
                <div class="p-2 text-sm w-full flex flex-col gap-y-3">
                    <div class="flex flex-row h-10 w-full items-center">
                        <div class="flex flex-col w-full">
                            <h3 class="font-bold w-full">{{ product.name }}</h3>
                        </div>
                        <h4 class="font-semibold overflow-auto w-full">
                            {{ formatterRupiah.formatPriceToIDR(product.price) }}
                        </h4>
                    </div>
                    <p class="text-[12px] text-justify">
                        {{ product.information.length > 20 ? product.information.slice(0, 30) : product.information }}....
                    </p>
                    <button type="button"  @click="orderProduct(product)"
                        class=" bg-green-700 w-40 h-8 rounded text-white hover:bg-green-500 transition-colors duration-300 z-30">
                        <p v-if="!loading">
                            order
                        </p>
                        <p v-else class="animate-spin">
                            <font-awesome-icon icon="fa-solid fa-spinner"/>
                        </p>
                    </button>
                </div>
            </div>
            
        </div>
        <div v-else class="w-full h-full text-center">
            <h1 class="text-3xl text-black/50 font-bold max-sm:text-lg ">This shop doesn't have any products yet</h1>
        </div>

    </section>
</template>

<script setup>
import NavBarMain from '@/components/navigations/navBarMain.vue';
import NavBarHome from '@/components/navigations/navBarHome.vue';
import detailProductModal from '@/components/modal/detailProduct.vue';
import { storeShop } from '@/stores/storeShop';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import formatterRupiah from '@/service/utils/formatterRupiah';
import LoadingPage from '@/components/util/loadingPage.vue';
import { userStore } from '@/stores/userStore';

const store = storeShop()
const route = useRoute()
const user = userStore()

const isLoading = ref(false),
isDetail = ref(false),
loading = ref(false)
const dataProduct = ref([])

const getDetailStore = async () => {
    isLoading.value = !isLoading.value
    await store.getAllStore(route.params.code)
        // .then(response => {
        //     console.log(response);
        // })
        // .catch(error => {
        //     console.log(error.response);
        // })
        .finally(() => {
            isLoading.value = !isLoading.value
        })
}
const detailProduct = (data) => {
    isDetail.value = !isDetail.value
    dataProduct.value = data
}
const close = (data)=>{
    isDetail.value = data
    dataProduct.value = []
}

const orderProduct = async (product) => {
    console.log(product);
    
    loading.value = !loading.value
    const payload = {
        items : product,
        customer : {
            name : user.userData.username,
            email : user.userData.email
        }
    }

    await store.getTokenTransaction(payload)
    .then(response => {
        const {token} = response
        console.log(response.token);
        window.snap.pay(token);
        
    })
    .catch(error => {
        console.log(error);
        
    })
    .finally(()=>{
        loading.value = !loading.value
    })
    // let phoneNumber = store.dataAllStore[0].phoneNumber;

    // // Pastikan phoneNumber tidak memiliki tanda '+' dan memiliki kode negara
    // if (phoneNumber.startsWith('+')) {
    //     phoneNumber = phoneNumber.substring(1);
    // }

    // // Tambahkan kode negara jika belum ada
    // if (!phoneNumber.startsWith('62')) {
    //     phoneNumber = '62' + phoneNumber;
    // }
    
    // const message = `Halo, saya ingin memesan ${product.name} dengan harga ${formatterRupiah.formatPriceToIDR(product.price)}.`;
    // const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // window.open(whatsappURL, '_blank');
};



onMounted(async () => {
    await getDetailStore()
})
</script>
