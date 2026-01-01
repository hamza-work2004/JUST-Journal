<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const notificationCount = ref(5); // الرقم 5 زي الصورة
const userInitial = ref('R');     // حرف R زي الصورة

const logout = () => {
  localStorage.clear();
  router.push('/login');
};
</script>

<template>
  <nav class="reviewer-navbar">
    
    <div class="nav-links">
      
      <router-link 
        to="/reviewer" 
        class="home-btn" 
        exact-active-class="active-home"
      >
        Home
      </router-link>

      <router-link 
        to="/reviewer/papers" 
        class="text-link" 
        active-class="active-text"
      >
        Review Papers
      </router-link>

    </div>

    <div class="nav-actions">
      
      <div class="notification-icon">
        <span class="bell">🔔</span>
        <span v-if="notificationCount > 0" class="badge">{{ notificationCount }}</span>
      </div>

      <div class="user-avatar" @click="logout" title="Logout">
        {{ userInitial }}
      </div>

    </div>

  </nav>
</template>

<style scoped>
/* 1. الحاوية الرئيسية (الخلفية الكحلية) */
.reviewer-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1b396a; /* نفس لونك الكحلي */
  padding: 12px 30px;
  color: white;
  font-family: 'Segoe UI', sans-serif;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 25px; /* مسافة بين زر الهوم ورابط الاوراق */
}

/* 2. تصميم زر الهوم (المربع) */
.home-btn {
  background-color: #4f6076; /* اللون السكني المزرق اللي في الصورة */
  color: white;
  text-decoration: none;
  font-weight: 700;
  padding: 8px 24px;
  border-radius: 6px;
  border: 2px solid white; /* الإطار الأبيض */
  transition: all 0.3s;
  display: inline-block;
}

.home-btn:hover {
  background-color: #5b7391;
}

/* 3. تصميم رابط Review Papers (النص) */
.text-link {
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.05rem;
  transition: opacity 0.3s;
}

.text-link:hover {
  opacity: 0.8;
}

/* 4. الجزء اليمين (الإشعارات والبروفايل) */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-icon {
  position: relative;
  cursor: pointer;
  font-size: 1.4rem;
}

.badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background-color: #ff4d4f; /* الأحمر */
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 50%;
  border: 1px solid #1b396a;
}

.user-avatar {
  width: 42px;
  height: 42px;
  background-color: #ff5722; /* البرتقالي */
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.3rem;
  cursor: pointer;
}
</style>