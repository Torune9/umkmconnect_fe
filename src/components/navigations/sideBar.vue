<template>
    <nav class="h-full w-[300px]">
        <div
            class="h-full pt-16 pl-4 pr-4 border-r max-md:bg-black/30 max-md:backdrop-blur-sm flex flex-col justify-between">
            <ul class="flex flex-col gap-2 font-poppins text-[12px] font-semibold text-black max-md:w-1/2">
                <li v-for="menu, index in menus" :key="index">
                    <router-link :to="menu.path" class="block" active-class="text-white bg-black/40 rounded"
                        exact-active-class="text-white">
                        <p
                            class="p-2 rounded w-full border-b hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer">
                            {{ menu.name }}
                        </p>
                    </router-link>
                    <button
                        class="w-full border mt-1 p-1 rounded hover:bg-green-200 hover:text-white transition-all duration-300 h-10 hover:border-none mb-1"
                        v-if="menu.icon && menu.data" @click="createWorkspace">
                        <font-awesome-icon :icon="menu.icon" size="2xl" />
                    </button>
                    <div v-if="menu.data && Object.entries(menu.data).length !== 0" class="h-[140px] overflow-y-scroll border">
                        <div class="pl-2 border-b p-1" v-for="space, index in menu.data" :key="index">
                            <router-link :to="`/workspace/${space.id}`" active-class="text-white bg-main/80 rounded"
                                exact-active-class="text-white" class="block">
                                <p type="button" @click="sendTaskData(space.tasks)"
                                    class="cursor-pointer font-inter hover:bg-red-400 max-md:hover:bg-indigo-900/40 rounded p-1">
                                    {{ index + 1 }}.{{ space.name }}
                                </p>
                            </router-link>
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="font-poppins text-sm font-semibold text-[11px]">
                <router-link to="/user/profile">       
                    <li 
                        class="p-2 rounded w-full border-b hover:bg-black/50 hover:text-white transition-all duration-300 cursor-pointer ">
                        Profile
                    </li>
                </router-link>
                <li @click="logout"
                    class="p-2 rounded w-full border-b hover:bg-black/50 hover:text-white transition-all duration-300 cursor-pointer ">
                    Logout
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { inventStore } from '@/stores/inventoryStore';
import { recapStore } from '@/stores/recapStore';
import { storeShop } from '@/stores/storeShop';
import { userStore } from '@/stores/userStore';
import { workspaceStore } from '@/stores/workspaceStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const workspace = workspaceStore()
const router = useRouter()
const menus = computed(() => {
    return [
        {
            name: 'Dashboard',
            path: '/dashboard'

        },
        {
            name: 'Workspace',
            path: '/workspace',
            icon: 'fa-regular fa-square-plus',
            isStore: store.getIshowStore || user.getIshowStore,
            data: workspace.getDataWorkspace.data
                ?? user.getDataWorkspace

        },
        {
            name: 'Finance',
            path: '/finance',
            isStore: store.getIshowStore || user.getIshowStore,
        },
        {
            name: 'Iventory',
            path: '/inventory',
            isStore: store.getIshowStore || user.getIshowStore,
        },
        {
            name: 'Employee',
            path: '/employee',
            isStore: store.getIshowStore || user.getIshowStore,
        }
    ].filter(menu => menu.isStore === undefined || menu.isStore);
})
const isCreate = false
const store = storeShop()
const user = userStore()


const emits = defineEmits(['createWorkspace', 'sendTask'])
const createWorkspace = () => {
    emits('createWorkspace', !isCreate)
}

const sendTaskData = (data) => {
    workspace.tasks = data
    emits('sendTask', workspace.tasks)
}

const logout = ()=>{
    user.$reset()
    store.$reset(),
    inventStore().$reset()
    recapStore().$reset()
    workspaceStore().$reset()
    router.replace('/user/login')
}

</script>