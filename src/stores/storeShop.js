import api  from "@/service/axios"
import  {defineStore}  from "pinia"

export const storeShop = defineStore('store',{
    state : ()=>{
        return {
            dataStore : {},
            isShowStore : false,
            dataProducts : {},
            dataAllStore : []
        }
    },
    persist : true,
    actions :{

        async getAllStore (code=''){
            const endpoint = code ? `user/store/detail/${code}` : 'user/store/detail/';
            try {
                const response = await api.get(endpoint);
                const { data } = response.data;
                this.dataAllStore = data;
                return response.data;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        async createStore(payload){
            console.log(payload);
            return await api.post('user/store',payload)
            .then(response =>{
                this.isShowStore = true
                response.data
            })
            .catch(error => {
                console.log(error)
                throw error
            })
        },
        async getStore (id){
            return await api.get(`user/store/${id}`)
            .then(response => {
                this.dataStore = response.data.data
                this.isShowStore = true
                return response.data
            })
            .catch(error => {
                this.dataStore = {}
                this.isShowStore = false
                console.log(error)
                throw error
            })
        },
        async createProduct(payload){
            console.log(payload);
            return await api.post('store/product',payload)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        },
        async getproducts(id){
            return await api.get(`store/product/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        },
        async updateProduct(id,payload){
            return await api.put(`store/product/${id}`,payload)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        },
        async deleteProduct(id){
            return await api.delete(`store/product/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        },
        async getEmployee(id){
            return await api.get(`user/store/employee/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        },
        async getTokenTransaction(payload){
            return api.post('product/payment',payload)
            .then(resposne => resposne.data)
            .catch(error => {
                throw error
            })
        },
        async getOrder(email){
            return api.get(`order/${email}`)
            .then(resposne => resposne.data)
            .catch(error => {
                throw error
            })
        },
        async updateOrderStatus (orderId,payload){
            return await api.put(`/order/${orderId}`,payload)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        },
        async deleteOrder (orderId){
            return await api.delete(`/order/${orderId}`)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        }
        
    },
    getters : {
        getIshowStore : (state) => state.isShowStore
    }
})
