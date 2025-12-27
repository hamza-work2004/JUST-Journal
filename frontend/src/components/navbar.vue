<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 1. هذا السطر اللي كان ناقص: تعريف الخاصية لاستقبال الأمر من الصفحات الثانية
defineProps({
  showSearch: {
    type: Boolean,
    default: true // افتراضياً البحث شغال (زي الهوم بيج)
  }
});

const router = useRouter();
const isLoggedIn = ref(false);
const userRole = ref('');
const searchQuery = ref('');

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    isLoggedIn.value = true;
    userRole.value = localStorage.getItem('userRole');
  }
});

const logout = () => {
  localStorage.clear();
  isLoggedIn.value = false;
  userRole.value = '';
  router.push('/login');
};
</script>

<template>
  <nav class="navbar">
    
    <div class="logo-section">
      <router-link to="/" class="logo-link">
        <h2>JUST Journal</h2>
        <span class="subtitle">Scientific Research Publishing</span>
      </router-link>
    </div>

    <div class="center-links">
      <router-link to="/" active-class="active-link">Home</router-link>
      <router-link to="/about" active-class="active-link">About</router-link>
      <router-link to="/policies" active-class="active-link">Policies</router-link>
    </div>

    <div class="right-actions">
      
      <div class="search-wrapper" v-if="showSearch">
        <input type="text" v-model="searchQuery" placeholder="Search articles..." />
        <button class="search-btn">Search</button>
      </div>

      <div class="auth-buttons">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="btn btn-login">Login</router-link>
          <router-link to="/signup" class="btn btn-signup">Sign Up</router-link>
        </template>
        
        <template v-else>
          <router-link v-if="userRole !== 'researcher'" to="/dashboard" class="btn btn-login">Dashboard</router-link>
          <button @click="logout" class="btn btn-signup">Logout</button>
        </template>
      </div>

    </div>

  </nav>
</template>

<style scoped>
/* نفس الستايل بالزبط ما غيرت عليه شي */

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px; 
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea; 
  font-family: 'Segoe UI', sans-serif;
}

.logo-link { text-decoration: none; }
.logo-section h2 {
  margin: 0;
  color: #0f2c5c; 
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.subtitle {
  font-size: 0.85rem;
  color: #666;
  font-weight: 400;
  display: block;
  margin-top: -2px;
}

.center-links {
  display: flex;
  gap: 30px; 
}
.center-links a {
  text-decoration: none;
  color: #333; 
  font-weight: 600;
  font-size: 1rem;
  position: relative;
  transition: color 0.3s;
}
.center-links a:hover { color: #0f2c5c; }

.active-link {
  color: #0f2c5c !important;
}
.active-link::after {
  content: '';
  display: block;
  width: 100%;
  height: 3px;
  background-color: #0f2c5c;
  position: absolute;
  bottom: -24px; 
  left: 0;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
}
.search-wrapper input {
  padding: 10px 15px;
  background-color: #f2f2f2; 
  border: none;
  outline: none;
  font-size: 0.9rem;
  width: 200px;
  color: #555;
}
.search-btn {
  padding: 10px 20px;
  background-color: #0f2c5c; 
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
}
.search-btn:hover { background-color: #0a1f42; }

.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  text-decoration: none;
  padding: 8px 24px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-block;
}

.btn-login {
  background-color: white;
  border: 1px solid #0f2c5c;
  color: #0f2c5c;
}
.btn-login:hover {
  background-color: #f0f4ff;
}

.btn-signup {
  background-color: #0f2c5c;
  border: 1px solid #0f2c5c;
  color: white;
}
.btn-signup:hover {
  background-color: #0a1f42;
}
</style>