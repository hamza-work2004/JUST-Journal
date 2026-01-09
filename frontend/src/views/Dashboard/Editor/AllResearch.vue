<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 1. رابط السيرفر
const API_BASE_URL = 'http://localhost:8080';

const allResearches = ref([]);
const isLoading = ref(true);

// 2. دالة جلب البيانات
const fetchAllResearches = async () => {
 try {
    isLoading.value = true;
    const response = await axios.get(`${API_BASE_URL}/getAllResearches`);
    
    if (response.data && response.data.data) {
        // ✅ التعديل هنا: هذا السطر برتب المصفوفة تصاعدياً حسب الـ ID
        allResearches.value = response.data.data.sort((a, b) => a.id - b.id);
    }

  } catch (error) {
    console.error("Error fetching researches:", error);
    alert('فشل في جلب البيانات من السيرفر');
  } finally {
    isLoading.value = false;
  }
};

// 3. دالة فتح الملف (نفس المنطق الذي أصلحناه سابقاً)
const viewResearch = (fileData) => {
    if (!fileData) {
        alert('لا يوجد ملف مرفق لهذا البحث');
        return;
    }
    // إصلاح المسار وتبديل الـ Backslashes
    let fixedPath = fileData.replace(/\\/g, "/");
    const fileUrl = `${API_BASE_URL}/${fixedPath}`; 
    window.open(fileUrl, '_blank');
};

// تشغيل الدالة أول ما تفتح الصفحة
onMounted(() => {
  fetchAllResearches();
});

// دالة لتلوين الحالة (محدثة لتناسب قيم الداتابيز عندك)
const getStatusClass = (status) => {
  if (!status) return 'status-submitted';
  
  // تحويل النص لحروف صغيرة للمقارنة
  const s = status.toLowerCase();
  
  if (s.includes('publish') || s === 'approved') return 'status-published';
  if (s.includes('review')) return 'status-review'; // تشمل 'under_review' و 'in review'
  if (s.includes('reject')) return 'status-rejected';
  
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
            <th>Type</th> <th>Field</th>
            <th>Date</th>
            <th>Status</th>
            <th>File</th> </tr>
        </thead>
        <tbody>
          <tr v-for="item in allResearches" :key="item.id">
            <td>#{{ item.id }}</td>
            
            <td class="title-cell">{{ item.research_title }}</td>
            <td class="type-cell">{{ item.type_research }}</td>
            <td>{{ item.research_field }}</td>
            
            <td>{{ new Date(item.created_at).toLocaleDateString() }}</td>
            
            <td>
              <span :class="['status-badge', getStatusClass(item.status_research)]">
                {{ item.status_research }}
              </span>
            </td>

            <td class="center-text">
                <button class="btn-view" @click="viewResearch(item.address_file)">
                    📄 View
                </button>
            </td>
          </tr>

          <tr v-if="allResearches.length === 0">
            <td colspan="7" class="empty-state">No researches found in the database.</td>
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
  padding: 20px;
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
  overflow-x: auto; /* مهم جداً لو الجدول عريض */
}

/* تنسيقات الجدول */
.research-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 800px;
}

.research-table th {
  background-color: #f8f9fa;
  padding: 15px;
  border-bottom: 2px solid #e9ecef;
  color: #1b396a; /* غيرت اللون ليتناسق مع الثيم */
  font-weight: 700;
}

.research-table td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  color: #555;
  vertical-align: middle;
}

.research-table tr:hover { background-color: #f8faff; }

.title-cell { font-weight: 600; color: #1b396a; max-width: 250px; }
.type-cell { font-weight: 500; color: #333; }

/* ألوان الحالة */
.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}
.status-submitted { background-color: #e3f2fd; color: #1976d2; } /* أزرق */
.status-review { background-color: #fff3cd; color: #856404; } /* أصفر */
.status-published { background-color: #d4edda; color: #155724; } /* أخضر */
.status-rejected { background-color: #f8d7da; color: #721c24; } /* أحمر */

/* زر العرض */
.btn-view {
    background: transparent;
    border: 1px solid #1b396a;
    color: #1b396a;
    padding: 6px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
}
.btn-view:hover {
    background-color: #1b396a;
    color: white;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 40px;
  color: #777;
  font-size: 1.1rem;
}
</style>