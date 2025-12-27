<!-- <script setup>
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
      <router-link to="/about">About</router-link>
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
</style> -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

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
      
      <div class="search-wrapper">
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
/* كونتينر الناف بار */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px; /* مسافات واسعة زي الصورة */
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea; /* خط خفيف تحت */
  font-family: 'Segoe UI', sans-serif;
}

/* 1. تنسيق اللوجو */
.logo-link { text-decoration: none; }
.logo-section h2 {
  margin: 0;
  color: #0f2c5c; /* اللون الكحلي الغامق */
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

/* 2. تنسيق الروابط (بالوسط) */
.center-links {
  display: flex;
  gap: 30px; /* مسافة بين الكلمات */
}
.center-links a {
  text-decoration: none;
  color: #333; /* لون أسود رمادي */
  font-weight: 600;
  font-size: 1rem;
  position: relative;
  transition: color 0.3s;
}
.center-links a:hover { color: #0f2c5c; }

/* الخط اللي تحت كلمة Home (Active State) */
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
  bottom: -24px; /* تنزيل الخط لتحت عشان يلمس حافة الناف بار */
  left: 0;
}

/* 3. تنسيق القسم اليمين */
.right-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* مربع البحث */
.search-wrapper {
  display: flex;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
}
.search-wrapper input {
  padding: 10px 15px;
  background-color: #f2f2f2; /* السكني الفاتح */
  border: none;
  outline: none;
  font-size: 0.9rem;
  width: 200px;
  color: #555;
}
.search-btn {
  padding: 10px 20px;
  background-color: #0f2c5c; /* نفس كحلي اللوجو */
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
}
.search-btn:hover { background-color: #0a1f42; }

/* أزرار الدخول */
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

/* زر Login (أبيض مع حدود) */
.btn-login {
  background-color: white;
  border: 1px solid #0f2c5c;
  color: #0f2c5c;
}
.btn-login:hover {
  background-color: #f0f4ff;
}

/* زر Sign Up (كحلي معبأ) */
.btn-signup {
  background-color: #0f2c5c;
  border: 1px solid #0f2c5c;
  color: white;
}
.btn-signup:hover {
  background-color: #0a1f42;
}
</style>