<template>

  <homeNavbar/>
  
  <!-- konten/content -->

  <main class="h-full w-full flex flex-col p-8  bg-gradient-to-r from-homeMain to-homeSec text-homeThird gap-y-10">
    <div class="mt-10 h-96 grid sm:grid-cols-2 overflow-hidden rounded max-sm:grid-rows-2">
      <div class="flex flex-col justify-center items-center text-xl font-poppins">
        <h1 class="font-inter font-bold text-slate-400 md:text-5xl">Selamat Datang</h1>
        <h1 class="text-slate-500 text-center">Mengelola Tugas UMKM dengan Mudah dan Efisien</h1>
      </div>
      <div class="w-full overflow-hidden">
        <img src="/laptop.jpg" alt="laptop" class=" object-cover h-full w-full">
      </div>
    </div>
    <div class="md:pl-48 md:pr-48">
      <div class="flex justify-center flex-col gap-2">
        <h1 class="font-black text-2xl font-inter text-center text-slate-400">Tentang Kami</h1>
        <p class="text-justify font-roboto">
          {{ datas.about }}
        </p>
      </div>
      <br><hr><br>
      <div class="flex flex-col gap-2">
        <h1 class="font-bold text-2xl font-inter text-center text-slate-400">Features</h1>
        <div class="grid grid-cols-5 gap-2 max-sm:flex max-sm:flex-wrap">
          <div class="bg-slate-500/5 shadown-md p-2 rounded flex justify-center items-center flex-col col-span-2">
            <h1 class="text-lg text-yellow-300 font-bold font-poppins">1.Workspace</h1>
            <p class="text-justify">{{ datas.workspace }}</p>
          </div>
          <div class="bg-slate-500/5 shadown-md p-2 rounded flex justify-center items-center flex-col col-start-4 col-span-2 row-span-2">
            <h1 class="text-lg text-green-400 font-bold font-poppins">2.Recap Finance</h1>
            <p class="text-justify">{{ datas.finance }}</p>
          </div>
          <div class="bg-slate-500/5 shadown-md p-2 rounded flex justify-center items-center flex-col col-start-2 row-start-2 col-span-2">
            <h1 class="text-lg text-lime-500 font-bold font-poppins">3.Recap Inventory</h1>
            <p class="text-justify">{{ datas.inventory }}</p>
          </div>
          <div class="bg-slate-500/5 shadown-md p-2 rounded flex justify-center items-center flex-col row-start-3 col-start-1 col-span-5">
            <h1 class="text-lg text-rose-500 font-bold font-poppins">4.Manage employee</h1>
            <p class="text-justify">{{ datas.employee }}</p>
          </div>
  
        </div>
      </div>
    </div>
  </main>
  
  <!-- footer -->

  <footer class="w-full bg-homeMain h-12 flex justify-center items-center">
    <h1 class="text-center font-inter font-semibold text-sm text-homeThird/40">&copy;2024 UMKMCONNECT</h1>
  </footer>

</template>

<script setup>
import homeNavbar from '../components/navigations/navBarHome.vue'
const datas = {
  about : 
    "Kami dengan bangga memperkenalkan Sistem Manajemen Proyek UMKM, sebuah solusi terpadu yang dirancang untuk membantu para pelaku UMKM mengelola berbagai aspek bisnis mereka dengan lebih efisien. Sistem ini memungkinkan Anda untuk mengelola tugas, merekap keuangan, mengontrol inventaris barang, dan mengelola karyawan dalam satu platform yang mudah digunakan. Dengan fitur manajemen tugas yang cukup baik, Anda dapat mengatur dan melacak semua pekerjaan bisnis Anda, menetapkan tanggung jawab, serta memantau kemajuan secara real-time, memastikan operasional bisnis berjalan lancar dan efisien."
  ,
  workspace : "Workspace adalah area kerja virtual yang memungkinkan pengguna untuk membuat, mengorganisir, dan mengelola tugas-tugas terkait proyek. Dalam workspace, pengguna dapat menambahkan anggota tim, menetapkan tugas, menetapkan tenggat waktu, dan melacak progres.",
  finance : " Recap Keuangan adalah fitur yang menyediakan ringkasan dan pelacakan semua transaksi keuangan yang terkait dengan proyek. Ini mencakup pencatatan pendapatan, pengeluaran.",
  inventory : "Inventory adalah fitur yang memungkinkan pengguna untuk mengelola dan melacak persediaan barang yang dibutuhkan untuk proyek. Fitur ini membantu dalam pengelolaan stok barang, pembelian, dan pengeluaran barang.",
  employee : "Recap Karyawan adalah fitur yang menyediakan ringkasan informasi mengenai karyawan yang terlibat dalam proyek. Ini mencakup posisi karyawan, tugas yang telah diselesaikan, dan kinerja karyawan."
}

</script>