<template>
    <main class="grid md:grid-cols-[300px_minmax(300px,_1fr)]">
        <div class="fixed w-full z-50">
            <NavBarMain @showSidebar="sideBar" :showSide="dataSide" />
        </div>


        <TaskModal :isWorkspace="isWorkspace" :is-show="isWorkspace" @close="closeModalCreate" />
        <Transition name="sidebar">
            <SideBar class="fixed h-full w-full max-md:z-50 md:hidden"  @createWorkspace="workspaceCreate"
                @click="sideBar(false)" v-if="dataSide" />
        </Transition>

        <div class="fixed h-full w-[300px] max-md:z-50 max-md:hidden">
            <SideBar @createWorkspace="workspaceCreate" @sendTask="sendTaskData" />
        </div>

        <div class="md:col-start-2 relative">
            <slot name="body" :sendTask="sendTaskData"/>
        </div>
    </main>
</template>

<script setup>
import TaskModal from '@/components/modal/taskModal.vue';
import NavBarMain from '@/components/navigations/navBarMain.vue'
import SideBar from '@/components/navigations/sideBar.vue';
import { storeShop } from '@/stores/storeShop';
import { userStore } from '@/stores/userStore';
import { workspaceStore } from '@/stores/workspaceStore';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const dataSide = ref(false)
const isWorkspace = ref(false)
const router = useRouter()

const sideBar = (data) => {
    dataSide.value = data
    console.log(data);
}

const workspaceCreate = (data) => {
    isWorkspace.value = data
    console.log(data);
}
const closeModalCreate = async () => {
    isWorkspace.value = false
if (workspaceStore().isOwner) await getWorkspaceAsOwner()
if (userStore().isEmployee) await getWorkspaceAsEmployee()
    router.replace('/workspace')

}


const getWorkspaceAsOwner = async ()=> {
    console.log('wjwj');
    await workspaceStore().getWorkspace(storeShop().dataStore.id)
}

const getWorkspaceAsEmployee = async ()=> {
    console.log('employe');
    await userStore().getStoreAsEmployee(userStore().userData.email)
}

const sendTaskData = (data)=> {
    console.log('ks');
    return console.log(data);
}


onMounted(() => {
    window.addEventListener('resize', () => {
        if (window.innerWidth < 640) {
            dataSide.value = false
        }
    })
})
</script>

<style scoped>
/* we will explain what these classes do next! */
.sidebar-enter-active {
    transition: transform 0.3s linear;
}

.sidebar-leave-active {
    transition: transform 0.3s linear;
}


.sidebar-enter-from {
    transform: translateX(-350px);
}

.sidebar-enter-to {
    transform: translateX(0px);
}

.sidebar-leave-from {
    transform: translateX(0px);
}

.sidebar-leave-to {
    transform: translateX(-350px);
}
</style>