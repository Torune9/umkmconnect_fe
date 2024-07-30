import api from "@/service/axios";
import { defineStore } from "pinia";

export const inventStore = defineStore('inventories',{
    state : ()=>{
        return { 
            dataInventories : []
        }
    },
    persist : true,
    actions :{
      
        async getInventories(storeId){
            return await api.get(`user/inventory/${storeId}`)
            .then(response => {
                const {data} = response.data
                this.dataInventories = [...data]
                return response.data
            })
            .catch(error => {
                throw error
            })
        },
        async createInventory(payload){
            return await api.post('user/inventory/',payload)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        },
        async updateInventory(storeId,payload){
            return await api.put(`user/inventory/${storeId}`,payload)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        }
    },
    getters :{
        getDataInventories : state => state.dataInventories
    }
})