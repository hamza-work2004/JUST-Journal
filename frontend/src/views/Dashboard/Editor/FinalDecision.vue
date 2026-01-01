<script setup>
import { ref } from 'vue';

// 1. بيانات وهمية مطابقة للصورة
const pendingDecisions = ref([
  { 
    id: 1, 
    reviewerName: 'Dr. Ahmed Ali', 
    researchTitle: 'AI in Medical Diagnosis', 
    description: 'Study on applying AI models to enhance diagnosis accuracy.',
    reviewerDecision: 'Accepted' 
  },
  { 
    id: 2, 
    reviewerName: 'Dr. Sara Hassan', 
    researchTitle: 'Blockchain in Finance', 
    description: 'Analysis of blockchain applications in financial systems.',
    reviewerDecision: 'Rejected' 
  }
]);

// 2. دالة اتخاذ القرار النهائي
const handleFinalDecision = (id, decision) => {
  const actionText = decision === 'publish' ? 'Publishing' : 'Rejecting';
  
  if(confirm(`Are you sure you want to ${decision.toUpperCase()} this research?`)) {
    // محاكاة العملية: حذف السطر من الجدول
    console.log(`${actionText} research ID: ${id}`);
    pendingDecisions.value = pendingDecisions.value.filter(item => item.id !== id);
    alert(`Research has been ${decision === 'publish' ? 'Published' : 'Rejected'} successfully.`);
  }
};
</script>

<template>
  <div class="final-decision-container">
    
    <h3 class="page-title">Final Decision</h3>

    <div class="table-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th style="width: 50px;">#</th>
            <th>Reviewer Name</th>
            <th>Research Title</th>
            <th>Description</th>
            <th>Reviewer Decision</th>
            <th>Final Decision</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in pendingDecisions" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.reviewerName }}</td>
            <td>{{ item.researchTitle }}</td>
            <td>{{ item.description }}</td>
            
            <td>
              <span :class="['badge', item.reviewerDecision === 'Accepted' ? 'badge-accept' : 'badge-reject']">
                {{ item.reviewerDecision }}
              </span>
            </td>

            <td>
              <div class="action-buttons">
                <button class="btn btn-publish" @click="handleFinalDecision(item.id, 'publish')">Publish</button>
                <button class="btn btn-reject" @click="handleFinalDecision(item.id, 'reject')">Reject</button>
              </div>
            </td>
          </tr>

          <tr v-if="pendingDecisions.length === 0">
            <td colspan="6" class="empty-state">No pending decisions available.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.final-decision-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.page-title {
  color: #1b396a;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
}

/* تنسيق الجدول */
.table-wrapper {
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px; /* زوايا ناعمة خفيفة للجدول كامل */
  overflow: hidden;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px; /* لضمان عرض جيد */
}

.custom-table th, .custom-table td {
  border: 1px solid #e0e0e0;
  padding: 12px 15px;
  text-align: left;
  font-size: 0.95rem;
  vertical-align: middle;
}

.custom-table th {
  background-color: #f9f9f9;
  font-weight: 700;
  color: #222;
}

/* Badges (Accepted / Rejected) */
.badge {
  padding: 6px 14px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-block;
  min-width: 80px;
  text-align: center;
}

.badge-accept {
  background-color: #28a745; /* أخضر */
}

.badge-reject {
  background-color: #dc3545; /* أحمر */
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:hover { opacity: 0.9; }

.btn-publish {
  background-color: #1b396a; /* كحلي */
}

.btn-reject {
  background-color: #dc3545; /* أحمر */
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #777;
}
</style>