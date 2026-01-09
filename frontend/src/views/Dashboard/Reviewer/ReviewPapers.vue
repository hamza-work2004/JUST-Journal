<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// إعداد الرابط
const API_BASE_URL = 'http://localhost:8080';

const papers = ref([]);
const isLoading = ref(false);

// 1. جلب الأبحاث الخاصة بالمراجع
const fetchPapers = async () => {
  const reviewerId = localStorage.getItem('userId');
  if (!reviewerId) return alert("Please login first");

  try {
    isLoading.value = true;
    // استدعاء الباك إند: researchInIreview
    const response = await axios.get(`${API_BASE_URL}/researchInIreview/${reviewerId}`);
    
    if (response.data && response.data.data) {
        // نضيف حقل evaluation عشان نربطه بالـ textarea
        papers.value = response.data.data.map(paper => ({
            ...paper,
            evaluation: '' 
        }));
    }
  } catch (error) {
    console.error("Error fetching papers:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
    fetchPapers();
});

// 2. دالة فتح الملف
const viewFile = (filePath) => {
    if (!filePath) return alert("No file attached");
    const fixedPath = filePath.replace(/\\/g, "/");
    window.open(`${API_BASE_URL}/${fixedPath}`, '_blank');
};

// 3. دالة إرسال التقييم (قبول أو رفض)
const submitDecision = async (paper, decisionType) => {
    // decisionType رح يكون يا 'Accepted' يا 'Rejected'
    
    // تحقق بسيط: اذا رفض لازم يكتب سبب
    if (decisionType === 'Rejected' && !paper.evaluation.trim()) {
        alert("Please write your observations/reasons before rejecting.");
        return;
    }

    if (!confirm(`Are you sure you want to ${decisionType} this paper?`)) return;

    const reviewerId = localStorage.getItem('userId');

    try {
        // تجهيز البيانات حسب طلب الباك إند (addRating)
        const payload = {
            suggest: paper.evaluation, // الملاحظات
            decision: decisionType,    // القرار
            research_id: paper.research_id,
            reviewer_id: reviewerId
        };

        // إرسال للباك إند
        await axios.post(`${API_BASE_URL}/addRating`, payload);

        alert(`Research ${decisionType} successfully!`);

        // حذف البحث من القائمة لأنه تم تقييمه
        papers.value = papers.value.filter(p => p.research_id !== paper.research_id);

    } catch (error) {
        console.error("Error submitting review:", error);
        alert("Failed to submit review. Check console.");
    }
};

</script>

<template>
  <div class="content-wrapper">
    <h2 class="page-title">Research Papers for Review</h2>

    <div v-if="isLoading" class="loading-state">Loading assigned papers...</div>

    <div v-else class="table-container">
      <table class="review-table">
        <thead>
          <tr>
            <th style="width: 300px;">Evaluation & Decision</th>
            <th>Title</th>
            <th>Type</th>
            <th>Abstract</th> <th>File</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="paper in papers" :key="paper.research_id">
            
            <td class="evaluation-col">
              <textarea 
                v-model="paper.evaluation" 
                placeholder="Add your observations/suggestions..." 
                class="obs-input"
              ></textarea>
              <div class="action-buttons">
                <button @click="submitDecision(paper, 'Accepted')" class="btn-accept">Accept</button>
                <button @click="submitDecision(paper, 'Rejected')" class="btn-reject">Reject</button>
              </div>
            </td>
            
            <td class="info-cell">{{ paper.research_title }}</td>
            <td>{{ paper.type_research }}</td>
            <td class="abstract-cell" :title="paper.abstract">
                {{ paper.abstract }}
            </td>
            
            <td class="presentation-cell">
              <button @click="viewFile(paper.address_file)" class="file-link">
                📄 View File
              </button>
            </td>
          </tr>

          <tr v-if="papers.length === 0">
            <td colspan="5" class="empty-state">No papers assigned for review yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* نفس الستايل اللي بعثته مع تعديلات طفيفة */
.content-wrapper { padding: 40px; max-width: 1400px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; }
.page-title { color: #111827; margin-bottom: 25px; font-size: 26px; font-weight: 700; border-left: 5px solid #1e3a8a; padding-left: 15px; }

.table-container { overflow-x: auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #f3f4f6; }
.review-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 1000px; }

.review-table th { background-color: #f8fafc; color: #475569; font-weight: 600; padding: 16px; text-align: left; border-bottom: 2px solid #e2e8f0; font-size: 14px; text-transform: uppercase; }
.review-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 15px; vertical-align: top; background-color: white; }
.review-table tr:hover td { background-color: #f8fafc; }

.obs-input { width: 100%; height: 80px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; resize: vertical; font-family: inherit; font-size: 13px; margin-bottom: 8px; }
.obs-input:focus { outline: none; border-color: #3b82f6; }

.action-buttons { display: flex; gap: 8px; }
.btn-accept, .btn-reject { flex: 1; padding: 8px; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: 600; font-size: 13px; transition: 0.2s; }
.btn-accept { background-color: #10b981; }
.btn-reject { background-color: #ef4444; }
.btn-accept:hover, .btn-reject:hover { opacity: 0.9; transform: translateY(-1px); }

.file-link { display: inline-flex; align-items: center; gap: 5px; text-decoration: none; color: #2563eb; font-weight: 600; background-color: #eff6ff; padding: 6px 12px; border-radius: 20px; font-size: 13px; cursor: pointer; border: 1px solid #bfdbfe; }
.file-link:hover { background-color: #dbeafe; }

.info-cell { font-weight: 600; color: #1e3a8a; }
.abstract-cell { max-width: 300px; font-size: 0.9rem; color: #666; display: -webkit-box;
  -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.loading-state, .empty-state { text-align: center; padding: 40px; color: #666; font-size: 1.1rem; }
</style>