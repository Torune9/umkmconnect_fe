import { userStore } from "@/stores/userStore";

const navGuard = (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth) && !userStore().isLogin) {
      next('/user/login')
    }else{
      if(userStore().isLogin && (to.name == 'login' || to.name == 'register') || (to.path == 'home' )){
        next({
          name : 'dashboard'
        })
      }else{
        next()
      }
    }
  
};

 export default navGuard