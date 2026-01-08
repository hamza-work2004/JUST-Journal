<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const notifications = ref([]);
const isLoading = ref(false);

const fetchNotifications = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  isLoading.value = true;
  try {
    // الرابط حسب ما هو معرف في السيرفر
    const response = await axios.get(`http://localhost:8080/myNotifications/${userId}`);
    
    // البيانات راجعة في response.data.data حسب كود الباك اند تبعك
    notifications.value = response.data.data || [];

  } catch (error) {
    console.error("Error fetching notifications:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchNotifications();
});

// دالة تنسيق التاريخ والوقت
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};
</script>

<template>
  <div class="notifications-container">
    <h2>My Notifications</h2>

    <div v-if="isLoading" class="loading">Loading notifications...</div>

    <div v-else class="notifications-list">
      
      <div v-if="notifications.length === 0" class="empty-state">
        <p>You have no notifications yet.</p>
      </div>

      <div 
        v-for="note in notifications" 
        :key="note.id" 
        class="notification-card"
        :class="{ 'unread': note.is_read === 0 }" 
      >
        <div class="note-icon">🔔</div>
        <div class="note-content">
          <h4>{{ note.title }}</h4> <p>{{ note.message }}</p> <span class="note-time">{{ formatDate(note.created_at) }}</span>
        </div>
        <div v-if="note.is_read === 0" class="new-badge">New</div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.notifications-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

h2 { margin-bottom: 20px; color: #333; }

.notification-card {
  display: flex;
  align-items: flex-start;
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border-left: 5px solid #ddd; /* لون الشريط للي انقرأ */
  position: relative;
  transition: transform 0.2s;
}

/* ستايل خاص للإشعار الجديد */
.notification-card.unread {
  background-color: #f0f9ff; /* خلفية سماوية فاتحة */
  border-left-color: #1b396a; /* شريط كحلي */
}

.note-icon {
  font-size: 1.5rem;
  margin-right: 15px;
}

.note-content h4 {
  margin: 0 0 5px 0;
  color: #1b396a;
}

.note-content p {
  margin: 0 0 10px 0;
  color: #555;
  line-height: 1.5;
}

.note-time {
  font-size: 0.85rem;
  color: #999;
}

.new-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #e74c3c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #888;
  background: #fff;
  border-radius: 8px;
}
</style>