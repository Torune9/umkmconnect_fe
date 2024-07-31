<template>
    <div
        class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
        <ul v-if="isUser" class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
           <li  @click="setUser(index + 1)" v-for="user,index of users" :key="index" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer border-b">
            {{ user.name }}
           </li>
        </ul>
        <ul v-if="isStatus" class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
            <li @click="setStatus(stat.status)" v-for="stat,index of status" :key="index" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer border-b">
                <p :class="[stat.color,'font-semibold']">
                    {{ stat.status }}
                </p>
            </li>
        </ul>
    </div>
</template>

<script setup>

const props = defineProps({
    isUser : {
        type : Boolean,
        default : false
    },
    isStatus : {
        type : Boolean,
        default : false
    },
    taskId: {
        type : Number
    }
})

const status = [
    {
        status: 'finish',
        color : 'text-green-600'
    },
    {
        status: 'progress',
        color : 'text-cyan-600'
    },
    {
        status: 'pending',
        color : 'text-yellow-600'
    },
    {
        status: 'out-date',
        color : 'text-red-600'
    },
]

const users = [
    {
        name : 'rahman'
    },
    {
        name : 'kevin'
    },
    {
        name : 'rangga'
    },
    {
        name : 'yoray'
    }
]

const emits = defineEmits(['setStatus','setUser'])

const setStatus = (status) => {
    emits('setStatus',{status,taskId : props.taskId})
};
const setUser = (userId) => {
    emits('setUser',{userId,taskId : props.taskId})
};


</script>

<style scoped></style>