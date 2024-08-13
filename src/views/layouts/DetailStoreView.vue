<template>
    <detailProductModal :isDetail="isDetail" :data-product="dataProduct" @close="close" />
    <checkoutModal :isCheckout="isCheckout" :data-product="dataProduct" @close="close" @confirmCheckout="orderProduct" />
    <SideBar class="fixed h-full w-full max-md:z-50 md:hidden" @click="sideBar(false)" v-if="dataSide" />
    <NavBarMain v-if="user.isLogin" @showSidebar="sideBar" />
    <NavBarHome v-else class="bg-white" />
    <LoadingPage :isLoading="isLoading" />
    <section class="w-full h-full flex flex-col items-center font-poppins gap-1 p-4 ">
      <!-- profile -->
      <div class="h-80 max-sm:h-64 w-full overflow-hidden flex flex-col gap-1 rounded-md">
        <div class="w-full flex flex-col justify-center items-center">
          <h4 class="w-full text-center text-6xl font-bold text-white bg-gradient-to-r from-indigo-900 to-main p-5 max-sm:text-2xl">
            {{ store.dataAllStore[0].name }}
          </h4>
        </div>
        <div class="w-full h-full rounded-md overflow-hidden">
          <div class="w-full h-full flex justify-center items-center overflow-hidden relative">
            <img v-if="store.dataAllStore[0].img" class="h-full w-full object-cover" :src="store.dataAllStore[0].img" alt="">
            <div v-else class="text-9xl">
              <font-awesome-icon icon="fa-solid fa-store" />
            </div>
            <p class="absolute text-white w-full h-full bg-main/30 backdrop-blur-sm text-center p-10 overflow-auto">
              {{ store.dataAllStore[0].description }}
            </p>
          </div>
        </div>
      </div>
      <!-- list product -->
      <div v-if="store.dataAllStore[0].products !== undefined && Object.entries(store.dataAllStore[0].products).length !== 0"
           class="w-full h-full pl-28 pr-28 p-2 flex flex-wrap justify-center items-center gap-2 bg-gradient-to-b from-indigo-900 to-black rounded-t-md border max-md:p-2">
        <div class="border h-90 w-60 max-sm:w-full overflow-hidden rounded relative bg-black/50 backdrop-blur-md text-white"
             v-for="product, i of store.dataAllStore[0].products" :key="i">
          <div @click="detailProduct(product)" class="absolute cursor-pointer z-20 w-full h-full"></div>
          <div class="h-40 overflow-hidden flex justify-center items-center">
            <picture v-if="product.img">
              <img :src="product.img" alt="">
            </picture>
            <div v-else class="w-full h-full flex justify-center items-center text-4xl bg-slate-50 text-black/40">
              <font-awesome-icon icon="fa-solid fa-image" />
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
            <div class="w-full flex flex-row gap-x-1 items-center">
              <button type="button" @click="checkout(product)"
                      :class="{'bg-green-700': !loading[i], 'bg-gray-500': loading[i]}"
                      class="w-full h-8 rounded text-white hover:bg-green-500 transition-colors duration-300 z-30">
                <p v-if="!loading[i]">Order</p>
                <p v-else class="animate-spin">
                  <font-awesome-icon icon="fa-solid fa-spinner" />
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="w-full h-full text-center">
        <h1 class="text-3xl text-black/50 font-bold max-sm:text-lg">This shop doesn't have any products yet</h1>
      </div>
    </section>
  </template>
  
  <script setup>
  import NavBarMain from '@/components/navigations/navBarMain.vue';
  import NavBarHome from '@/components/navigations/navBarHome.vue';
  import detailProductModal from '@/components/modal/detailProduct.vue';
  import checkoutModal from '@/components/modal/chekoutModal.vue';
  import SideBar from '@/components/navigations/sideBar.vue';
  import { storeShop } from '@/stores/storeShop';
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import formatterRupiah from '@/service/utils/formatterRupiah';
  import LoadingPage from '@/components/util/loadingPage.vue';
  import { userStore } from '@/stores/userStore';
  
  const store = storeShop();
  const route = useRoute();
  const router = useRouter();
  const user = userStore();
  
  const isLoading = ref(false),
    isDetail = ref(false),
    isCheckout = ref(false),
    loading = ref([]),
    dataSide = ref(false);
  const dataProduct = ref([]);
  
  const getDetailStore = async () => {
    isLoading.value = true;
    await store.getAllStore(route.params.code)
      .finally(() => {
        isLoading.value = false;
      });
  };
  
  const detailProduct = (data) => {
    isDetail.value = true;
    dataProduct.value = data;
  };
  
  const checkout = (product) => {
    isCheckout.value = true;
    dataProduct.value = product;
  };
  
  const close = () => {
    isCheckout.value = false;
    isDetail.value = false;
    dataProduct.value = [];
  };
  
  const sideBar = (data) => {
    dataSide.value = data;
  };
  
  const orderProduct = async (payload) => {
    if (user.isLogin) {
      const productIndex = store.dataAllStore[0].products.findIndex(p => p.id === payload.product.id);
      loading.value[productIndex] = true;
  
      const checkoutPayload = {
        items: payload.product,
        quantity: payload.quantity,
        totalPrice: payload.totalPrice,
        customer: {
          name: payload.name,
          email: payload.email,
        },
      };
  
      try {
        const response = await store.getTokenTransaction(checkoutPayload);
        const { token } = response;
  
        window.snap.pay(token, {
          onSuccess: function (result) {
            console.log('Payment success!', result);
            router.push({ path: '/transaction/status', query: { status: 'success' } });
          },
          onPending: function (result) {
            console.log('Payment pending...', result);
            router.push({ path: '/transaction/status', query: { status: 'pending' } });
          },
          onError: function (result) {
            console.log('Payment failed!', result);
            router.push({ path: '/transaction/status', query: { status: 'failed' } });
          },
          onClose: function () {
            router.replace('/user/order');
          }
        });
  
      } catch (error) {
        console.log('Error during transaction:', error);
      } finally {
        loading.value[productIndex] = false;
      }
    } else {
      return router.replace('/user/login');
    }
  };
  
  onMounted(async () => {
    await getDetailStore();
  });
  </script>
  