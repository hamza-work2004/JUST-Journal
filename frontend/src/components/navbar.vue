<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 1. استقبال خاصية لإظهار أو إخفاء البحث (عشان نقدر نخفيه في صفحة السياسات)
const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true
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

    <div class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/policies">Policies</router-link>
      </div>

    <div class="right-section">
      
      <div v-if="showSearch" class="search-box">
        <input type="text" v-model="searchQuery" placeholder="Search..." />
      </div>

      <div class="auth-buttons">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="btn btn-login">Login</router-link>
          <router-link to="/signup" class="btn btn-signup">Sign Up</router-link>
        </template>

        <template v-else>
          <router-link 
            v-if="userRole !== 'researcher'" 
            to="/dashboard" 
            class="btn btn-dashboard"
          >
            Dashboard
          </router-link>
          
          <button @click="logout" class="btn btn-logout">Logout</button>
        </template>
      </div>
    </div>

  </nav>
</template>

<style scoped>
/* تصميم الناف بار الاحترافي */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

/* تنسيقات اللوجو */
.logo-link { text-decoration: none; display: flex; flex-direction: column; }
.logo-section h2 { margin: 0; color: #1e3a8a; font-size: 1.5rem; font-weight: 700; }
.subtitle { font-size: 0.75rem; color: #666; letter-spacing: 0.5px; }

/* تنسيقات الروابط (Home, Policies) */
.nav-links { display: flex; gap: 20px; }
.nav-links a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  transition: color 0.3s;
}
.nav-links a:hover, .nav-links a.router-link-active {
  color: #1e3a8a;
  font-weight: 700;
}

/* اليمين: البحث والأزرار */
.right-section { display: flex; align-items: center; gap: 15px; }

.search-box input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #f9f9f9;
  outline: none;
  font-size: 0.9rem;
  width: 180px;
  transition: all 0.3s;
}
.search-box input:focus { border-color: #1e3a8a; background: #fff; }

/* الأزرار */
.auth-buttons { display: flex; gap: 10px; align-items: center; }
.btn {
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-login { background: white; border: 1px solid #ddd; color: #333; }
.btn-login:hover { border-color: #1e3a8a; color: #1e3a8a; }

.btn-signup { background: #1e3a8a; color: white; }
.btn-signup:hover { background: #152c6b; }

.btn-dashboard { background: #e0e7ff; color: #1e3a8a; }
.btn-dashboard:hover { background: #c7d2fe; }

.btn-logout { background: transparent; color: #d32f2f; border: 1px solid transparent; }
.btn-logout:hover { background: #fee2e2; border-color: #fca5a5; }
</style>