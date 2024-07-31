<template>
    <CreateOrJoinModal @close="closeModal" :isShowModal="isModalShow" :isShowCreate="isCreate" />
    <LoadingPage :is-loading="loadingPage" />
    <MainLayout>
        <template v-slot:body>
            <CreateOrJoinButton @show-create-store="showCreateStore" @show-join-store="showJoinStore"
                :closePage="!shop.isShowStore" v-if="!shop.isShowStore && !user.isShowStore" />
            <section v-if="shop.isShowStore || user.isShowStore" class="flex flex-col p-8 gap-2">
                <!-- Profile UMKM -->
                <section class="mt-10 flex justify-center">
                    <div class="p-4 font-poppins w-4/5 rounded-md">
                        <h1 class="font-bold text-center text-4xl text-second max-sm:text-xl">
                            {{ storeData.name ?? user.dataStoreEmployee?.name }}
                            <router-link to="/store/profile">
                                <span class="cursor-pointer sm:text-2xl">
                                    <font-awesome-icon icon="fa-solid fa-pen-to-square" size="xs" />
                                </span>
                            </router-link>
                        </h1>
                        <p class=" text-center text-sm">
                            {{ storeData.description ?? user.dataStoreEmployee?.description }}
                        </p>
                    </div>
                </section>
                <br>
                <hr>
                <br>
                <section class="grid md:grid-cols-2 gap-x-4 max-sm:gap-y-6">

                    <section class="p-2 flex items-center justify-center shadow-md">
                        <div class="flex flex-col p-2">
                            <!-- barchart finance -->
                            <div>
                                <bar-chart :chartData="testData" height="300" />
                            </div>
                            <!-- Finance umkm -->
                            <div class="flex flex-wrap justify-center font-bold font-poppins">
                                <div class="shadow-lg text-sm flex flex-col gap-y-5 p-3">
                                    <p>Income</p>
                                    <p class=" font-normal">Rp 1.000.000.000</p>
                                </div>
                                <div class="shadow-lg text-sm flex flex-col gap-y-5 p-3">
                                    <p>Expenditure</p>
                                    <p class=" font-normal">Rp 900.000.000</p>
                                </div>
                                <div class="shadow-lg text-sm flex flex-col gap-y-5 p-3">
                                    <p>Profit & Loss</p>
                                    <p class=" font-normal">Rp 700.000.000/Rp 400.000.000</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="h-full flex flex-col shadow-md p-4 gap-2">
                        <!-- progress task chart -->
                        <div class="h-full">
                            <pie-chart :chartData="testData" height="300" />
                        </div>
                        <!-- list employee -->
                        <div>
                            <ul
                                class="h-full flex items-center justify-center flex-wrap text-sm font-poppins font-bold gap-2">
                                <li class="shadow-md p-1">1.employee</li>
                                <li class="shadow-md p-1">2.employee</li>
                                <li class="shadow-md p-1">3.employee</li>
                                <li class="shadow-md p-1">4.employee</li>
                                <li class="shadow-md p-1">5.employee</li>
                            </ul>
                        </div>
                    </section>

                </section>
                <section>
                    <!-- list category -->
                    <EasyDataTable :headers="headers" :items="items" :rows-per-page="5" :rows-items="[10]"
                        table-class-name="customize-table" class="font-poppins">
                        <template #item-dueDate="{dueDate}">
                            <button>
                                <font-awesome-icon icon="fa-regular fa-calendar" size="xl" />
                                {{ formatDate(dueDate) }}
                            </button>
                        </template>
                        <template #item-user_task="{ user_task }">
                            {{ user_task?.username ?? 'unknown' }}
                        </template>
                    </EasyDataTable>
                </section>
            </section>
        </template>
    </MainLayout>
</template>

<script setup>
import CreateOrJoinButton from '@/components/dashboard/createOrJoinButton.vue';
import CreateOrJoinModal from '@/components/modal/createOrJoinModal.vue';
import LoadingPage from '@/components/util/loadingPage.vue';
import MainLayout from '@/layout/mainLayout.vue';
import { storeShop } from '@/stores/storeShop';
import { userStore } from '@/stores/userStore';
import { workspaceStore } from '@/stores/workspaceStore';

import { onMounted, ref, computed } from 'vue'
import { formatDate } from '@/service/utils/formatDate';
const workspace = workspaceStore()

const user = userStore()
const shop = storeShop()
const storeData = ref({})
const loadingPage = ref(false),
    isLoading = ref(false)



const testData = {
    labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
    datasets: [
        {
            data: [30, 40, 60, 70, 5],
            backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
        },
    ],
};
const headers = [
    {
        text: 'Name',
        value: 'name'
    },
    {
        text: 'Assignee',
        value: 'user_task'
    },
    {
        text: 'Status',
        value: 'status'
    },
    {
        text: 'Due date',
        value: 'dueDate'
    }
]
const items = computed(() => {
    if (workspace.getTasks || user.getTasks) {
        return workspace.getTasks
    } else {
        return workspace.getDataWorkspace.data[0]
    }
})

const getWorkspace = async () => {
    isLoading.value = !isLoading.value
    await workspace.getWorkspace(
        shop.dataStore?.id ?? user.dataStoreEmployee?.id
    )
        .then((response) => {
            workspace.tasks = []
            const { data } = response
            data.forEach((val) => {
                workspace.tasks = [...workspace.tasks, ...val.tasks]
            })
        })
        .catch((error) => console.log(error))
        .finally(() => {
            isLoading.value = !isLoading.value
        })
}

const isModalShow = ref(false),
    isCreate = ref(false)

const closeModal = async (data) => {
    isModalShow.value = data
    if (user.isEmployee) {
        return await getStoreAsEmployee()
    } else {
        if (shop.isShowStore) {

            return await getStore()
        }
    }
}
const showCreateStore = (data) => {
    isModalShow.value = data
    isCreate.value = data
}
const showJoinStore = (data) => {
    isModalShow.value = data
    isCreate.value = !data
}

const getStore = async () => {
    loadingPage.value = !loadingPage.value
    await shop.getStore(user.userData.id)
        .then(response => {
            storeData.value = response.data
        })
        .catch(() => {
            storeData.value = {}
        })
        .finally(() => loadingPage.value = !loadingPage.value)
}

const getStoreAsEmployee = async () => {
    await user.getStoreAsEmployee(user.userData.email)
        // .then(response => console.log(response))
        // .catch(error => console.log(error))
}

onMounted(async () => {
    await getWorkspace()

    if (user.userData.member != null) {
        user.isEmployee = true
    }

    if (user.isEmployee) {
        return await getStoreAsEmployee()
    } else {
        return await getStore()
    }

})


</script>

<style scoped>
.customize-table {
    --easy-table-header-font-size: 16px;
    --easy-table-body-row-font-size: 14px;
    --easy-table-header-background-color: #3652AD;
    --easy-table-header-font-color: #ffffffec;

    --easy-table-body-row-font-color: #141E46;
}
</style>