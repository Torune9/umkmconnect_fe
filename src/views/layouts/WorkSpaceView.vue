<template>
  <TaskModal :isShow="showModalCreate" @close="closeModalCreate" :isWorkspace="isWorkspace" :isTask="isTask" />
  <MainLayout>
    <template v-slot:body>

      <main class="p-8 mt-10 h-screen">
        <section v-if="
          !workspace.isWorkspace && user.getDataWorkspace
        " class="h-full flex flex-col justify-center items-center gap-y-3">
          <h1 class="text-3xl font-black text-slate-400 max-md:text-2xl max-sm:text-xl">
            Do'nt Have Any Workspace...
          </h1>
          <button type="button" @click="showCreateModalWork"
            class="border rounded p-2 bg-green-400 hover:bg-green-500 transition-all duration-300 text-white font-bold text-sm">
            Add Workspace
          </button>
        </section>

        <section v-else class="flex flex-col gap-y-3">
          <!-- Button cretae -->
          <section v-if="route.params.id">
            <button
              class="border w-full h-12 p-2 rounded font-poppins hover:bg-blue-200 hover:border-none transition-all duration-300 hover:text-white font-bold"
              @click="showCreateModalTask">
              Task Create
            </button>
          </section>
          <!-- Main Table -->
          <section v-if="!Object.entries(items).length == 0">
            <div class="flex flex-row items-center mb-2 relative">
              <label for="search" class="absolute left-2">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
              </label>
              <input v-model="search" class="border outline-none rounded p-2 pl-8 w-4/5" placeholder="Task search..."
                type="text" name="search" id="search" />
            </div>
            <div class="relative" v-if="!Object.entries(items).length == 0">
              <EasyDataTable :rows-per-page="7" :rows-items="[4, 7]" :search-value="search" show-index
                :loading="isLoading" :headers="headers" :items="items" table-class-name="cust">
                <template #item-user_task="{ id, user_task, user_assignment }">
                  <FwbDropdown text="employee" close-inside>
                    <div class="w-52 flex flex-col border rounded">
                      <button v-if="store.dataStore?.employees?.length == 0"
                        class="border bg-slate-200  font-semibold  text-black/50 text-sm h-8 ">
                        Employee not found
                      </button>

                      <button v-else @click="setUser(id, user.id ?? userStore().userData.id)"
                        class="border text-sm h-8 hover:bg-slate-100 duration-300 transition-colors"
                        v-for="(user, index) of store.dataStore.employees ?? [1]" :key="index">
                        {{ user.username ?? userStore().userData.username }}
                      </button>
                    </div>
                  </FwbDropdown>
                  <span class="bg-indigo-300 rounded p-2 text-indigo-900 font-semibold ml-2 inline-block max-w-fit">
                    <span class="text-green-800 font-normal">
                      assign to:
                    </span>
                    {{ user_task?.username ?? user_assignment?.username ?? 'unknown' }}
                  </span>
                </template>
                <template #item-status="{ id, status, dueDate }">
                  <FwbDropdown text="status" close-inside>
                    <div class="w-52 flex flex-col border rounded">
                      <button @click="setStatus(id, status.status)"
                        class="border text-sm h-8 hover:bg-slate-100 duration-300 transition-colors"
                        :class="[status.color]" v-for="(status, index) of statuses" :key="index">
                        {{ status.status }}
                      </button>
                    </div>
                  </FwbDropdown>
                  <p class="ml-2 p-1 text-sm rounded w-16 text-center inline-block" :class="getStatusColor(status)">
                    {{ status ?? 'unknown' }}
                  </p>
                  <span v-if="new Date(dueDate) < date"
                    class="bg-red-200 text-red-800 ml-2  p-1 rounded-lg text-center ">
                    out-date
                  </span>
                </template>
                <template #item-dueDate="{ dueDate }">
                  <button>
                    <font-awesome-icon icon="fa-regular fa-calendar" size="xl" />
                    {{ formatDate(dueDate) }}
                  </button>
                </template>
                <template #item-id="{ id }">
                  {{ '#' + id }}
                </template>
              </EasyDataTable>
            </div>
          </section>
          <!-- Radio Option -->
          <section v-if="!Object.entries(items).length == 0"
            class="flex justify-between flex-row items-center flex-wrap p-2 border rounded">
            <div class="flex gap-x-5 max-md:text-sm">
              <div class="flex items-center me-4 gap-2" v-for="status, i of radioOption" :key="i">
                <input @change="getWorkspaceByStatus" type="radio" name="status" :id="i" :value="status.value"
                  v-model="infoStatus" :class="status.class" class="cursor-pointer">
                <label :for="i" class="cursor-pointer">{{ status.name }}</label>
              </div>
            </div>
          </section>
          <!--Second Table  -->
          <section v-if="!Object.entries(items).length == 0">
            <EasyDataTable :rows-per-page="7" :rows-items="[4, 7]" :headers="headers" :items="taskByStatus"
              table-class-name="cust2" :loading="isLoadingByStatus">
              <template #item-status="{ status, dueDate }">
                <div class=" flex flex-row">
                  <p class="ml-2 p-1 text-sm rounded w-16 text-center" :class="getStatusColor(status)">
                    {{ status ?? 'unknown' }}
                  </p>
                  <span v-if="new Date(dueDate) < date"
                    class="bg-red-200 text-red-800 ml-2 p-1 rounded-lg text-center ">
                    out-date
                  </span>
                </div>
              </template>
              <template #item-user_task="{ user_task }">
                {{ user_task?.username ?? 'unknown' }}
              </template>
              <template #item-dueDate="{ dueDate }">
                <button>
                  <font-awesome-icon icon="fa-regular fa-calendar" size="xl" />
                  {{ formatDate(dueDate) }}
                </button>
              </template>
              <template #item-id="{ id }">
                {{ '#' + id }}
              </template>
            </EasyDataTable>
          </section>

        </section>

        <section v-if="workspace.tasks.length == 0 && workspace.isWorkspace"
          class="h-full flex flex-col justify-center items-center gap-y-3">
          <h1 class="text-3xl font-black text-slate-400 max-md:text-2xl max-sm:text-xl text-center">
            Don't have any mission yet? <span class="text-orange-400">please create</span>
          </h1>
        </section>

      </main>
    </template>
  </MainLayout>
