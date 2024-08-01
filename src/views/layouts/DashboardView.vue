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
                                <bar-chart :chartData="chartData" height="300" />
                            </div>
                        </div>
                    </section>

                    <section class="h-full flex flex-col shadow-md p-4 gap-2">
                        <!-- progress task chart -->
                        <div class="h-full">
                            <pie-chart :chartData="testData" height="300" />
                        </div>
                    </section>

                </section>
                <section>
                    <!-- list category -->
                    <EasyDataTable :headers="headers" :items="items" :rows-per-page="5" :rows-items="[10]"
                        table-class-name="customize-table" class="font-poppins">
                        <template #item-dueDate="{ dueDate }">
                            <button>
                                <font-awesome-icon icon="fa-regular fa-calendar" size="xl" />
                                {{ formatDate(dueDate) }}
                            </button>
                        </template>
                        <template #item-user_task="{ user_task }">
                            <p class="p-1 w-fit bg-indigo-400 rounded">
                                {{ user_task?.username ?? 'unknown' }}
                            </p>
                        </template>
                        <template #item-status="{status}">
                            <p class="ml-2 p-1 text-sm rounded w-fit text-center" :class="getStatusColor(status)">
                                {{ status ?? 'unknown' }}
                            </p>
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
import { recapStore } from '@/stores/recapStore';

const workspace = workspaceStore()
const user = userStore()
const shop = storeShop()
const recap = recapStore()

const storeData = ref({})
const loadingPage = ref(false),
    isLoading = ref(false)

const testData = ref({
    labels: ['Finish', 'Progress', 'Pending','OutDate'],
    datasets: [
        {
            label: 'Task Status',
            backgroundColor: ['#379777', '#03346E', '#F4CE14','#F5004F'],
            data: [0, 0, 0,0] // Placeholder data
        }
    ]
})

const calculateTaskStatus = () => {
    let finish = 0;
    let progress = 0;
    let pending = 0;
    let outdate = 0;


    workspace.tasks.forEach((task) => {
        if (task.status === 'finish') {
            finish++;
        } else if (task.status === 'progress') {
            progress++;
        }else if (task.status === 'pending') {
            pending++;
        }
         else {
            outdate++;
        }
    });

    testData.value.datasets[0].data = [finish, progress,pending,outdate];
}

const chartData = ref({
    labels: ['Income', 'Expenditure', 'Profit', 'Loss'],
    datasets: [
        {
            label: 'Total for the Month',
            backgroundColor: ['#4CAF50', '#FF5733', '#FFC300', '#C70039'],
            data: [0, 0, 0, 0],
        }
    ],
})
const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpenditure = 0;
    let totalProfit = 0;
    let totalLoss = 0;

    dataRecap.value.forEach((item) => {
        totalIncome += parseInt(item.income) || 0;
        totalExpenditure += parseInt(item.expenditure) || 0;

        if (item.profit !== null && item.profit !== undefined) {
            totalProfit += parseInt(item.profit);
        } else {
            totalProfit += parseInt(item.income) - parseInt(item.expenditure);
        }

        if (item.loss !== null && item.loss !== undefined) {
            totalLoss += parseInt(item.loss);
        }
    });

    chartData.value.datasets[0].data = [totalIncome, totalExpenditure, totalProfit, totalLoss];
}

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
const statuses = [
  {
    status: 'finish',
    color: 'text-green-800 bg-green-200'
  },
  {
    status: 'progress',
    color: 'text-blue-600 bg-blue-200'
  },
  {
    status: 'pending',
    color: 'text-yellow-600 bg-yellow-200'
  },
  {
    status: 'out-date',
    color: 'text-red-600 bg-red-200'
  },
]
const getStatusColor = (status) => {
  const foundStatus = statuses.find((s) => s.status === status)
  return foundStatus ? foundStatus.color : 'bg-slate-800 text-slate-200'
}


const dataRecap = ref([])

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

const getFinance = async () => {
    await recap.recapFinance(shop.dataStore?.id ? shop.dataStore.id : user.dataStoreEmployee.id)
        .then(response => {
            dataRecap.value = response.data
            calculateTotals()
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => { })
}


onMounted(async () => {

    if (user.userData.member != null) {
        user.isEmployee = true
    }

    if (user.isEmployee) {
        await getStoreAsEmployee()
    } else {
        await getStore()
    }
    await getWorkspace()
    await getFinance()

    calculateTaskStatus()
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