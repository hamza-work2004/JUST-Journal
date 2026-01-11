<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false);
const userRole = ref('');

// فحص حالة تسجيل الدخول عند التحميل
onMounted(() => {
  const token = localStorage.getItem('token'); // أو userId حسب ما بتخزن
  const role = localStorage.getItem('userRole');
  
  if (token && role) {
    isLoggedIn.value = true;
    userRole.value = role;
  }
});

// 🔥 دالة التوجيه الذكي للداشبورد
const goToDashboard = () => {
  if (userRole.value === 'author') {
    router.push('/author');
  } else if (userRole.value === 'editor') {
    router.push('/editor');
  } else if (userRole.value === 'reviewer') {
    router.push('/reviewer');
  } else {
    // حالة احتياطية لو الرتبة مش معروفة
    router.push('/login');
  }
};

const logout = () => {
  localStorage.clear();
  isLoggedIn.value = false;
  router.push('/login');
};
</script>

<template>
  <nav class="main-navbar">
    <div class="logo">
      <router-link to="/">JUST Journal 🎓</router-link>
    </div>

    <div class="nav-links">
      <router-link to="/" class="link">Home</router-link>
      <router-link to="/about" class="link">About Us</router-link>
      <router-link to="/policies" class="link">Policies</router-link>
    </div>

    <div class="auth-buttons">
      <div v-if="isLoggedIn" class="logged-in-menu">
        <button @click="goToDashboard" class="btn-dashboard">
          Go to Dashboard 🚀
        </button>
        <button @click="logout" class="btn-logout">Logout</button>
      </div>

      <div v-else class="guest-menu">
        <router-link to="/login" class="btn-login">Login</router-link>
        <router-link to="/signup" class="btn-signup">Sign Up</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.main-navbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 15px 40px; background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  font-family: 'Segoe UI', sans-serif;
}

.logo a { font-size: 1.5rem; font-weight: 800; color: #1e3a8a; text-decoration: none; }

.nav-links { display: flex; gap: 25px; }
.link { text-decoration: none; color: #555; font-weight: 500; transition: color 0.2s; }
.link:hover, .router-link-active { color: #1e3a8a; }

.auth-buttons { display: flex; gap: 15px; }

/* أزرار الضيوف */
.btn-login { text-decoration: none; color: #1e3a8a; font-weight: 600; padding: 8px 16px; border: 1px solid #1e3a8a; border-radius: 6px; transition: 0.2s; }
.btn-login:hover { background-color: #f0f4ff; }

.btn-signup { text-decoration: none; background-color: #1e3a8a; color: white; font-weight: 600; padding: 8px 16px; border-radius: 6px; transition: 0.2s; border: 1px solid #1e3a8a; }
.btn-signup:hover { background-color: #152c52; }

/* أزرار المسجلين */
.btn-dashboard { background-color: #f97316; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.95rem; margin-right: 10px; transition: 0.2s; }
.btn-dashboard:hover { background-color: #ea580c; }

.btn-logout { background: none; border: none; color: #dc3545; font-weight: 600; cursor: pointer; }
.btn-logout:hover { text-decoration: underline; }
</style>