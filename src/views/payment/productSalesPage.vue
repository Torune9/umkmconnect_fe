<template>
    <LoadingPage :isLoading="isLoading" />
    <MainLayout>
      <template v-slot:body>
        <main class="h-screen w-full flex flex-col mt-20 font-poppins p-4 gap-2">
          <h1 class="w-full text-center text-3xl font-bold">
            SALES PRODUCT
          </h1>
          <div class="relative w-1/2">
            <input
            type="text"
            v-model="searchQuery"
            placeholder="Search orders..."
            class="mb-4 px-4 py-2 rounded w-full max-sm:w-full pl-8 font-poppins"
          />
         <p class="absolute top-2 left-2 text-black/50">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass"/>
         </p>
  
          </div>
          <h1 v-if="filteredOrders.length === 0" class="text-center">
            No orders available.
          </h1>
          
          <div v-else class="relative overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-separate border-spacing-y-2">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-4">Order Id</th>
                  <th scope="col" class="px-6 py-4">Name</th>
                  <th scope="col" class="px-6 py-4">Quantity</th>
                  <th scope="col" class="px-6 py-4">Total Price</th>
                  <th scope="col" class="px-6 py-4">Status</th>
                  <th scope="col" class="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer font-semibold"
                  v-for="data, i of filteredOrders"
                  :key="i"
                  :class="{
                    'bg-green-200 text-green-800 hover:bg-green-100': data.status === 'settlement',
                    'bg-red-200 text-red-800 hover:bg-red-100': data.status === 'failed',
                    'bg-orange-200 text-orange-800 hover:bg-orange-100': data.status === 'pending',
                    'bg-purple-200 text-purple-800 hover:bg-purple-100': data.status === 'cancelled',
                    'bg-gray-200 text-gray-800 hover:bg-gray-50': !data.status || data.status === 'not-paid'
                  }"
                >
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {{ data.order_id }}
                  </th>
                  <td class="px-6 py-4">{{ data.name }}</td>
                  <td class="px-6 py-4">{{ data.quantity }}</td>
                  <td class="px-6 py-4">{{ formatterRupiah.formatPriceToIDR(data.total_price) }}</td>
                  <td class="px-6 py-4">{{ data.status ? data.status : 'not-paid' }}</td>
                  <td class="px-6 py-4">{{ formatDate(data.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </template>
    </MainLayout>
  </template>
  
    
  <script setup>
  import LoadingPage from '@/components/util/loadingPage.vue';
  import MainLayout from '@/layout/mainLayout.vue';
  import { storeShop } from '@/stores/storeShop';
  import { onMounted, ref, computed } from 'vue';
  import { formatDate } from '@/service/utils/formatDate';
import formatterRupiah from '@/service/utils/formatterRupiah';
  
  const store = storeShop();
  
  const datas = ref([]);
  const searchQuery = ref('');
  const isLoading = ref(false);
  
  const getProductSales = async () => {
    isLoading.value = !isLoading.value;
  
    await store.getProductSales(store.dataStore.id)
      .then(response => {
        console.log(response);
        
        datas.value = response.data;
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        isLoading.value = !isLoading.value;
      });
  };
  
  const filteredOrders = computed(() => {
    if (!searchQuery.value) {
      return datas.value;
    }
    const query = searchQuery.value.toLowerCase();
    
    return datas.value.filter(order => {
      
      return (
        order.order_id.toLowerCase().includes(query) ||
        order.name.toLowerCase().includes(query)
      );
    });
  });
  
  onMounted(async () => {
    await getProductSales();
  });
  </script>
  
    