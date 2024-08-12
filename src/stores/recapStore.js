import api from "@/service/axios";
import { defineStore } from "pinia";

export const recapStore = defineStore('recap',{
    state : ()=>{
        return { 
            dataRecap : []
        }
    },
    persist : true,
    actions :{
      
        async recapFinance(storeId){
            return await api.get(`user/finance/${storeId}`)
            .then(response => {
                console.log(response.data);
                const {data} = response.data
                this.dataRecap = [...data]
                return response.data
            })
            .catch(error => {
                throw error
            })
        },
        async createRecapFinance(payload){
            return await api.post('user/finance',payload)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        },
        async updateRecapFinance(storeId,id,payload){
            return await api.put(`user/finance/${storeId}/${id}`,payload)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        },
        async generatePdf(storeId,payload){
            return await api.post(`/user/finance/report/${storeId}`,payload,{
                responseType : 'blob'
            })
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        }
    },
    getters :{
        getDataRecap : state => state.dataRecap
    }
})