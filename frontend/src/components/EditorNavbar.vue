<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const API_BASE_URL = 'http://localhost:8080';

// المتغيرات
const userInitial = ref('E');
const userPhoto = ref(null); // لرابط الصورة
const notifications = ref([]);
const unreadCount = ref(0);
const showNotifDropdown = ref(false);
const showProfileDropdown = ref(false);

// جلب معلومات المستخدم (الصورة + الاسم)
const fetchUserInfo = async () => {
  const userId = localStorage.getItem('userId'); // نفترض أنك مخزن الـ ID عند تسجيل الدخول
  if (!userId) return;

  try {
    // نستخدم نفس راوت المعلومات اللي سويناه للـ Author
    const response = await axios.get(`${API_BASE_URL}/information/${userId}`);
    if (response.data && response.data.data) {
        const user = response.data.data;
        userInitial.value = user.name ? user.name.charAt(0).toUpperCase() : 'E';
        
        if (user.profile_photo_path) {
            // تنظيف المسار للعرض
            const fixedPath = user.profile_photo_path.replace(/\\/g, "/");
            userPhoto.value = `${API_BASE_URL}/${fixedPath}`;
        }
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

// جلب الإشعارات
const fetchNotifications = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  try {
    const response = await axios.get(`${API_BASE_URL}/myNotifications/${userId}`);
    if (response.data && response.data.data) {
        notifications.value = response.data.data;
        // حساب عدد غير المقروءة (status = 0)
        unreadCount.value = notifications.value.filter(n => n.status === 0).length;
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

// تشغيل عند التحميل
onMounted(() => {
    fetchUserInfo();
    fetchNotifications();
    
    // عمل تحديث دوري للإشعارات كل 30 ثانية (اختياري)
    setInterval(fetchNotifications, 30000);
});

// دوال التحكم بالقوائم
const toggleNotifications = () => {
    showNotifDropdown.value = !showNotifDropdown.value;
    showProfileDropdown.value = false;
};

const toggleProfile = () => {
    showProfileDropdown.value = !showProfileDropdown.value;
    showNotifDropdown.value = false;
};

const logout = () => {
  localStorage.clear();
  router.push('/login');
};

// إغلاق القوائم عند النقر خارجها
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
      <router-link to="/editor" class="nav-item" exact>Home</router-link>
      <router-link to="/editor/all-research" class="nav-item">All Research</router-link>
      <router-link to="/editor/send-for-review" class="nav-item">Send for Review</router-link>
      <router-link to="/editor/final-decision" class="nav-item">Final Decision</router-link>
      <router-link to="/editor/promotion" class="nav-item">Promotion</router-link>
      <router-link to="/editor/visitor-reviews" class="nav-item">Visitor Reviews</router-link>
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
                <li v-for="notif in notifications" :key="notif.id" :class="{ 'unread': notif.status === 0 }">
                    <p class="notif-title">{{ notif.title }}</p>
                    <p class="notif-body">{{ notif.message }}</p>
                    <span class="notif-date">{{ new Date(notif.created_at).toLocaleDateString() }}</span>
                </li>
            </ul>
        </div>
      </div>

      <div class="profile-wrapper" @click.stop="toggleProfile">
          <div class="user-avatar" title="My Profile">
            <img v-if="userPhoto" :src="userPhoto" alt="Profile" class="avatar-img" />
            <span v-else>{{ userInitial }}</span>
          </div>

          <div v-if="showProfileDropdown" class="dropdown-menu profile-dropdown">
              <router-link to="/editor/profile" class="dropdown-item">⚙️ Settings & Photo</router-link>
              <router-link to="/editor/change-password" class="dropdown-item">🔒 Change Password</router-link>
              <div class="dropdown-divider"></div>
              <a @click="logout" class="dropdown-item logout-item">🚪 Logout</a>
          </div>
      </div>

    </div>
  </nav>
</template>

<style scoped>
/* الأساسيات */
.navbar {
  display: flex; justify-content: space-between; align-items: center;
  background-color: #1e3a8a; /* الكحلي الموحد */
  padding: 0 30px; height: 60px;
  color: white; font-family: 'Segoe UI', sans-serif;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative; z-index: 1000;
}

/* الروابط */
.nav-links { display: flex; gap: 10px; }
.nav-item {
  color: rgba(255,255,255,0.85); text-decoration: none; font-size: 13px;
  padding: 8px 12px; border-radius: 4px; transition: all 0.2s; font-weight: 500;
}
.nav-item:hover { background-color: rgba(255, 255, 255, 0.1); color: white; }
.router-link-exact-active {
  background-color: white !important; color: #1e3a8a !important; font-weight: 700;
}

/* الجزء الأيمن */
.nav-right { display: flex; align-items: center; gap: 20px; position: relative; }

/* الإشعارات */
.notification-icon { position: relative; cursor: pointer; display: flex; align-items: center; }
.badge {
  position: absolute; top: -6px; right: -6px;
  background-color: #ef4444; color: white; border-radius: 50%;
  font-size: 10px; width: 18px; height: 18px;
  display: flex; justify-content: center; align-items: center;
  font-weight: bold; border: 2px solid #1e3a8a;
}

/* البروفايل */
.profile-wrapper { position: relative; cursor: pointer; }
.user-avatar {
  background-color: #f97316; color: white; width: 38px; height: 38px;
  border-radius: 50%; display: flex; justify-content: center; align-items: center;
  font-weight: bold; font-size: 16px; border: 2px solid white; overflow: hidden;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }

/* القوائم المنسدلة (Dropdowns) */
.dropdown-menu {
    position: absolute; top: 50px; right: 0;
    background: white; color: #333;
    border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    width: 250px; overflow: hidden; animation: fadeIn 0.2s ease;
    border: 1px solid #eee;
}

.notifications-dropdown { width: 300px; max-height: 400px; overflow-y: auto; }

.dropdown-header {
    background: #f8f9fa; padding: 10px; font-weight: bold; font-size: 0.9rem;
    border-bottom: 1px solid #eee; color: #1e3a8a;
}

/* عناصر الإشعارات */
.notif-list { list-style: none; padding: 0; margin: 0; }
.notif-list li { padding: 12px; border-bottom: 1px solid #f1f1f1; transition: background 0.2s; }
.notif-list li:hover { background-color: #f9faff; }
.notif-list li.unread { background-color: #eef2ff; border-left: 3px solid #f97316; }
.notif-title { font-weight: 700; font-size: 0.85rem; margin: 0 0 4px 0; color: #333; }
.notif-body { font-size: 0.8rem; color: #666; margin: 0; line-height: 1.4; }
.notif-date { font-size: 0.7rem; color: #999; display: block; margin-top: 5px; text-align: right; }
.no-notif { padding: 20px; text-align: center; color: #888; font-size: 0.9rem; }

/* عناصر البروفايل */
.dropdown-item {
    display: block; padding: 12px 20px; color: #444; text-decoration: none;
    font-size: 0.9rem; transition: background 0.2s; cursor: pointer;
}
.dropdown-item:hover { background-color: #f1f5f9; color: #1e3a8a; }
.logout-item { color: #dc3545; font-weight: 600; }
.logout-item:hover { background-color: #fff1f2; }
.dropdown-divider { height: 1px; background-color: #eee; margin: 4px 0; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>