<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false);
const userRole = ref(''); // متغير جديد عشان نعرف مين اليوزر

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    isLoggedIn.value = true;
    userRole.value = localStorage.getItem('userRole'); // بنجيب الرتبة
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
  <div class="nav-bar">
    <router-link to="/" class="home-link" ><h3>JUST Journal</h3></router-link>
    
    <div class="right-nav">
      <template v-if="!isLoggedIn">
        <router-link to="/login">Login</router-link>
        <router-link to="/signup">Sign Up</router-link>
      </template>

      <template v-else>
        <!-- <router-link to="/dashboard">Dashboard</router-link> -->
         <router-link v-if="userRole !== 'researcher'" to="/dashboard">Dashboard</router-link>
        <a href="#" @click.prevent="logout">Logout</a>
      </template>
    </div>
  </div>
</template>

<style scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}
.nav-bar h3 {
  margin: 0;
  color: #007bff;
}
.home-link {
  text-decoration: none;
}

.right-nav a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  margin: 0 10px;
  cursor: pointer;
}
.right-nav a:hover {
  text-decoration: underline;
}
</style>