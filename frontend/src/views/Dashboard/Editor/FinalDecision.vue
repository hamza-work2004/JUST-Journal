<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// رابط السيرفر
const API_BASE_URL = 'http://localhost:8080';

const pendingDecisions = ref([]);
const isLoading = ref(false);

// 1. جلب البيانات من الباك إند
const fetchReviewedResearches = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${API_BASE_URL}/getReviewedResearches`);
    
    if(response.data && response.data.data) {
        pendingDecisions.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // alert("Failed to load reviewed researches");
  } finally {
    isLoading.value = false;
  }
};

// تشغيل الدالة عند فتح الصفحة
onMounted(() => {
    fetchReviewedResearches();
});

// 2. دالة اتخاذ القرار النهائي
const handleFinalDecision = async (id, decision) => {
  // decision رح تكون يا 'post' يا 'reject'
  const actionText = decision === 'post' ? 'Publish' : 'Reject';
  
  if(!confirm(`Are you sure you want to ${actionText} this research?`)) return;

  try {
    // إرسال الطلب للسيرفر
    await axios.put(`${API_BASE_URL}/updateStatusResearch/${id}`, {
        status: decision
    });

    // حذف البحث من القائمة محلياً بعد النجاح
    console.log(`${actionText} research ID: ${id}`);
    pendingDecisions.value = pendingDecisions.value.filter(item => item.id !== id);
    
    alert(`Research has been ${decision === 'post' ? 'Published' : 'Rejected'} successfully.`);

  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update status.");
  }
};
</script>

<template>
  <div class="final-decision-container">
    
    <h3 class="page-title">Final Decision</h3>

    <div v-if="isLoading" style="text-align: center; padding: 20px;">Loading...</div>

    <div v-else class="table-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th style="width: 50px;">#</th>
            <th>Reviewer Name</th>
            <th>Research Title</th>
            <th>Abstract</th>
            <th>Reviewer Decision</th>
            <th>Final Decision</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in pendingDecisions" :key="item.id">
            <td>{{ index + 1 }}</td>
            
            <td>{{ item.reviewer_name }}</td>
            <td>{{ item.research_title }}</td>
            <td class="abstract-cell">{{ item.abstract }}</td>
            
            <td>
              <span :class="['badge', (item.decision && item.decision.toLowerCase().includes('accept')) ? 'badge-accept' : 'badge-reject']">
                {{ item.decision }}
              </span>
            </td>

            <td>
              <div class="action-buttons">
                <button class="btn btn-publish" @click="handleFinalDecision(item.id, 'post')">Publish</button>
                <button class="btn btn-reject" @click="handleFinalDecision(item.id, 'reject')">Reject</button>
              </div>
            </td>
          </tr>

          <tr v-if="pendingDecisions.length === 0">
            <td colspan="6" class="empty-state">No reviewed researches pending decision.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.final-decision-container { font-family: 'Segoe UI', sans-serif; color: #333; padding: 20px; }
.page-title { color: #1b396a; font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; }
.table-wrapper { border: 1px solid #ddd; background: white; border-radius: 4px; overflow-x: auto; }
.custom-table { width: 100%; border-collapse: collapse; min-width: 900px; }
.custom-table th, .custom-table td { border: 1px solid #e0e0e0; padding: 12px 15px; text-align: left; vertical-align: middle; }
.custom-table th { background-color: #f9f9f9; font-weight: 700; color: #222; }
.abstract-cell { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.badge { padding: 6px 14px; border-radius: 20px; color: white; font-weight: 600; font-size: 0.85rem; }
.badge-accept { background-color: #28a745; }
.badge-reject { background-color: #dc3545; }
.action-buttons { display: flex; gap: 10px; }
.btn { padding: 6px 16px; border: none; border-radius: 4px; color: white; font-weight: 600; cursor: pointer; }
.btn-publish { background-color: #1b396a; }
.btn-reject { background-color: #dc3545; }
.empty-state { text-align: center; padding: 30px; color: #777; }
</style>