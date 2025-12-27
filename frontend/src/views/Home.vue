<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
// 1. استدعاء الكومبوننت
import Navbar from '../components/navbar.vue';

// المتغيرات
const approvedResearches = ref([]);
const searchQuery = ref(''); // رح نربطها مع الناف بار بالخطوة الجاي

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/approved-researches');
    approvedResearches.value = res.data;
  } catch (error) {
    console.error("Error fetching researches", error);
  }
});

// الفلترة
const filteredResearches = computed(() => {
  return approvedResearches.value.filter(r => 
    r.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (r.category && r.category.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

const openFile = (filename) => {
  if(filename) {
    window.open(`http://localhost:3000/uploads/${filename}`, '_blank');
  } else {
    alert("No file attached.");
  }
};

const getInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : 'U';
};
</script>

<template>
  <div class="home-container">
    
    <Navbar />

    <header class="hero-section">
      <h1>Welcome to JUST Journal</h1>
      <p>
        A leading scientific platform dedicated to publishing high-quality academic research across diverse disciplines.
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
            {{ item.abstract || 'Click to read details.' }}
          </p>
          
          <div class="author-info">
            <div class="avatar">{{ getInitial(item.author) }}</div>
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
/* حذفت كل كود الـ Navbar من هون 
   لأنه صار موجود في ملف components/Navbar.vue 
*/

.home-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

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
.article-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }

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
.btn-read-card:hover { background-color: #1e3a8a; color: white; }
.no-results { text-align: center; color: #777; margin-top: 2rem; font-size: 1.1rem; }
</style>