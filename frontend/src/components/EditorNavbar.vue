<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// محاكاة لعدد الإشعارات (حسب الصورة 5)
const notificationCount = ref(5);
const userInitial = ref('E'); // E for Editor

const logout = () => {
  localStorage.clear();
  router.push('/login');
};
</script>

<template>
  <nav class="editor-navbar">
    
    <div class="nav-links">
      <router-link 
        to="/editor" 
        class="nav-item" 
        exact-active-class="active"
      >
        Home
      </router-link>

      <router-link to="/editor/all-research" class="nav-item" active-class="active">View All Research</router-link>
      <router-link to="/editor/send-for-review" class="nav-item" active-class="active">Send Research for Review</router-link>
      <router-link to="/editor/final-decision" class="nav-item" active-class="active">Final Decision</router-link>
      <router-link to="/editor/promotion" class="nav-item" active-class="active">Researcher Promotion</router-link>
      <router-link to="/editor/visitor-reviews" class="nav-item" active-class="active">Visitor Reviews</router-link>
    </div>

    <div class="nav-actions">
      
      <div class="notification-icon">
        <span class="bell">🔔</span>
        <span v-if="notificationCount > 0" class="badge">{{ notificationCount }}</span>
      </div>

      <div class="user-avatar" @click="logout" title="Logout">
        {{ userInitial }}
      </div>

    </div>

  </nav>
</template>

<style scoped>
.editor-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1b396a; /* نفس اللون الكحلي */
  padding: 10px 30px;
  color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', sans-serif;
}

/* الروابط */
.nav-links {
  display: flex;
  gap: 15px; /* قللت المسافة شوي عشان يوسعوا كلهم */
  flex-wrap: wrap; /* عشان لو الشاشة زغرت ينزلوا سطر جديد */
}

.nav-item {
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem; /* صغرت الخط شوي عشان يتناسب مع العدد */
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.3s, color 0.3s;
  background-color: #f0f0f0; /* خلفية سكني فاتح جداً للأزرار غير المفعلة (حسب الصورة) */
  color: #333; /* لون النص أسود للأزرار غير المفعلة */
}

/* تنسيق الزر لما تمرر الماوس عليه */
.nav-item:hover {
  background-color: #e0e0e0;
}

/* تنسيق الرابط النشط (Active) */
.active {
  background-color: #f0f0f0; /* يبقى فاتح */
  color: #1b396a !important; /* النص يصير كحلي */
  font-weight: bold;
  border: 2px solid #1b396a; /* إطار وهمي لتمييزه إذا حبيت، أو تخليه زي الصورة */
}

/* في الصورة الأزرار كلها خلفيتها بيضاء/سكني والنص أسود */
/* رح أعدل الستايل ليطابق الصورة بالضبط */
.nav-item {
  background-color: #f5f5f5; 
  color: #000;
  border: 1px solid #ccc;
}

.active {
  background-color: #ffffff;
  border-color: #000;
  font-weight: 700;
}


/* القسم اليمين */
.nav-actions { display: flex; align-items: center; gap: 20px; }
.notification-icon { position: relative; cursor: pointer; font-size: 1.2rem; }
.badge { 
  position: absolute; top: -5px; right: -8px; 
  background-color: #ff5722; /* برتقالي */
  color: white; font-size: 0.75rem; font-weight: bold; 
  padding: 2px 6px; border-radius: 50%; border: 1px solid #1b396a; 
}
.user-avatar { 
  width: 40px; height: 40px; 
  background-color: #ff5722; /* برتقالي */
  color: white; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; 
  font-weight: bold; font-size: 1.2rem;
  cursor: pointer; border: 2px solid white; 
}
</style>