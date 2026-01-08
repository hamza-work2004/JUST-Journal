<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userInitial = ref('A'); // الحرف الأول

onMounted(() => {
  // جلب أول حرف من الاسم عشان نعرضه بالدائرة
  const name = localStorage.getItem('userName');
  if (name) {
    userInitial.value = name.charAt(0).toUpperCase();
  }
});

const logout = () => {
  if(confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    router.push('/login');
  }
};
</script>

<template>
  <nav class="navbar">
    <div class="nav-links">
      <router-link to="/author" class="nav-item" exact>
        Home
      </router-link>
      
      <router-link to="/author/create" class="nav-item">
        Create Research
      </router-link>
      
      <router-link to="/author/my-research" class="nav-item">
        My Research
      </router-link>

      <router-link to="/author/feedback" class="nav-item">
        Feedback
      </router-link>
    </div>

    <div class="nav-right">
      
      <router-link to="/author/notifications" class="notification-icon" title="Notifications">
        <span class="badge">!</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fb923c" stroke="none">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </router-link>

      <router-link to="/author/profile" class="user-avatar" title="My Profile">
        {{ userInitial }}
      </router-link>

      <button @click="logout" class="logout-btn" title="Logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>

    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e3a8a;
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

.router-link-exact-active {
  background-color: white !important;
  color: #1e3a8a !important;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  opacity: 1;
}

/* تنسيقات الجزء اليمين */
.nav-right { display: flex; align-items: center; gap: 15px; }

.notification-icon { 
  position: relative; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  transition: transform 0.2s;
}
.notification-icon:hover { transform: scale(1.1); }

.badge { 
  position: absolute; 
  top: -5px; 
  right: -2px; 
  background-color: #ef4444; 
  color: white; 
  border-radius: 50%; 
  font-size: 10px; 
  width: 14px; 
  height: 14px; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  font-weight: bold; 
}

/* تنسيق الأفاتار (صار رابط) */
.user-avatar { 
  background-color: #f97316; 
  color: white; 
  width: 35px; 
  height: 35px; 
  border-radius: 50%; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  font-weight: bold; 
  font-size: 16px; 
  cursor: pointer; 
  border: 2px solid white; 
  text-decoration: none; /* عشان ما يطلع خط تحته */
  transition: 0.2s;
}
.user-avatar:hover { background-color: #ea580c; }

/* زر الخروج */
.logout-btn {
  background: none;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 5px;
  transition: color 0.2s;
}
.logout-btn:hover {
  color: #ff9999; /* لون أحمر فاتح عند المرور */
}
</style>