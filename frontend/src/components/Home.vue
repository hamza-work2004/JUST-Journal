<script setup>
import { ref, onMounted , computed } from 'vue';
import axios from 'axios';
// 1. استدعاء الكومبوننت الجديد
import Navbar from '../components/navbar.vue';

const isLoggedIn = ref(false); 
const approvedResearches = ref([]);
const searchQuery = ref('');

// خليت هذا الجزء عشان الزر الكبير (Get Started) يضل شغال صح
// onMounted(() => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     isLoggedIn.value = true; 
//   }
// });

onMounted(async () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;

  // جلب الأبحاث المنشورة للجميع (أو ممكن تشترط تسجيل الدخول لجلبها)
  try {
      const res = await axios.get('http://localhost:3000/api/approved-researches');
      approvedResearches.value = res.data;
  } catch (error) {
      console.error("Error fetching researches");
  }
});

// فلترة البحث
const filteredResearches = computed(() => {
    return approvedResearches.value.filter(r => 
        r.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (r.category && r.category.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
});

// فتح الملف
const openFile = (filename) => {
    window.open(`http://localhost:3000/uploads/${filename}`, '_blank');
};




</script>

<template>
    <Navbar />

    <div class="home-container">
        <div class="hero-section">
            <h1>Welcome to JUST Journal</h1>
            <p>Explore the latest academic researches and publications.</p>
            
            <router-link v-if="!isLoggedIn" to="/signup">
                <button class="get-started-button">Join Us Now</button>
            </router-link>
        </div>

        <div class="content-section">
            <input type="text" v-model="searchQuery" placeholder="Search researches by title or category..." class="search-input">
            
            <div class="cards-container">
                <div v-for="item in filteredResearches" :key="item.id" class="research-card">
                    <h3>{{ item.title }}</h3>
                    <div class="card-meta">
                        <span class="category-badge">{{ item.category || 'General' }}</span>
                        <small>{{ item.date }}</small>
                    </div>
                    <button @click="openFile(item.filePath)" class="btn-read">Read Research</button>
                </div>
            </div>

            <p v-if="filteredResearches.length === 0" style="margin-top:20px; color: gray;">No researches found.</p>
        </div>
    </div>
</template>

<style scoped>
/* 3. حذفنا ستايل الـ nav-bar من هون لأنه صار بملفه الخاص */

/* .home-container {
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
} */

.home-container { text-align: center; font-family: 'Cairo', sans-serif; }
.hero-section { background: #f0f8ff; padding: 50px 20px; margin-bottom: 30px; }
.hero-section h1 { color: #007bff; margin-bottom: 10px; }

.content-section { max-width: 900px; margin: 0 auto; padding: 20px; }
.search-input { width: 100%; padding: 15px; border: 2px solid #eee; border-radius: 30px; margin-bottom: 40px; font-size: 1.1em; outline: none; transition: 0.3s; }
.search-input:focus { border-color: #007bff; }

.cards-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
.research-card { background: white; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); text-align: left; transition: transform 0.2s; }
.research-card:hover { transform: translateY(-5px); }
.research-card h3 { margin: 0 0 10px 0; color: #333; }

.card-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.category-badge { background: #e3f2fd; color: #0d47a1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }

.btn-read { width: 100%; background-color: #007bff; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-weight: bold; }
.btn-read:hover { background-color: #0056b3; }
.get-started-button { padding: 10px 25px; font-size: 18px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; }

</style>