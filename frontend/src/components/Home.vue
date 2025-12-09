<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false); 

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    isLoggedIn.value = true; 
  }
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  
  isLoggedIn.value = false;
  
  router.push('/login');
};
</script>

<template>
    <div class="nav-bar">
        <h3>JUST Journal</h3>
        
        <div class="right-nav">
            <template v-if="!isLoggedIn">
                <router-link to="/login">Login</router-link>
                <router-link to="/signup">Sign Up</router-link>
            </template>

            <template v-else>
                <router-link to="/dashboard">Dashboard</router-link>
                <a href="#" @click.prevent="logout">Logout</a>
            </template>
        </div>
    </div>

    <div class="home-container">
        <h1>Welcome to JUST Journal</h1>
        <p>Your personal space to document thoughts, ideas, and experiences.</p>
        
        <router-link :to="isLoggedIn ? '/dashboard' : '/signup'">
            <button class="get-started-button">
                {{ isLoggedIn ? 'Go to Dashboard' : 'Get Started' }}
            </button>
        </router-link>
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

.home-container {
    text-align: center;
    margin-top: 100px;
}
.get-started-button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.get-started-button:hover {
    background-color: #0056b3;
}
</style>