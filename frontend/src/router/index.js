import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/login.vue'
import Signup from '../components/signup.vue'
import ForgotPassword from '../components/forgot-pass.vue'
import Home from '../views/Home.vue'
import Dashboard from '@/components/Dashboard.vue'

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: Home,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login,
  },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); 

  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' }); 
  } 
  else if (to.meta.guest && token) {
    next({ name: 'home' });
  }
  else {
    next(); 
  }
});
export default router