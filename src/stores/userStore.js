import api from "@/service/axios";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";

export const userStore = defineStore('users',{
    state : ()=> {
        return {
            userData : {},
            isLogin : false,
            isShowStore : false,
            dataStoreEmployee : {},
            isEmployee : false,
            token : null,
            imageUser : '',
        }
    },
    persist :  true,
    actions : {
        async register(payload){
            return api.post('user/authenticate/register',payload)
            .then(response => response.data )
            .catch(error => {throw error})
        },
        async login(payload){
            return api.post('user/authenticate/login',payload)
            .then(response => {
                const {data :{data:{token}}} = response
                const decode = jwtDecode(token)
                this.userData = decode
                this.token = token
                return this.isLogin = true
            })
            .catch(error => {throw error})
        },
        async joinStore (payload){
            console.log(payload);
            return await api.put(`/user/join?id=${payload.id}`,{code:payload.code})
            .then(response => {
                return response.data
            })
            .catch(error => {throw error})
        },
        async getStoreAsEmployee(email){
            return await api.get('user/store',{
                headers : {
                    'X-Email-Employee' : email 
                }
            })
            .then(response => {
                const {data:{members}} = response.data
                this.isShowStore = true
                this.dataStoreEmployee = members
                return response.data
            })
            .catch(error => {
                throw error
            })
        },
        async updateUser(payload){
            return await api.put('user/update',payload,{
                headers : {
                    'X-Is-Profile' : true
                }
            })
            .then(response => {
                return response.data
            })
            .catch(error => {
                throw error
            })
        },
        async getUserImage(id){
            return await api.get(`user/image/${id}`)
            .then (response => response.data)
            .catch(error => {
                throw error
            })
        },
        async forgotPassowrd(email){
            return await api.post('/user/password/forgot',email)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        },
        async setRoleuser(id,role){
            return await api.put(`user/role/${id}`,role)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
        }
    },
    getters : {
        getUserData : (state) => state.userData,
        getIshowStore : (state) => {
            return state.isShowStore
        },
        getDataWorkspace : (state) => state.dataStoreEmployee?.workspaces || {}
    },
})
