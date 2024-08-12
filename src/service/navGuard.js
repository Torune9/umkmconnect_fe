import { userStore } from "@/stores/userStore";

const navGuard = (to, from, next) => {
  const store = userStore();

  // Halaman yang memerlukan autentikasi
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // Halaman yang tidak memerlukan autentikasi
  const isAuthPage = ['login', 'register', 'home', 'forgot'].includes(to.name);

  // Jika belum login dan mencoba mengakses halaman yang memerlukan autentikasi
  if (requiresAuth && !store.isLogin) {
    return next('/user/login');
  }

  // Jika sudah login dan mencoba mengakses halaman login, register, home, atau forgot password
  if (store.isLogin && isAuthPage) {
    return next({ name: 'dashboard' });
  }

  // Lanjutkan ke halaman yang dituju
  return next();
};

export default navGuard;
