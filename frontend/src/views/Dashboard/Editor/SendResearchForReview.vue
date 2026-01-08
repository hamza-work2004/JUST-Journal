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

<!-- <script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// رابط السيرفر
const API_BASE_URL = 'http://localhost:8080'; 

const researches = ref([]);
const reviewers = ref([]);
const selectedResearchId = ref(null);
const selectedReviewerId = ref(null);
const isLoading = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;

    // 1. جلب الأبحاث
    const resPapers = await axios.get(`${API_BASE_URL}/getResearch`);
    if(resPapers.data && resPapers.data.data) {
        researches.value = resPapers.data.data;
    }

    // 2. جلب المحكمين
    const resReviewers = await axios.get(`${API_BASE_URL}/getReviewers`);
    if(resReviewers.data && resReviewers.data.data) {
        reviewers.value = resReviewers.data.data;
        
        // === هام جداً: هذا السطر رح يطبع شكل البيانات في الكونسول ===
        // اضغط F12 في المتصفح وشوف التبويب Console عشان تعرف أسماء الأعمدة الصح
        console.log("Reviewers Data:", reviewers.value); 
    }

  } catch (error) {
    console.error("Error fetching data:", error);
    alert('Failed to load data.');
  } finally {
    isLoading.value = false;
  }
});

// === تعديل دالة فتح الملف ===
const viewResearch = (file_path) => {
    if (!file_path) {
        alert('No file attached to this research.');
        return;
    }
    // افترضنا أن الملفات مخزنة في مجلد uploads في السيرفر
    // عدل الرابط حسب مكان تخزينك للملفات
    const fileUrl = `${API_BASE_URL}/${file_path}`; 
    window.open(fileUrl, '_blank');
};

const handleSubmit = async () => {
  if (!selectedResearchId.value || !selectedReviewerId.value) {
    alert('Please select both research and reviewer.');
    return;
  }

  try {
    await axios.put(`${API_BASE_URL}/assignReviewer`, {
      research_id: selectedResearchId.value,
      reviewer_id: selectedReviewerId.value
    });

    alert('Assigned successfully! ✅');
    researches.value = researches.value.filter(item => item.id !== selectedResearchId.value);
    selectedResearchId.value = null;
    selectedReviewerId.value = null;

  } catch (error) {
    console.error("Error:", error);
    alert('Failed to assign.');
  }
};
</script>

<template>
  <div class="send-review-container">
    <h3 class="section-title">Send Research for Review</h3>
    
    <div v-if="isLoading" class="loading-state">Loading...</div>

    <div v-else>
        <div class="table-wrapper">
        <table class="custom-table">
            <thead>
            <tr>
                <th class="select-col">Select</th>
                <th>Research Title</th>
                <th>Type</th>
                <th>Field</th>
                <th>Abstract</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in researches" :key="item.id">
                <td class="center-text">
                    <input type="radio" :value="item.id" v-model="selectedResearchId" name="researchGroup" />
                </td>
                <td>{{ item.research_title }}</td>
                <td>{{ item.type_research }}</td>
                <td>{{ item.research_field }}</td>
                <td class="desc-cell">{{ item.abstract }}</td>
                <td class="center-text">
                    <button class="btn-view" @click="viewResearch(item.file_path)">View</button> 
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
                <th class="select-col">Select</th>
                <th>Reviewer Name</th>
                <th>Qualification</th>
                <th>Workplace</th>
                <th>Email</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="reviewer in reviewers" :key="reviewer.id">
                <td class="center-text">
                    <input type="radio" :value="reviewer.id" v-model="selectedReviewerId" name="reviewerGroup" />
                </td>
                
                <td>
                    {{ reviewer.first_name || reviewer.name || reviewer.username }} 
                    {{ reviewer.last_name || '' }}
                </td>
                
                <td>{{ reviewer.qualification || reviewer.degree || 'N/A' }}</td>
                
                <td>{{ reviewer.workplace || reviewer.university || 'N/A' }}</td>
                
                <td>{{ reviewer.email }}</td>
            </tr>
            </tbody>
        </table>
        </div>

        <div class="actions">
            <button class="btn-submit" @click="handleSubmit">Submit Assignment</button>
        </div>
    </div>
  </div>
</template>

<style scoped>
/* نفس الستايل السابق تماماً */
.send-review-container { font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #f8f9fa; min-height: 90vh; }
.section-title { color: #1b396a; font-size: 1.4rem; font-weight: 700; margin-bottom: 20px; border-bottom: 3px solid #e0e0e0; padding-bottom: 8px; }
.mt-large { margin-top: 50px; }
.table-wrapper { border: 1px solid #e0e0e0; background: white; border-radius: 8px; overflow-x: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.custom-table { width: 100%; border-collapse: collapse; min-width: 800px; }
.custom-table th, .custom-table td { border-bottom: 1px solid #eee; padding: 14px 18px; text-align: left; font-size: 0.95rem; }
.custom-table th { background-color: #1b396a; color: white; font-weight: 600; text-align: center; }
.custom-table td { color: #555; text-align: center; }
.title-cell { font-weight: 600; color: #1b396a; }
.desc-cell { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
input[type="radio"] { cursor: pointer; width: 18px; height: 18px; accent-color: #1b396a; }
.btn-view { background: transparent; border: 1px solid #1b396a; color: #1b396a; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-weight: 600; }
.btn-view:hover { background-color: #1b396a; color: white; }
.actions { margin-top: 30px; display: flex; justify-content: flex-end; }
.btn-submit { background-color: #1b396a; color: white; padding: 12px 30px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
.btn-submit:hover { background-color: #152c52; }
.loading-state { text-align: center; padding: 50px; color: #666; }
</style> -->