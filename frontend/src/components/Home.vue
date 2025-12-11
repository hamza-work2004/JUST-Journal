<script setup>
import { ref, onMounted } from 'vue';
// 1. استدعاء الكومبوننت الجديد
import Navbar from '../components/navbar.vue';

const isLoggedIn = ref(false); 

// خليت هذا الجزء عشان الزر الكبير (Get Started) يضل شغال صح
onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    isLoggedIn.value = true; 
  }
});
</script>

<template>
    <Navbar />

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
/* 3. حذفنا ستايل الـ nav-bar من هون لأنه صار بملفه الخاص */

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