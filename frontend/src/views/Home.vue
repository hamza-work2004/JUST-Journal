<!-- <script setup>
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
</style> -->

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
// تأكد أن مسار الناف بار صحيح حسب مشروعك
import Navbar from '../components/navbar.vue'; 

// إعداد رابط السيرفر (مهم جداً)
const API_BASE_URL = 'http://localhost:8080';

// المتغيرات
const approvedResearches = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    // 1. الاتصال بالباك إند (تأكدنا من الرابط والبورت)
    const res = await axios.get(`${API_BASE_URL}/postedResearches`);
    
    // الباك إند برجع مصفوفة مباشرة حسب الكود الأخير
    approvedResearches.value = res.data; 
  } catch (error) {
    console.error("Error fetching researches", error);
  } finally {
    isLoading.value = false;
  }
});

// الفلترة (Title أو Category)
const filteredResearches = computed(() => {
  if (!approvedResearches.value) return [];
  
  return approvedResearches.value.filter(r => 
    (r.title && r.title.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
    (r.category && r.category.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

// 2. فتح الملف (PDF)
const openFile = (filePath) => {
  if(filePath) {
    // تنظيف المسار في حال كان فيه مشاكل بالسلاش
    const cleanPath = filePath.replace(/\\/g, "/");
    // فتح الرابط الكامل
    window.open(`${API_BASE_URL}/${cleanPath}`, '_blank');
  } else {
    alert("No file attached.");
  }
};

// جلب الحرف الأول للاسم
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
      
      <div class="search-box">
        <input type="text" v-model="searchQuery" placeholder="Search by title or category..." />
      </div>
    </header>

    <section class="research-section">
      <div class="section-header">
        <h2>Recently Published Research</h2>
        <p>Explore the latest scientific findings</p>
      </div>

      <div v-if="isLoading" style="text-align: center; padding: 20px; font-size: 1.2rem;">
        Loading researches...
      </div>

      <div v-else class="cards-grid">
        <div v-for="item in filteredResearches" :key="item.id" class="article-card">
          
          <span class="badge">{{ item.category || 'Research' }}</span>
          
          <h3>{{ item.title }}</h3>
          
          <p class="description" :title="item.abstract">
            {{ item.abstract || 'No abstract available.' }}
          </p>
          
          <div class="author-info">
            <div class="avatar">{{ getInitial(item.author) }}</div>
            <div class="details">
              <span class="author-name">{{ item.author || 'Unknown Researcher' }}</span>
              <span class="author-uni">
                {{ item.date ? new Date(item.date).toLocaleDateString() : 'Just Now' }}
              </span>
            </div>
          </div>

          <button @click="openFile(item.filePath)" class="btn-read-card">
            Read Research 📄
          </button>
        </div>
      </div>

      <div v-if="!isLoading && filteredResearches.length === 0" class="no-results">
        <p>No published researches found yet.</p>
      </div>
    </section>

  </div>
</template>

<style scoped>
.home-container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }

/* Hero Section */
.hero-section { text-align: center; padding: 4rem 2rem; background: linear-gradient(to bottom, #f0f4ff, #ffffff); }
.hero-section h1 { color: #1e3a8a; font-size: 2.5rem; margin-bottom: 1rem; }
.hero-section p { max-width: 800px; margin: 0 auto 2rem auto; color: #555; line-height: 1.6; font-size: 1.1rem; }

.search-box input {
    padding: 12px 20px; width: 300px; border-radius: 30px; border: 1px solid #ccc; outline: none; transition: 0.3s;
}
.search-box input:focus { border-color: #1e3a8a; box-shadow: 0 0 8px rgba(30, 58, 138, 0.2); }

/* Research Section */
.research-section { padding: 3rem 4rem; background-color: #f9fafb; min-height: 500px; }
.section-header { text-align: center; margin-bottom: 3rem; }
.section-header h2 { color: #1e3a8a; margin-bottom: 0.5rem; }
.section-header p { color: #666; }

.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }

.article-card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; border: 1px solid #eee; display: flex; flex-direction: column; }
.article-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }

.badge { align-self: flex-start; background-color: #e0e7ff; color: #1e3a8a; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; }

.article-card h3 { margin: 0.5rem 0; font-size: 1.25rem; color: #111; line-height: 1.4; }
.description { font-size: 0.9rem; color: #666; margin-bottom: 1.5rem; line-height: 1.5; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

.author-info { display: flex; align-items: center; margin-bottom: 15px; border-top: 1px solid #f0f0f0; padding-top: 15px; }
.avatar { width: 35px; height: 35px; background-color: #1e3a8a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; margin-right: 10px; }
.details { display: flex; flex-direction: column; }
.author-name { font-weight: bold; font-size: 0.85rem; color: #333; }
.author-uni { font-size: 0.75rem; color: #888; }

.btn-read-card { width: 100%; padding: 10px; background-color: white; color: #1e3a8a; border: 1px solid #1e3a8a; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
.btn-read-card:hover { background-color: #1e3a8a; color: white; }
.no-results { text-align: center; color: #777; margin-top: 2rem; font-size: 1.1rem; }
</style>