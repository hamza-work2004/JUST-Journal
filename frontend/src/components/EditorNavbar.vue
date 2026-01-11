<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const API_BASE_URL = 'http://localhost:8080';

const userInitial = ref('E');
const userPhoto = ref(null);
const notifications = ref([]);
const unreadCount = ref(0);
const showNotifDropdown = ref(false);
const showProfileDropdown = ref(false);

const fetchUserInfo = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;
  try {
    const response = await axios.get(`${API_BASE_URL}/information/${userId}`);
    if (response.data && response.data.data) {
        const user = response.data.data;
        userInitial.value = user.name ? user.name.charAt(0).toUpperCase() : 'E';
        if (user.profile_photo_path) {
            const fixedPath = user.profile_photo_path.replace(/\\/g, "/");
            userPhoto.value = `${API_BASE_URL}/${fixedPath}`;
        }
    }
  } catch (error) { console.error(error); }
};

const fetchNotifications = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;
  try {
    const response = await axios.get(`${API_BASE_URL}/myNotifications/${userId}`);
    if (response.data && response.data.data) {
        notifications.value = response.data.data;
        unreadCount.value = notifications.value.filter(n => n.is_read === 0).length;
    }
  } catch (error) { console.error(error); }
};

onMounted(() => {
    fetchUserInfo();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    onUnmounted(() => clearInterval(interval));
});

// فتح القائمة بدون تصفير العداد
const toggleNotifications = () => {
    showNotifDropdown.value = !showNotifDropdown.value;
    showProfileDropdown.value = false;
};

//   قراءة إشعار واحد عند التمرير
const markOneAsRead = (notification) => {
    if (notification.is_read === 1) return;
    
    notification.is_read = 1;
    if (unreadCount.value > 0) {
        unreadCount.value--;
    }
};

const toggleProfile = () => {
    showProfileDropdown.value = !showProfileDropdown.value;
    showNotifDropdown.value = false;
};

const logout = () => { localStorage.clear(); router.push('/login'); };

const closeDropdowns = (e) => {
    if (!e.target.closest('.nav-right')) {
        showNotifDropdown.value = false;
        showProfileDropdown.value = false;
    }
};
window.addEventListener('click', closeDropdowns);
onUnmounted(() => window.removeEventListener('click', closeDropdowns));
</script>

<template>
  <nav class="navbar">
    <div class="nav-links">
      <router-link to="/" class="logo-section">
        <h2>JUST Journal</h2>
    </router-link>
      <router-link to="/editor" class="nav-item" exact>Home</router-link>
      <router-link to="/editor/all-research" class="nav-item">All Research</router-link>
      <router-link to="/editor/send-for-review" class="nav-item">Send for Review</router-link>
      <router-link to="/editor/final-decision" class="nav-item">Final Decision</router-link>
      <router-link to="/editor/promotion" class="nav-item">Promotion</router-link>
      <!-- <router-link to="/editor/visitor-reviews" class="nav-item">Visitor Reviews</router-link> -->
      <router-link to="/editor/view-feedback" class="nav-item">View Feedback</router-link>
    </div>

    <div class="nav-right">
      
      <div class="notification-icon" @click.stop="toggleNotifications">
        <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fb923c" stroke="none">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>

        <div v-if="showNotifDropdown" class="dropdown-menu notifications-dropdown">
            <div class="dropdown-header">Notifications</div>
            <div v-if="notifications.length === 0" class="no-notif">No new notifications</div>
            
            <ul v-else class="notif-list">
                <li 
                  v-for="notif in notifications" 
                  :key="notif.id" 
                  :class="['notif-item', { 'unread': notif.is_read === 0 }]"
                  @mouseenter="markOneAsRead(notif)"
                >
                    <div class="notif-content">
                        <p class="notif-title">{{ notif.title }}</p>
                        <p class="notif-body">{{ notif.message }}</p>
                        <span class="notif-date">{{ new Date(notif.created_at).toLocaleDateString() }}</span>
                    </div>
                    <span v-if="notif.is_read === 0" class="blue-dot"></span>
                </li>
            </ul>
        </div>
      </div>

      <div class="profile-wrapper" @click.stop="toggleProfile">
          <div class="user-avatar">
            <img v-if="userPhoto" :src="userPhoto" alt="Profile" class="avatar-img" />
            <span v-else>{{ userInitial }}</span>
          </div>
          <div v-if="showProfileDropdown" class="dropdown-menu profile-dropdown">
              <router-link to="/editor/profile" class="dropdown-item">⚙️ Profile & Settings</router-link>
              <div class="dropdown-divider"></div>
              <a @click="logout" class="dropdown-item logout-item">🚪 Logout</a>
          </div>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  background-color: #1e3a8a; 
  padding: 0 30px; 
  height: 60px; 
  color: white; 
  font-family: 'Segoe UI', sans-serif; 
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  position: relative; 
  z-index: 1000; 
}
.nav-links { 
  display: flex; 
  gap: 15px; 
}
.nav-item { 
  color: rgba(255,255,255,0.85); 
  text-decoration: none; 
  font-size: 14px; 
  padding: 8px 16px; 
  border-radius: 4px; 
  transition: all 0.2s; 
  font-weight: 500; 
}
.nav-item:hover { 
  background-color: rgba(255, 255, 255, 0.1); 
  color: white; 
}
.router-link-exact-active { 
  background-color: white !important; 
  color: #1e3a8a !important; 
  font-weight: 700; 
}
.nav-right { 
  display: flex; 
  align-items: center; 
  gap: 20px; 
  position: relative; 
}

