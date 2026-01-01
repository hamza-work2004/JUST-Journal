<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// محاكاة لعدد الإشعارات
const notificationCount = ref(3);
const userInitial = ref('A'); // الحرف الأول من اسم اليوزر

const logout = () => {
  localStorage.clear();
  router.push('/login');
};
</script>

<<template>
  <nav class="author-navbar">
    
    <div class="nav-links">
      <router-link 
        to="/author" 
        class="nav-item" 
        exact-active-class="active"
      >
        Home
      </router-link>

      <router-link to="/author/create" class="nav-item" active-class="active">Create New Research</router-link>
      <router-link to="/author/my-research" class="nav-item" active-class="active">My Research</router-link>
    </div>

    <div class="nav-actions">
      <div class="notification-icon">
        <span class="bell">🔔</span> <span v-if="notificationCount > 0" class="badge">{{ notificationCount }}</span>
      </div>
      <div class="user-avatar" @click="logout" title="Logout">
        {{ userInitial }}
      </div>
    </div>

  </nav>
</template> 

<style scoped>
.author-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1b396a; /* نفس اللون الكحلي اللي بالصورة */
  padding: 10px 30px;
  color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* تنسيق الروابط */
.nav-links {
  display: flex;
  gap: 20px;
}

.nav-item {
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.3s, color 0.3s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

/* تنسيق الرابط النشط (لما تكون فاتح الصفحة) */
.active {
  background-color: white;
  color: #1b396a !important; /* النص بصير كحلي والخلفية بيضاء زي الستايل القديم */
  font-weight: bold;
}

/* القسم اليمين */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* الإشعارات */
.notification-icon {
  position: relative;
  cursor: pointer;
  font-size: 1.2rem;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4d4f; /* لون أحمر للإشعار */
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 5px;
  border-radius: 50%;
  border: 1px solid #1b396a;
}

/* الأفاتار */
.user-avatar {
  width: 35px;
  height: 35px;
  background-color: #ff5722; /* لون برتقالي زي الصورة */
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid white;
}
</style>