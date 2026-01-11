<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Navbar from '../components/navbar.vue'; // تأكد من المسار

const API_BASE_URL = 'http://localhost:8080';
const approvedResearches = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    const res = await axios.get(`${API_BASE_URL}/postedResearches`);
    approvedResearches.value = res.data;
  } catch (error) {
    console.error("Error fetching researches", error);
  } finally {
    isLoading.value = false;
  }
});

// 🔥 البحث الشامل: يشمل العنوان، الكاتب، التصنيف، والملخص
const filteredResearches = computed(() => {
  if (!approvedResearches.value) return [];
  
  const query = searchQuery.value.toLowerCase();

  return approvedResearches.value.filter(r => 
    (r.title && r.title.toLowerCase().includes(query)) ||
    (r.category && r.category.toLowerCase().includes(query)) ||
    (r.author && r.author.toLowerCase().includes(query)) ||   // ✅ بحث باسم الكاتب
    (r.abstract && r.abstract.toLowerCase().includes(query))  // ✅ بحث بالملخص
  );
});

const openFile = (filePath) => {
  if(filePath) {
    const cleanPath = filePath.replace(/\\/g, "/");
    window.open(`${API_BASE_URL}/${cleanPath}`, '_blank');
  } else {
    alert("No file attached.");
  }
};

const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';
</script>

<template>
  <div class="home-container">
    <Navbar />

    <header class="hero-section">
      <h1>Welcome to JUST Journal</h1>
      <p>A leading scientific platform dedicated to publishing high-quality academic research.</p>
      
      <div class="search-box">
        <input type="text" v-model="searchQuery" placeholder="Search by title, author, field, or abstract..." />
        <span class="search-icon">🔍</span>
      </div>
    </header>

    <section class="research-section">
      <div class="section-header">
        <h2>Recently Published Research</h2>
        <p>Explore the latest scientific findings</p>
      </div>

      <div v-if="isLoading" class="loading">Loading researches...</div>

      <div v-else class="cards-grid">
        <div v-for="item in filteredResearches" :key="item.id" class="article-card">
          <span class="badge">{{ item.category || 'General' }}</span>
          <h3>{{ item.title }}</h3>
          <p class="description">{{ item.abstract || 'No abstract available.' }}</p>
          
          <div class="author-info">
            <div class="avatar">{{ getInitial(item.author) }}</div>
            <div class="details">
              <span class="author-name">{{ item.author }}</span>
              <span class="author-uni">{{ item.date ? new Date(item.date).toLocaleDateString() : 'Now' }}</span>
            </div>
          </div>

          <button @click="openFile(item.filePath)" class="btn-read-card">Read Research 📄</button>
        </div>
      </div>

      <div v-if="!isLoading && filteredResearches.length === 0" class="no-results">
        <p>No researches found matching your search.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container { font-family: 'Segoe UI', sans-serif; color: #333; }

/* Hero */
.hero-section { text-align: center; padding: 4rem 2rem; background: linear-gradient(to bottom, #f0f4ff, #ffffff); }
.hero-section h1 { color: #1e3a8a; font-size: 2.5rem; margin-bottom: 1rem; }
.hero-section p { max-width: 800px; margin: 0 auto 2rem; color: #555; font-size: 1.1rem; }

/* Search Box */
.search-box { position: relative; max-width: 500px; margin: 0 auto; }
.search-box input { width: 100%; padding: 12px 40px 12px 20px; border-radius: 30px; border: 1px solid #ccc; outline: none; transition: 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.search-box input:focus { border-color: #1e3a8a; box-shadow: 0 0 8px rgba(30, 58, 138, 0.2); }
.search-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #888; }

/* Grid System - الحل لمشكلة الكرت الكبير */
.research-section { padding: 3rem 4rem; background-color: #f9fafb; min-height: 500px; }
.cards-grid {
  display: grid;
  /* 🔥 هذا السطر هو الحل: auto-fill بتمنع الكرت الواحد إنه يوخذ مساحة السطر كامل */
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

/* Card Styles */
.article-card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eee; display: flex; flex-direction: column; transition: transform 0.2s; }
.article-card:hover { transform: translateY(-5px); }
.badge { align-self: flex-start; background-color: #e0e7ff; color: #1e3a8a; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; margin-bottom: 10px; }
.article-card h3 { margin: 0.5rem 0; font-size: 1.25rem; color: #111; line-height: 1.4; }
.description { font-size: 0.9rem; color: #666; margin-bottom: 1.5rem; line-height: 1.5; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.author-info { display: flex; align-items: center; margin-bottom: 15px; border-top: 1px solid #f0f0f0; padding-top: 15px; }
.avatar { width: 35px; height: 35px; background-color: #1e3a8a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px; }
.details { display: flex; flex-direction: column; }
.author-name { font-weight: bold; font-size: 0.85rem; color: #333; }
.author-uni { font-size: 0.75rem; color: #888; }
.btn-read-card { width: 100%; padding: 10px; background-color: white; color: #1e3a8a; border: 1px solid #1e3a8a; border-radius: 6px; cursor: pointer; font-weight: 600; transition: 0.2s; }
.btn-read-card:hover { background-color: #1e3a8a; color: white; }
.loading, .no-results { text-align: center; color: #777; margin-top: 2rem; font-size: 1.1rem; }
</style>