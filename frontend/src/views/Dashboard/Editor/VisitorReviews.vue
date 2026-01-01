<script setup>
import { ref } from 'vue';

// 1. بيانات وهمية لمراجعات الزوار
const reviews = ref([
  { 
    id: 1, 
    visitorName: 'John Doe', 
    email: 'john@gmail.com', 
    message: 'Great journal! The submission process was very smooth.', 
    date: '2025-10-25' 
  },
  { 
    id: 2, 
    visitorName: 'Alice Smith', 
    email: 'alice@yahoo.com', 
    message: 'I faced some issues uploading my PDF, please fix it.', 
    date: '2025-10-26' 
  },
  { 
    id: 3, 
    visitorName: 'Mohammed Salem', 
    email: 'mohammed@outlook.com', 
    message: 'Excellent selection of research topics in the AI section.', 
    date: '2025-10-27' 
  }
]);

// 2. دالة حذف المراجعة
const deleteReview = (id) => {
  if (confirm('Are you sure you want to delete this review?')) {
    reviews.value = reviews.value.filter(review => review.id !== id);
    alert('Review deleted successfully.');
  }
};
</script>

<template>
  <div class="visitor-reviews-container">
    
    <h3 class="page-title">Visitor Reviews</h3>

    <div class="table-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th style="width: 50px;">#</th>
            <th>Visitor Name</th>
            <th>Email</th>
            <th>Message / Review</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(review, index) in reviews" :key="review.id">
            <td>{{ index + 1 }}</td>
            <td class="name-cell">{{ review.visitorName }}</td>
            <td>{{ review.email }}</td>
            <td class="message-cell">{{ review.message }}</td>
            <td>{{ review.date }}</td>
            
            <td>
              <button class="btn-delete" @click="deleteReview(review.id)">
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="reviews.length === 0">
            <td colspan="6" class="empty-state">No reviews available.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.visitor-reviews-container {
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
  min-width: 800px;
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

/* تخصيص الخلايا */
.name-cell {
  font-weight: 600;
  color: #1b396a;
}

.message-cell {
  max-width: 400px; /* تحديد عرض الرسالة عشان ما تخرب الجدول */
  line-height: 1.5;
  color: #555;
}

/* زر الحذف */
.btn-delete {
  background-color: white;
  color: #dc3545;
  border: 1px solid #dc3545;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete:hover {
  background-color: #dc3545;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #777;
}
</style>