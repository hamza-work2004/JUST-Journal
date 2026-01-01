<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 1. متغير لتخزين الأبحاث
const allResearches = ref([]);
const isLoading = ref(true);

// 2. دالة جلب البيانات
const fetchAllResearches = async () => {
  try {
    // === كود الربط الحقيقي (شيل التعليق لما يجهز الباك إند) ===
    // const response = await axios.get('http://localhost:3000/api/editor/all-research');
    // allResearches.value = response.data;
    
    // === بيانات وهمية للمحاكاة (عشان تشوف النتيجة هسا) ===
    setTimeout(() => {
      allResearches.value = [
        { id: 101, title: 'Deep Learning in Medical Imaging', author: 'Dr. Maria Garcia', field: 'Medical AI', date: '2025-10-15', status: 'Submitted' },
        { id: 102, title: 'Blockchain for Supply Chain', author: 'Eng. John Doe', field: 'Cyber Security', date: '2025-10-18', status: 'Under Review' },
        { id: 103, title: 'Renewable Energy Systems', author: 'Sarah Smith', field: 'Engineering', date: '2025-10-20', status: 'Published' },
        { id: 104, title: 'Impact of AI on Education', author: 'Ali Ahmad', field: 'Education', date: '2025-10-22', status: 'Submitted' },
      ];
      isLoading.value = false;
    }, 500);

  } catch (error) {
    console.error("Error fetching researches:", error);
    isLoading.value = false;
  }
};

// تشغيل الدالة أول ما تفتح الصفحة
onMounted(() => {
  fetchAllResearches();
});

// دالة لتلوين الحالة
const getStatusClass = (status) => {
  if (status === 'Published') return 'status-published';
  if (status === 'Under Review') return 'status-review';
  return 'status-submitted';
};
</script>

<template>
  <div class="all-research-page">
    
    <div class="page-header">
      <h2>All Submitted Researches</h2>
      <p>List of all research papers submitted to the journal.</p>
    </div>

    <div class="table-card">
      
      <div v-if="isLoading" class="loading-state">
        Loading researches...
      </div>

      <table v-else class="research-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Field</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in allResearches" :key="item.id">
            <td>#{{ item.id }}</td>
            <td class="title-cell">{{ item.title }}</td>
            <td class="author-cell">{{ item.author }}</td>
            <td>{{ item.field }}</td>
            <td>{{ item.date }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(item.status)]">
                {{ item.status }}
              </span>
            </td>
          </tr>

          <tr v-if="allResearches.length === 0">
            <td colspan="6" class="empty-state">No researches found in the database.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.all-research-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.page-header { margin-bottom: 25px; }
.page-header h2 { color: #1b396a; font-size: 1.8rem; margin-bottom: 5px; }
.page-header p { color: #666; }

/* كرت الجدول */
.table-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

/* تنسيقات الجدول */
.research-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.research-table th {
  background-color: #f8f9fa;
  padding: 15px;
  border-bottom: 2px solid #e9ecef;
  color: #495057;
  font-weight: 600;
}

.research-table td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  color: #555;
  vertical-align: middle;
}

.research-table tr:hover { background-color: #f8faff; }

.title-cell { font-weight: 600; color: #1b396a; max-width: 300px; }
.author-cell { font-weight: 500; color: #333; }

/* ألوان الحالة */
.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}
.status-submitted { background-color: #e3f2fd; color: #1976d2; }
.status-review { background-color: #fff3e0; color: #f57c00; }
.status-published { background-color: #e8f5e9; color: #388e3c; }

.loading-state, .empty-state {
  text-align: center;
  padding: 40px;
  color: #777;
  font-size: 1.1rem;
}
</style>