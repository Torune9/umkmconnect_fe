<template>
    <Transition name="modals">
        <div v-if="isShow" class="fixed flex h-screen w-screen justify-center items-center z-50">
            <form @submit.prevent="createWorkOrTask" class="flex flex-col justify-center border gap-2 p-4 relative bg-white shadow-md">
                <h1 class="text-2xl font-semibold">
                    {{ isWorkspace ? 'Create  Workspace' : 'Task Create' }}
                </h1>
                <button @click="close" type="button"
                    class="absolute top-2 right-2 text-red-700 hover:text-red-600 transition-colors duration-300">
                    <font-awesome-icon icon="fa-solid fa-circle-xmark" size="xl" />
                </button>
                <div v-if="isTask">
                    <div>
                        <label for="task">
                            Task name
                        </label>
                        <input v-model="payloadTask.name" type="text" id="task" name="task" class="w-full rounded outline-none border"
                            placeholder="task...">
                    </div>
                    <div>
                        <label for="due_date">Due date</label>
                        <input v-model="payloadTask.dueDate" type="date" name="dueDate" id="due_date" class="w-full rounded outline-none border">
                    </div>
                    <div class="flex flex-col">
                        <label for="desc">Description</label>
                        <textarea v-model="payloadTask.description" name="desc" id="desc" cols="10" rows="5" class="rounded"></textarea>
                    </div>
                </div>
                <div v-if="isWorkspace">
                    <div>
                        <label for="name">name</label>
                        <input v-model="payloadWork.name" type="text" id="name" name="name"  class="w-full rounded outline-none border">
                    </div>
                </div>
                <div class="text-right">
                    <button
                        class="bg-green-500 w-24 h-10 rounded text-green-200 font-bold hover:bg-green-400 transition-colors duration-300">
                        <p v-if="!loading">create</p>
                        <p v-else class="animate-spin">
                            <font-awesome-icon icon="fa-solid fa-spinner" size="xl"/>
                        </p>
                    </button>
                </div>
            </form>
        </div>
    </Transition>
</template>

<script setup>
import { storeShop } from '@/stores/storeShop';
import { userStore } from '@/stores/userStore';
import { workspaceStore } from '@/stores/workspaceStore';
import { reactive,ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
    isWorkspace: {
        type: Boolean,
        default: false
    },
    isTask : {
        type: Boolean,
        default: false
    }
})

const loading = ref(false)

const workspace = workspaceStore()
const store = storeShop()

const payloadWork = reactive({
    name : '',
    storeId: store.dataStore.id ?? userStore().dataStoreEmployee?.id,
})

const route = useRoute()
const payloadTask = reactive({
    name : '',
    description : '',
    dueDate : '',
    workspaceId : ''
})

const emits = defineEmits(['close'])
const close = () => {
    payloadWork.name = null
    payloadTask.name = null
    payloadTask.description = null
    payloadTask.dueDate = null
    emits('close', props.isShow)
}


const createWorkOrTask = async ()=>{
    loading.value = !loading.value

    if (props.isWorkspace) {
        return await workspace.createWorkspace(payloadWork)
        // .then(response => {
        //     console.log(response)
        // })
        // .catch(error => console.log(error))
        .finally(()=>{
            loading.value = !loading.value
            close()
        })
    }
    if (props.isTask) {
        return await workspace.taskCreate(payloadTask)
        // .then(response => console.log(response))
        // .catch(error => console.log(error))
        .finally(()=>{
            loading.value = !loading.value
            close()
        })
    }

}

watch(route,(newVal)=>{
    payloadTask.workspaceId = newVal.params.id
})

</script>

<style>

.modals-enter-active,
.modals-leave-active {
    transition: transform 0.2s ease;
}

.modals-enter-from,
.modals-leave-to {
    transform: scale(0);
}
</style>