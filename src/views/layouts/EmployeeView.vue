<template>
    <MainLayout>
        <LoadingPage :is-loading="isLoading" />
        <template v-slot:body>
            <section class="p-8 mt-10 flex flex-col gap-y-2 font-poppins">
                <h1 class="text-2xl font-bold text-center border-b p-1">List Employee</h1>
                <h1 class="w-full text-center rounded relative p-1" v-if="info.message" :class="info.type == 'danger' ? 'bg-red-300 border border-red-600 text-red-700' : 'bg-green-300 border border-green-600 text-green-700'">
                   <small>
                    {{ info.message }}
                   </small>
                   <button type="button" @click="info.message = ''" class="absolute -top-1 -right-1">
                        <font-awesome-icon icon="fa-solid fa-circle-xmark"/>
                   </button>
                </h1>
                <div class="flex flex-wrap gap-x-2 justify-center gap-y-2 max-sm:p-4" v-if="employees.length !== 0">
                    <div v-for="(employee, i) of employees" :key="i" class="rounded overflow-hidden shadow-md w-64 h-fit max-sm:w-full relative">
                        <picture>
                            <div class="border h-56 w-full overflow-hidden flex items-center relative">
                                <img v-if="employee.profile" :src="`${URL}source/profile/${employee.profile}`" alt="profile image" class="h-full w-full object-cover">
                                <div v-else class="bg-slate-300 h-full w-full flex justify-center items-center">
                                    <div class="w-40 h-40 bg-slate-400 border flex justify-center items-center rounded-full text-7xl text-slate-500">
                                        <font-awesome-icon icon="fa-solid fa-user" />
                                    </div>
                                </div>
                                <div class="absolute top-2 right-2 border">
                                    <button v-if="!user.isEmployee ||  (user.isEmployee && user.userData.role == 'operator' )"  @click="showUpdateRole(employee.id)" type="button" class="bg-black/50 p-2 text-white rounded-md w-8 h-8 flex justify-center items-center hover:bg-black">
                                        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                                    </button>
                                    <form @submit.prevent="updateRoleUser" v-if="isUpdateRole[employee.id]" class="bg-white rounded absolute right-0 text-sm mt-2">
                                        <select v-model="role" @change="setRoleUser(employee)" class="rounded border-none outline-none focus:ring-red-600 text-sm cursor-pointer">
                                            <option selected class="bg-slate-200">
                                                choice role
                                            </option>
                                            <option value="operator" name="role">
                                                operator
                                            </option>
                                            <option value="employee" name="role">
                                                employee
                                            </option>
                                        </select>
                                       <div class="w-full text-[11px] p-1">
                                        <button class="p-1 border w-full rounded bg-slate-50 hover:bg-slate-100 font-semibold">
                                            <p v-if="!isLoadingUpdate">
                                                update
                                            </p>
                                            <p v-else class="animate-spin">
                                                <font-awesome-icon icon="fa-solid fa-spinner"/>
                                            </p>
                                        </button>
                                       </div>
                                    </form>
                                </div>
                            </div>
                        </picture>
                        <div class="p-2 sm:p-4 text-[12px] flex flex-col gap-y-2 text-blue-900 font-semibold">
                            <h1 class="font-bold bg-blue-600 p-1 rounded text-zinc-100 text-center">Member</h1>
                            <h1>Name : {{ employee.username }}</h1>
                            <h1>Email : {{ employee.email }}</h1>
                            <h1 v-if="employee.role && employee.role != 'employee'">Role : {{ employee.role }}</h1>
                        </div>
                    </div>
                </div>
                <div v-else class="w-full h-screen bg-black/20 flex justify-center items-center">
                    <h1 class="text-center text-2xl text-slate-400 font-semibold">
                        Don't have employee
                    </h1>
                </div>
            </section>
        </template>
    </MainLayout>
</template>

<script setup>
import LoadingPage from '@/components/util/loadingPage.vue';
import MainLayout from '@/layout/mainLayout.vue';
import { storeShop } from '@/stores/storeShop';
import { userStore } from '@/stores/userStore';
import { onMounted, reactive, ref } from 'vue';

const store = storeShop()
const user = userStore()

const URL = import.meta.env.VITE_APP_BASE_URL

const isLoading = ref(false)
const isUpdateRole = ref({})
const employees = ref([])
const role = ref('choice role')
const id = ref(null)

const getEmployee = async () => {
    isLoading.value = !isLoading.value
    return await store.getEmployee(store.dataStore?.id ? store.dataStore.id : user.dataStoreEmployee.id)
        .then(response => {
            employees.value = [...response.data]
        })
        .finally(() => {
            isLoading.value = !isLoading.value
        })
}

const showUpdateRole = (employeeId) => {
    isUpdateRole.value[employeeId] = !isUpdateRole.value[employeeId]
}

const setRoleUser = async (employee) => {
    id.value = employee.id
}

const isLoadingUpdate = ref(false)
const info = reactive({
    message : '',
    type : ''
})
const updateRoleUser = async () => {
    isLoadingUpdate.value = !isLoadingUpdate.value
    await user.setRoleuser(id.value, { role: role.value })
        .then(response => {
            console.log(response);
            info.message = response.message
            info.type = 'success'
        })
        .catch(error => {
            info.message = `failed update role user,${error.response.data.message}`
            info.type = 'danger'
            console.log(error);
        })
        .finally(()=>{
            isLoadingUpdate.value = !isLoadingUpdate.value
        })
}

onMounted(async () => {
    await getEmployee()
})
</script>
