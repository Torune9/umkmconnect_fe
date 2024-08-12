<template>
    <div 
      :class="{
        'bg-green-100 text-green-900': status === 'success',
        'bg-yellow-100 text-yellow-900': status === 'pending',
        'bg-red-100 text-red-900': status === 'failed',
      }"
      class="transaction-status-page border w-screen h-screen flex flex-col justify-center items-center p-4"
    >
      <h1 v-if="status === 'success'" class="text-4xl font-bold mb-4">Payment Success!</h1>
      <h1 v-else-if="status === 'pending'" class="text-4xl font-bold mb-4">Payment Pending...</h1>
      <h1 v-else-if="status === 'failed'" class="text-4xl font-bold mb-4">Payment Failed</h1>
      
      <p v-if="status === 'success'" class="text-lg text-center mb-4">
        Your payment was successful. Thank you for your purchase!
      </p>
      <p v-else-if="status === 'pending'" class="text-lg text-center mb-4">
        Your payment is pending. Please complete the payment to proceed.
      </p>
      <p v-else-if="status === 'failed'" class="text-lg text-center mb-4">
        Sorry, your payment could not be processed. Please try again later.
      </p>
      
      <router-link to="/user/order" class="text-blue-500 hover:underline">Return to Dashboard</router-link>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const status = route.query.status;
  </script>
  