.notification-icon { 
  position: relative; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
}
.badge { 
  position: absolute; 
  top: -5px; 
  right: -5px; 
  background-color: #ef4444; 
  color: white; 
  border-radius: 50%; 
  font-size: 11px; 
  min-width: 18px; 
  height: 18px; 
  padding: 0 4px; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  font-weight: bold; 
  border: 2px solid #1e3a8a; 
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  transition: all 0.3s; 
}

.dropdown-menu { 
  position: absolute; 
  top: 50px; 
  right: 0; 
  background: white; 
  color: #333; 
  border-radius: 8px; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
  width: 250px; 
  overflow: hidden; 
  animation: fadeIn 0.2s ease; 
  border: 1px solid #eee; 
}
.notifications-dropdown { 
  width: 320px; 
  max-height: 450px; 
  overflow-y: auto;
}
.dropdown-header { 
  background: #f8f9fa; 
  padding: 12px; 
  font-weight: bold; 
  font-size: 0.95rem; 
  border-bottom: 1px solid #eee; 
  color: #1e3a8a; 
}

.notif-list { 
  list-style: none; 
  padding: 0; 
  margin: 0; 
}
.notif-item { 
  padding: 12px 15px; 
  border-bottom: 1px solid #f1f1f1; 
  transition: background 0.3s; 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  background-color: white; 
  cursor: default;
 }
.notif-item:hover { 
  background-color: #f9f9f9; 
}
.notif-item.unread { 
  background-color: #eef7ff; 
  border-left: 4px solid #1e3a8a; 
}
.notif-item.unread .notif-title { 
  font-weight: 800; 
  color: #1e3a8a; 
}
.notif-item.unread .notif-body { 
  font-weight: 600; 
  color: #333; 
}
.blue-dot { 
  width: 8px; 
  height: 8px; 
  background-color: #1e3a8a; 
  border-radius: 50%; 
  margin-top: 6px; 
  flex-shrink: 0; 
}

.notif-content { 
  flex: 1; 
  padding-right: 10px; 
}
.notif-title { 
  font-weight: 600; 
  font-size: 0.85rem; 
  margin: 0 0 4px 0; 
  color: #444; 
}
.notif-body { 
  font-size: 0.8rem; 
  color: #666; 
  margin: 0; 
  line-height: 1.4; 
}
.notif-date { 
  font-size: 0.7rem; 
  color: #999; 
  display: block; 
  margin-top: 5px; 
}
.no-notif { 
  padding: 20px; 
  text-align: center; 
  color: #888; 
  font-size: 0.9rem; 
}
.profile-wrapper { 
  position: relative; 
  cursor: pointer; 
}
.user-avatar { 
  background-color: #f97316; 
  color: white; 
  width: 38px; 
  height: 38px; 
  border-radius: 50%; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  font-weight: bold; 
  font-size: 16px; 
  border: 2px solid white; 
  overflow: hidden; 
}
.avatar-img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}
.dropdown-item { 
  display: block; 
  padding: 12px 20px; 
  color: #444; 
  text-decoration: none; 
  font-size: 0.9rem; 
  transition: background 0.2s; 
  cursor: pointer; 
}
.dropdown-item:hover { 
  background-color: #f1f5f9; 
  color: #1e3a8a; 
}
.logout-item { 
  color: #dc3545; 
  font-weight: 600; 
}
.logout-item:hover { 
  background-color: #fff1f2; 
}
.dropdown-divider { 
  height: 1px; 
  background-color: #eee; 
  margin: 4px 0; 
}

/* تنسيق الجزء الأيسر عشان اللوجو والروابط يجوا جنب بعض */
.nav-left {
    display: flex;
    align-items: center;
    gap: 25px;
}

/* 🔥 تنسيق اللوجو الفخم مع الأنيميشن 🔥 */
.logo-section {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.2;
    
    /* الإضافات الجديدة للأنيميشن */
    padding: 8px 14px; /* مسافة داخلية عشان الخلفية */
    border-radius: 8px; /* زوايا ناعمة */
    transition: all 0.3s ease-in-out; /* تنعيم الحركة */
    border: 2px solid transparent; /* حدود شفافة عشان الحجم ما يتغير عند الهوفر */
}

/* حالة الهوفر (عند مرور الماوس) */
.logo-section:hover {
    background-color: white; /* الخلفية تصير بيضاء */
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* ظل خفيف عشان يبرز */
    transform: translateY(-2px); /* حركة بسيطة للأعلى */
    border-color: white; /* تأكيد الحدود */
}

/* تنسيق العنوان الرئيسي H2 */
.logo-section h2 {
    margin: 0;
    color: white; /* اللون الأصلي أبيض */
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    transition: color 0.3s ease-in-out;
}

/* تغيير لون H2 عند الهوفر على الأب */
.logo-section:hover h2 {
    color: #1e3a8a; /* يصير كحلي */
}



@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes popIn { 0% { transform: scale(0); } 80% { transform: scale(1.2); } 100% { transform: scale(1); } }
</style>