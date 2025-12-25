<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// المتغيرات الأساسية
const isLoggedIn = ref(false); 
const approvedResearches = ref([]);
const searchQuery = ref('');

// 1. جلب البيانات عند تحميل الصفحة
onMounted(async () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;

  try {
    const res = await axios.get('http://localhost:3000/api/approved-researches');
    // ملاحظة: تأكد أن الباك إند يرسل البيانات المطلوبة
    approvedResearches.value = res.data;
  } catch (error) {
    console.error("Error fetching researches", error);
  }
});

// 2. فلترة البحث (نفس المنطق تبعك)
const filteredResearches = computed(() => {
  return approvedResearches.value.filter(r => 
    r.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (r.category && r.category.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

// 3. دالة فتح الملف
const openFile = (filename) => {
  if(filename) {
    window.open(`http://localhost:3000/uploads/${filename}`, '_blank');
  } else {
    alert("No file attached for this research.");
  }
};

// 4. دالة مساعدة لاستخراج الحرف الأول من الاسم (للشكل الجمالي)
const getInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : 'U';
};
</script>

<template>
  <div class="home-container">
    
    <nav class="navbar">
      <div class="logo">
        <h2>JUST Journal</h2>
        <span class="subtitle">Scientific Research Publishing</span>
      </div>
      
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/policies">Policies</router-link>
      </div>

      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search articles..." 
        />
        <button class="btn-search">Search</button>
      </div>

      <div class="auth-buttons">
        <template v-if="!isLoggedIn">
            <router-link to="/login"><button class="btn-login">Login</button></router-link>
            <router-link to="/signup"><button class="btn-signup">Sign Up</button></router-link>
        </template>
        <template v-else>
            <button class="btn-login">Dashboard</button> </template>
      </div>
    </nav>

    <header class="hero-section">
      <h1>Welcome to JUST Journal</h1>
      <p>
        A leading scientific platform dedicated to publishing high-quality academic research across diverse disciplines.
        We aim to advance global knowledge through transparent, peer-reviewed, and innovative scientific work.
      </p>
    </header>

    <section class="research-section">
      <div class="section-header">
        <h2>Recently Published Research</h2>
        <p>Explore the latest scientific findings</p>
      </div>

      <div class="cards-grid">
        <div v-for="item in filteredResearches" :key="item._id || item.id" class="article-card">
          <span class="badge">{{ item.category || 'General' }}</span>
          
          <h3>{{ item.title }}</h3>
          
          <p class="description">
            {{ item.abstract || 'Click to read the full details of this research paper published in JUST Journal.' }}
          </p>
          
          <div class="author-info">
            <div class="avatar">{{ getInitial(item.author || 'User') }}</div>
            <div class="details">
              <span class="author-name">{{ item.author || 'Researcher' }}</span>
              <span class="author-uni">{{ item.date ? new Date(item.date).toLocaleDateString() : 'Just Now' }}</span>
            </div>
          </div>

          <button @click="openFile(item.filePath)" class="btn-read-card">Read Research</button>
        </div>
      </div>

      <div v-if="filteredResearches.length === 0" class="no-results">
        <p>No researches found matching your search.</p>
      </div>

    </section>

  </div>
</template>

<style scoped>
/* =========================================
   نفس الستايل الخاص بالتصميم المطلوب
   ========================================= */

.home-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

/* Navbar Styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  border-bottom: 1px solid #eaeaea;
}

.logo h2 {
  color: #1e3a8a; /* اللون الكحلي */
  margin: 0;
  font-size: 1.5rem;
}
.subtitle { font-size: 0.8rem; color: #666; display: block; }

.nav-links a {
  margin: 0 15px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}
.nav-links a:hover { color: #1e3a8a; }

.search-bar { display: flex; }
.search-bar input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  background: #f4f4f4;
  outline: none;
  width: 200px;
}
.btn-search {
  padding: 8px 15px;
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.btn-login, .btn-signup {
  padding: 8px 20px;
  margin-left: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}
.btn-login { background: white; border: 1px solid #ddd; color: #333; }
.btn-signup { background: #1e3a8a; color: white; border: none; }

/* Hero Styles */
.hero-section {
  text-align: center;
  padding: 5rem 2rem;
  background: linear-gradient(to bottom, #f0f4ff, #ffffff);
}
.hero-section h1 { color: #1e3a8a; font-size: 2.5rem; margin-bottom: 1rem; }
.hero-section p { max-width: 800px; margin: 0 auto; color: #555; line-height: 1.6; font-size: 1.1rem; }

/* Cards Grid Styles */
.research-section { padding: 3rem 4rem; background-color: #f9fafb; min-height: 500px; }
.section-header { text-align: center; margin-bottom: 3rem; }
.section-header h2 { color: #1e3a8a; margin-bottom: 0.5rem; }
.section-header p { color: #666; }

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.article-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
}
.article-card:hover { 
  transform: translateY(-5px); 
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
}

.badge {
  align-self: flex-start;
  background-color: #e0e7ff;
  color: #1e3a8a;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.article-card h3 { margin: 0.5rem 0; font-size: 1.25rem; color: #111; line-height: 1.4; }
.description { font-size: 0.9rem; color: #666; margin-bottom: 1.5rem; line-height: 1.5; flex-grow: 1; }

.author-info { display: flex; align-items: center; margin-bottom: 15px; border-top: 1px solid #f0f0f0; padding-top: 15px; }
.avatar {
  width: 35px; height: 35px;
  background-color: #1e3a8a;
  color: white;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  margin-right: 10px;
}
.details { display: flex; flex-direction: column; }
.author-name { font-weight: bold; font-size: 0.85rem; color: #333; }
.author-uni { font-size: 0.75rem; color: #888; }

.btn-read-card {
  width: 100%;
  padding: 10px;
  background-color: white;
  color: #1e3a8a;
  border: 1px solid #1e3a8a;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-read-card:hover {
  background-color: #1e3a8a;
  color: white;
}

.no-results {
  text-align: center;
  color: #777;
  margin-top: 2rem;
  font-size: 1.1rem;
}
</style>