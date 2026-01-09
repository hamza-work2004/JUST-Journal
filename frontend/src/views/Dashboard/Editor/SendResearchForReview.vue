<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 1. إعداد الرابط الأساسي (حسب سيرفرك)
const API_BASE_URL = 'http://localhost:8080';

// المتغيرات
const researches = ref([]);
const reviewers = ref([]);
const selectedResearchId = ref(null);
const selectedReviewerId = ref(null);
const isLoading = ref(false);

// 2. جلب البيانات أول ما تفتح الصفحة
onMounted(async () => {
  try {
    isLoading.value = true;
    console.log("🚀 Starting to fetch data...");

    // أ) جلب الأبحاث
    const resPapers = await axios.get(`${API_BASE_URL}/getResearch`);
    
    if(resPapers.data && resPapers.data.data) {
        researches.value = resPapers.data.data;
    }

    // ب) جلب المحكمين
    const resReviewers = await axios.get(`${API_BASE_URL}/getReviewers`);
    console.log("👨‍🏫 Reviewers Data Received:", resReviewers.data); 

    if(resReviewers.data && resReviewers.data.data) {
        reviewers.value = resReviewers.data.data;
    }

  } catch (error) {
    console.error("❌ Error fetching data:", error);
    alert('فشل الاتصال بالسيرفر. تأكد أن الباك إند يعمل على المنفذ 8080');
  } finally {
    isLoading.value = false;
  }
});

// 3. دالة فتح الملف
const viewResearch = (fileData) => {
    // التحقق من وجود القيمة
    if (!fileData) {
        alert('لا يوجد ملف مرفق لهذا البحث');
        return;
    }

    // 1. إصلاح السلاشات (تحويل \ إلى / عشان المتصفح يفهمها)
    let fixedPath = fileData.replace(/\\/g, "/");

    // 2. الرابط النهائي
    const fileUrl = `${API_BASE_URL}/${fixedPath}`; 
    
    console.log("Opening File URL:", fileUrl);
    window.open(fileUrl, '_blank');
};

// 4. دالة الإرسال (Submit)
const handleSubmit = async () => {
  if (!selectedResearchId.value) return alert('الرجاء اختيار بحث');
  if (!selectedReviewerId.value) return alert('الرجاء اختيار محكم');

  try {
    await axios.put(`${API_BASE_URL}/assignReviewer`, {
      research_id: selectedResearchId.value,
      reviewer_id: selectedReviewerId.value
    });

    alert('تم إرسال البحث للتحكيم بنجاح! ✅');

    // حذف البحث من القائمة بعد النجاح
    researches.value = researches.value.filter(item => item.id !== selectedResearchId.value);
    selectedResearchId.value = null;
    selectedReviewerId.value = null;

  } catch (error) {
    console.error("❌ Error assigning:", error);
    alert('حدث خطأ أثناء التعيين');
  }
};
</script>

<template>
  <div class="send-review-container">
    <h3 class="section-title">Send Research for Review</h3>
    
    <div v-if="isLoading" class="loading-state">جاري تحميل البيانات...</div>

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
                <th>File</th>
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
                    <button class="btn-view" @click="viewResearch(item.address_file)">View</button> 
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
                <th>Name</th> 
                <th>Qualification</th>
                <th>Institution</th>
                <th>Email</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="reviewer in reviewers" :key="reviewer.id">
                <td class="center-text">
                    <input type="radio" :value="reviewer.id" v-model="selectedReviewerId" name="reviewerGroup" />
                </td>
                <td>
                    {{ reviewer.first_name }} {{ reviewer.last_name }}
                    {{ reviewer.name }} 
                    {{ reviewer.username }}
                </td>
                
                <td>{{ reviewer.qualification || reviewer.degree }}</td>

                <td>{{ reviewer.institution }}</td>

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
.send-review-container { font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #f8f9fa; min-height: 90vh; }
.section-title { color: #1b396a; font-size: 1.4rem; font-weight: 700; margin-bottom: 20px; border-bottom: 3px solid #e0e0e0; padding-bottom: 8px; }
.mt-large { margin-top: 50px; }
.table-wrapper { border: 1px solid #e0e0e0; background: white; border-radius: 8px; overflow-x: auto; }
.custom-table { width: 100%; border-collapse: collapse; min-width: 800px; }
.custom-table th, .custom-table td { border-bottom: 1px solid #eee; padding: 14px 18px; text-align: left; }
.custom-table th { background-color: #1b396a; color: white; text-align: center; }
.custom-table td { color: #555; text-align: center; }
.btn-view { background: transparent; border: 1px solid #1b396a; color: #1b396a; padding: 5px 12px; border-radius: 4px; cursor: pointer; }
.btn-view:hover { background-color: #1b396a; color: white; }
.actions { margin-top: 30px; display: flex; justify-content: flex-end; }
.btn-submit { background-color: #1b396a; color: white; padding: 12px 30px; border: none; border-radius: 6px; cursor: pointer; }
.loading-state { text-align: center; padding: 50px; font-size: 1.2rem; color: #1b396a; }
</style>