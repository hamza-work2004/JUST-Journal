<script setup>
import { ref } from 'vue';

// بيانات وهمية (Mock Data) لحد ما نشبك مع الباك إند
const myResearches = ref([
  { id: 1, title: 'The Impact of AI on Healthcare', type: 'Original Research', field: 'Medical AI', status: 'Submitted' },
  { id: 2, title: 'Blockchain Security Analysis', type: 'Review Article', field: 'Cyber Security', status: 'Under Review' },
  { id: 3, title: 'Sustainable Energy Solutions', type: 'Case Study', field: 'Engineering', status: 'Published' }
]);

// دالة الحذف (مجرد محاكاة)
const deleteResearch = (id) => {
  if(confirm("Are you sure you want to delete this research?")) {
    myResearches.value = myResearches.value.filter(r => r.id !== id);
    alert("Research deleted successfully.");
  }
};

// دالة التعديل (ممكن توجه لصفحة تعديل لاحقاً)
const editResearch = (id) => {
  alert(`Edit research with ID: ${id}`);
};

// دالة لتلوين الحالة (Status Color)
const getStatusClass = (status) => {
  if (status === 'Published') return 'status-published';
  if (status === 'Under Review') return 'status-review';
  return 'status-submitted';
};
</script>

<template>
  <div class="my-research-container">
    
    <div class="page-header">
      <h2>My Research</h2>
    </div>

    <div class="table-card">
      <table class="research-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Field</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in myResearches" :key="item.id">
            <td class="title-cell">{{ item.title }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.field }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(item.status)]">
                {{ item.status }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button @click="editResearch(item.id)" class="btn-edit">Edit</button>
                <button @click="deleteResearch(item.id)" class="btn-delete">Delete</button>
              </div>
            </td>
          </tr>

          <tr v-if="myResearches.length === 0">
            <td colspan="5" class="empty-state">No research papers submitted yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.my-research-container {
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

.page-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #222;
}

/* كرت الجدول */
.table-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #e0e0e0;
  overflow: hidden; /* عشان الزوايا */
}

/* تنسيق الجدول */
.research-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.research-table th {
  background-color: #f4f4f4; /* لون الخلفية السكني للعنوان زي الصورة */
  padding: 15px;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #ddd;
}

.research-table td {
  padding: 15px;
  border-bottom: 1px solid #eee;
  color: #555;
}

/* تمييز الصفوف عند التمرير */
.research-table tbody tr:hover {
  background-color: #f9f9f9;
}

.title-cell {
  font-weight: 600;
  color: #1b396a;
}

/* ألوان الحالة */
.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}
.status-submitted { background-color: #e0f2fe; color: #0284c7; } /* أزرق فاتح */
.status-review { background-color: #fef3c7; color: #d97706; }    /* برتقالي */
.status-published { background-color: #dcfce7; color: #16a34a; } /* أخضر */

/* الأزرار */
.actions { display: flex; gap: 8px; }

.btn-edit, .btn-delete {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: 0.2s;
  background: white;
}

.btn-edit:hover { background-color: #f0f9ff; color: #1b396a; border-color: #1b396a; }
.btn-delete:hover { background-color: #fef2f2; color: #dc2626; border-color: #dc2626; }

.empty-state { text-align: center; padding: 30px; color: #888; }
</style>