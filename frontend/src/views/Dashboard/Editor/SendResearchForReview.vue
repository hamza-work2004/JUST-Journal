<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 1. بيانات الأبحاث (Mock Data) - الأبحاث الجديدة فقط
const researches = ref([
  { id: 1, title: 'AI in Education', type: 'Scientific', field: 'Computer Science', description: 'Study about AI usage in education', file: 'doc1.pdf' },
  { id: 2, title: 'Renewable Energy', type: 'Review', field: 'Engineering', description: 'Renewable energy sources', file: 'doc2.pdf' }
]);

// 2. بيانات المحكمين (Mock Data)
const reviewers = ref([
  { id: 101, name: 'Dr. Ahmed Ali', certificate: 'PhD', workplace: 'JUST University', email: 'ahmed@just.edu' },
  { id: 102, title: 'Dr. Sara Hassan', certificate: 'PhD', workplace: 'Tech University', email: 'sara@tech.edu' }
]);

// 3. متغيرات لتخزين الاختيارات
const selectedResearchId = ref(null);
const selectedReviewerId = ref(null);

// دالة فتح ملف البحث
const viewResearch = (filename) => {
  alert(`Opening file: ${filename}`); // هون بنربط مع رابط الملف الحقيقي
};

// دالة الإرسال
const handleSubmit = () => {
  if (!selectedResearchId.value) {
    alert('Please select a research paper first.');
    return;
  }
  if (!selectedReviewerId.value) {
    alert('Please select a reviewer.');
    return;
  }

  // محاكاة العملية
  console.log(`Assigning Research ${selectedResearchId.value} to Reviewer ${selectedReviewerId.value}`);
  
  alert('Research has been sent for review successfully! ✅');
  
  // ممكن توجهه لصفحة ثانية او تفرغ الحقول
  // router.push('/editor/all-research');
};
</script>

<template>
  <div class="send-review-container">
    
    <h3 class="section-title">Send Research for Review</h3>
    <div class="table-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th class="select-col">Select Research</th>
            <th>Research Title</th>
            <th>Research Type</th>
            <th>Research Field</th>
            <th>Research Description</th>
            <th>Research Presentation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in researches" :key="item.id">
            <td class="center-text">
              <input type="radio" :value="item.id" v-model="selectedResearchId" name="researchGroup" />
            </td>
            <td>{{ item.title }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.field }}</td>
            <td>{{ item.description }}</td>
            <td class="center-text">
              <button class="btn-view" @click="viewResearch(item.file)">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="section-title mt-large">Select Reviewer</h3>
    <div class="table-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th class="select-col">Select Reviewer</th>
            <th>Reviewer Name</th>
            <th>Reviewer’s Certificate</th>
            <th>Reviewer’s Workplace</th>
            <th>Reviewer’s Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reviewer in reviewers" :key="reviewer.id">
            <td class="center-text">
              <input type="radio" :value="reviewer.id" v-model="selectedReviewerId" name="reviewerGroup" />
            </td>
            <td>{{ reviewer.name || reviewer.title }}</td>
            <td>{{ reviewer.certificate }}</td>
            <td>{{ reviewer.workplace }}</td>
            <td>{{ reviewer.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="actions">
      <button class="btn-submit" @click="handleSubmit">Submit</button>
    </div>

  </div>
</template>

<style scoped>
.send-review-container {
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

.section-title {
  color: #1b396a;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 15px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
  display: inline-block;
}

.mt-large { margin-top: 40px; }

/* تنسيق الجداول */
.table-wrapper {
  border: 1px solid #ddd;
  background: white;
  overflow-x: auto; /* عشان لو الجدول عريض عالموبايل */
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.custom-table th, .custom-table td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: left;
  font-size: 0.95rem;
}

.custom-table th {
  background-color: #f9f9f9; /* لون خلفية الهيدر */
  font-weight: 600;
  color: #333;
  text-align: center;
}

.custom-table td {
  color: #555;
  text-align: center; /* سنترنا النصوص زي الصورة */
}

/* تنسيق الـ Radio Button */
input[type="radio"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #1b396a; /* لون الاختيار كحلي */
}

/* زر العرض (View) */
.btn-view {
  background: none;
  border: none;
  color: #333;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}
.btn-view:hover { color: #1b396a; }

/* زر الإرسال */
.actions { margin-top: 30px; }

.btn-submit {
  background-color: #1b396a;
  color: white;
  padding: 10px 25px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}
.btn-submit:hover { background-color: #152c52; }
</style>