</template>

<script setup>
import TaskModal from '@/components/modal/taskModal.vue'
import MainLayout from '@/layout/mainLayout.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { workspaceStore } from '@/stores/workspaceStore'
import { storeShop } from '@/stores/storeShop'
import { useRoute, useRouter } from 'vue-router'
import { FwbDropdown } from 'flowbite-vue'
import { userStore } from '@/stores/userStore'
import { formatDate } from '@/service/utils/formatDate'

const workspace = workspaceStore()
const store = storeShop()
const user = userStore()
const route = useRoute()
const router = useRouter()
const date = new Date()

const isWorkspace = ref(false),
  isTask = ref(false),
  showModalCreate = ref(false),
  isLoading = ref(false),
  isLoadingByStatus = ref(false)

const search = ref('')

const infoStatus = ref('')
const taskByStatus = ref([])

const headers = computed(() => [
  { text: 'Name', value: 'name' },
  { text: 'Assigne', value: 'user_task' },
  { text: 'Status', value: 'status' },
  { text: 'Due date', value: 'dueDate' },
  { text: 'ID', value: 'id' }
])

const items = computed(() => {
  if (workspace.getTasks || store.getTasks) {
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

const radioOption = [
  {
    name: 'All',
    value: '',
    class: "w-4 h-4 text-slate-600 bg-gray-100 border-gray-300 focus:ring-slate-500 dark:focus:ring-slate-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600",
    isChcked: true
  },
  {
    name: 'Finish',
    value: 'finish',
    class: "w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
  },
  {
    name: 'Progress',
    value: 'progress',
    class: "w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
  },
  {
    name: 'Pending',
    value: 'pending',
    class: "w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
  },
  {
    name: 'Out Date',
    value: 'out-date',
    class: "w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
  }
]

const getStatusColor = (status) => {
  const foundStatus = statuses.find((s) => s.status === status)
  return foundStatus ? foundStatus.color : 'bg-slate-800 text-slate-200'
}

const showCreateModalTask = () => {
  showModalCreate.value = !showModalCreate.value
  isTask.value = !isTask.value
}

const showCreateModalWork = () => {
  showModalCreate.value = !showModalCreate.value
  isWorkspace.value = !isWorkspace.value
}

const closeModalCreate = async (data) => {
  showModalCreate.value = !data
  isTask.value = false
  isWorkspace.value = false
  if (route.params.id == '') {
    await getWorkspace()
  } else {
    await getWorkspaceByStatus()
    router.replace('/workspace')
  }
}

const getWorkspace = async () => {
  isLoading.value = !isLoading.value
  await workspace
    .getWorkspace(store.dataStore?.id ?? user.dataStoreEmployee?.id)
    .then((response) => {
      workspace.tasks = []
      const { data } = response
      data.forEach((val) => {
        workspace.tasks = [...workspace.tasks, ...val.tasks]
      })
    })
    // .catch((error) => console.log(error))
    .finally(() => {
      isLoading.value = !isLoading.value
    })
}
const getWorkspaceByStatus = async () => {
  isLoadingByStatus.value = !isLoadingByStatus.value
  await workspace.getWorkspaceByStatus(store.dataStore?.id ?? user.dataStoreEmployee?.id, infoStatus.value)
    .then(response => {
    taskByStatus.value =   response.data.reduce((acc, current) => {
        return acc.concat(current.tasks);
      }, [])
    })
    // .catch(error => {
    //   console.log(error);
    // })
    .finally(() => {
      isLoadingByStatus.value = !isLoadingByStatus.value
    })
}

const setStatus = async (id, status) => {
  return await workspace
    .setStatus(id, status)
    // .then((response) => console.log(response))
    // .catch((error) => console.log(error))
    .finally(async () => {
      await getWorkspace()
      await getWorkspaceByStatus()
    })
}
const setUser = async (id, userId) => {
  return await workspace
    .setUser(id, userId)
    // .then((response) => console.log(response))
    // .catch((error) => console.log(error))
    .finally(async () => {
      await getWorkspace()
      await getWorkspaceByStatus()
    })
}
const getStoreAsEmployee = async () => {
  await user
    .getStoreAsEmployee(user.userData.email)
    .then((response) => {
      workspace.tasks = []
      const {
        members: { workspaces }
      } = response.data
      workspaces.forEach((val) => {
        workspace.tasks = [...workspace.tasks, ...val.tasks]
      })
    })
    // .catch((error) => console.log(error))
}

watch(
  () => route.path,
  async () => {
    if (route.params.id == '') {
      if (Object.entries(user.dataStoreEmployee).length != 0) {
        await getStoreAsEmployee()
      } else {
        await getWorkspace()
      }
    }
  }
)

watch(() => user.getDataWorkspace, () => {
  if (Object.entries(user.getDataWorkspace).length !== 0) {
    workspace.isWorkspace = true
  }
})

onMounted(async () => {
  infoStatus.value = ''
  if (Object.entries(user.dataStoreEmployee).length != 0) {
    await getStoreAsEmployee()
  } else {
    await getWorkspace()
  }
  await getWorkspaceByStatus()
})
</script>

<style scoped>
.cust {
  --easy-table-body-item-padding: 5px;
  --easy-table-header-font-size: 16px;
  --easy-table-body-row-font-size: 14px;
  --easy-table-header-background-color: #3652AD;
  --easy-table-header-font-color: #ffffffec;

  --easy-table-body-row-font-color: #141E46;
}

.cust2 {
  --easy-table-body-item-padding: 5px;
  --easy-table-header-font-size: 16px;
  --easy-table-body-row-font-size: 14px;
  --easy-table-header-background-color: #36ad91;
  --easy-table-header-font-color: #ffffffec;

  --easy-table-body-row-font-color: #141E46;
}
</style>
