import api  from "@/service/axios"
import  {defineStore}  from "pinia"

export const workspaceStore = defineStore('workspace',{
    state : ()=>{
        return {
            isWorkspace : false,
            workspaceData : [],
            tasks : [],
            isOwner : false
        }
    },
    persist : {
        paths : true
    },
    actions :{
        async createWorkspace(payload){
            console.log(payload);
            return await api.post('space/workSpace',payload)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        },
        async getWorkspace(id){
            this.isOwner = true;
            return await api.get(`space/workSpace/${id}`)
            .then(response => {
                this.isWorkspace = true
                this.workspaceData = response.data
                return response.data
            })
            .catch(error => {
                this.isWorkspace = false
                throw error
            })
        },
        async getWorkspaceByStatus(id,status=''){
            console.log(id);
            this.isOwner = true;
            return await api.get(`space/workSpace/${id}?status=${status}`)
            .then(response => {
                return response.data
            })
            .catch(error => {
                throw error
            })
        },
        async taskCreate(payload) {
            console.log(payload);
            return await api.post('space/task',payload)
            .then(response => response.data)
            .catch(error => console.log(error))
        },
        async setStatus(id,status){
            console.log(status);
            return await api.patch(`space/task/status/${id}`,{status})
            .then(response => {
                return response.data
            })
            .catch(error => {
                throw error
            })
        },
        async setUser(id,userId){
            return await api.patch(`space/task/assign/${id}`,{userId})
            .then(response => {
                return response.data
            })
            .catch(error => {
                throw error
            })
        },
    },
    getters : {
        getDataWorkspace : (state)=> state.workspaceData,
        getTasks : (state)=> state.tasks
    }
})
