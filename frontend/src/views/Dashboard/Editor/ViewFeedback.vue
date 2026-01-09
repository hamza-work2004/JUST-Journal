<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// رابط السيرفر
const API_BASE_URL = 'http://localhost:8080';

const feedbacks = ref([]);
const isLoading = ref(false);

// 1. جلب الرسائل من الباك إند
const fetchFeedbacks = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${API_BASE_URL}/feedback`);
    
    if(response.data && response.data.data) {
        feedbacks.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching feedback:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
    fetchFeedbacks();
});

// 2. دالة الرد (تفتح الإيميل مع عنوان افتراضي)
const replyToUser = (email) => {
    const mailSubject = "Re: Your Feedback to Just Journal";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(mailSubject)}`;
};

// تنسيق التاريخ
const formatDate = (dateString) => {
    if(!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
    });
};
</script>

<template>
  <div class="feedback-container">
    
    <div class="page-header">
        <h3 class="page-title">User Feedback</h3>
        <p>View inquiries and feedback sent by users.</p>
    </div>

    <div v-if="isLoading" class="loading-state">Loading messages...</div>

    <div v-else class="table-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th style="width: 50px;">#</th>
            <th>Sender Name</th>
            <th>Email</th>
            <th>Message</th> <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in feedbacks" :key="item.id">
            <td>{{ index + 1 }}</td>
            
            <td class="name-cell">{{ item.name }}</td>
            
            <td>{{ item.email }}</td>
            
            <td class="message-cell" :title="item.message">
                {{ item.message }}
            </td>
            
            <td style="font-size: 0.85rem; color: #666; white-space: nowrap;">
                {{ formatDate(item.created_at) }}
            </td>

            <td class="center-text">
                <button class="btn-reply" @click="replyToUser(item.email)">
                    📧 Reply
                </button>
            </td>
          </tr>

          <tr v-if="feedbacks.length === 0">
            <td colspan="6" class="empty-state">No feedback messages found.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.feedback-container { font-family: 'Segoe UI', sans-serif; color: #333; padding: 20px; }
.page-header { margin-bottom: 25px; }
.page-title { color: #1b396a; font-size: 1.5rem; font-weight: 700; margin-bottom: 5px; }
.page-header p { color: #666; font-size: 0.95rem; }

.table-wrapper { border: 1px solid #ddd; background: white; border-radius: 4px; overflow-x: auto; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.custom-table { width: 100%; border-collapse: collapse; min-width: 900px; }
.custom-table th, .custom-table td { border-bottom: 1px solid #eee; padding: 14px 15px; text-align: left; vertical-align: top; font-size: 0.95rem; }
.custom-table th { background-color: #f8f9fa; font-weight: 700; color: #1b396a; border-bottom: 2px solid #e9ecef; }

.name-cell { font-weight: 600; color: #333; white-space: nowrap; }
.message-cell { max-width: 400px; line-height: 1.5; color: #555; }

.btn-reply {
    background-color: transparent;
    border: 1px solid #1b396a;
    color: #1b396a;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}
.btn-reply:hover {
    background-color: #1b396a;
    color: white;
}

.loading-state, .empty-state { text-align: center; padding: 40px; color: #777; font-size: 1.1rem; }
</style>