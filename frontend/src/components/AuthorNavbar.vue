<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userInitial = ref('A'); // A for Author

const logout = () => {
  localStorage.clear();
  router.push('/login');
};
</script>

<template>
  <nav class="navbar">
    <div class="nav-links">
      <router-link to="/author" class="nav-item" exact>
        Home
      </router-link>
      
      <router-link to="/author/create" class="nav-item">
        Create New Research
      </router-link>
      
      <router-link to="/author/my-research" class="nav-item">
        My Research
      </router-link>
      <router-link to="/author/feedback" class="nav-item">
        Feedback
      </router-link>
    </div>

    <div class="nav-right">
      <div class="notification-icon">
        <span class="badge">2</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fb923c" stroke="none">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </div>

      <div class="user-avatar" @click="logout" title="Logout">
        {{ userInitial }}
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* نفس الستايل الموحد للجميع */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e3a8a; /* الكحلي الموحد */
  padding: 10px 30px;
  color: white;
  font-family: 'Segoe UI', sans-serif;
  height: 60px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 500;
  opacity: 0.9;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 1;
}

/* الستايل النشط الموحد (يحل مشكلة التعليق) */
.router-link-exact-active {
  background-color: white !important;
  color: #1e3a8a !important;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  opacity: 1;
}

.nav-right { display: flex; align-items: center; gap: 20px; }
.notification-icon { position: relative; cursor: pointer; }
.badge { position: absolute; top: -5px; right: -5px; background-color: #ef4444; color: white; border-radius: 50%; font-size: 10px; width: 16px; height: 16px; display: flex; justify-content: center; align-items: center; font-weight: bold; }
.user-avatar { background-color: #f97316; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 16px; cursor: pointer; border: 2px solid white; }
</style>