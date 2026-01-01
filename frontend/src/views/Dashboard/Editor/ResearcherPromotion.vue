<script setup>
import { ref } from 'vue';

// 1. بيانات الباحثين (Mock Data matching image)
const researchers = ref([
  { 
    id: 1, 
    name: 'Dr. Ahmed Ali', 
    email: 'ahmed@journal.com', 
    field: 'Artificial Intelligence', 
    publishedCount: 5, 
    role: 'Author' 
  },
  { 
    id: 2, 
    name: 'Dr. Sara Hassan', 
    email: 'sara@journal.com', 
    field: 'Blockchain', 
    publishedCount: 3, 
    role: 'Author' 
  },
  { 
    id: 3, 
    name: 'Dr. Omar Khaled', 
    email: 'omar@journal.com', 
    field: 'Data Science', 
    publishedCount: 8, 
    role: 'Reviewer' // هذا أصلاً محكم
  }
]);

// 2. دالة الترقية
const promoteResearcher = (researcher) => {
  if (confirm(`Are you sure you want to promote ${researcher.name} to a Reviewer?`)) {
    // تحديث الحالة محلياً
    researcher.role = 'Reviewer';
    alert(`Success! ${researcher.name} is now a Reviewer.`);
    
    // هون المفروض تبعث طلب للباك إند يحدث الداتا
    // console.log('Promoting ID:', researcher.id);
  }
};
</script>

<template>
  <div class="promotion-container">
    
    <h3 class="page-title">Researcher Promotion</h3>

    <div class="table-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th style="width: 50px;">#</th>
            <th>Author Name</th>
            <th>Email</th>
            <th>Field</th>
            <th>Published Research</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in researchers" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.field }}</td>
            <td>{{ item.publishedCount }}</td>
            
            <td>
              <span :class="['badge', item.role === 'Reviewer' ? 'badge-reviewer' : 'badge-author']">
                {{ item.role }}
              </span>
            </td>

            <td>
              <button 
                class="btn-promote" 
                :disabled="item.role === 'Reviewer'"
                @click="promoteResearcher(item)"
              >
                Promote to Reviewer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.promotion-container {
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
  border-radius: 4px;
  overflow: hidden;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.custom-table th, .custom-table td {
  border: 1px solid #e0e0e0;
  padding: 12px 15px;
  text-align: left;
  font-size: 0.95rem;
  vertical-align: middle;
}

.custom-table th {
  background-color: #f9f9f9; /* رمادي فاتح للهيدر */
  font-weight: 700;
  color: #222;
}

/* Badges */
.badge {
  padding: 5px 12px;
  border-radius: 15px;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-block;
  min-width: 70px;
  text-align: center;
}

.badge-author {
  background-color: #6c757d; /* رمادي */
}

.badge-reviewer {
  background-color: #28a745; /* أخضر */
}

/* زر الترقية */
.btn-promote {
  background-color: #1b396a; /* كحلي */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-promote:hover:not(:disabled) {
  background-color: #152c52;
}

/* زر الترقية لما يكون مطفي (Disabled) */
.btn-promote:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  color: #fff;
}
</style>