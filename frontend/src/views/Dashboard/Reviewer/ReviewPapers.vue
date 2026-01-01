<script setup>
import { ref } from 'vue';

// داتا وهمية تحاكي الموجودة بالصورة عشان تجرب عليها
const papers = ref([
  {
    id: 1,
    title: 'Impact of AI on Education',
    type: 'Research Article',
    field: 'Computer Science',
    description: 'Study on AI usage in educational tools',
    presentation: 'PDF',
    evaluation: '', // هون رح تتخزن ملاحظاتك
  },
  {
    id: 2,
    title: 'Renewable Energy Sources',
    type: 'Review Article',
    field: 'Environmental Science',
    description: 'Comprehensive review of renewable sources',
    presentation: 'PowerPoint',
    evaluation: '',
  },
  {
    id: 3,
    title: 'Quantum Computing Algorithms',
    type: 'Research Article',
    field: 'Physics',
    description: 'Algorithms for quantum computers',
    presentation: 'PDF',
    evaluation: '',
  }
]);

// دالة قبول البحث
const acceptPaper = (paper) => {
  console.log(`Accepted paper: ${paper.title} with notes: ${paper.evaluation}`);
  alert(`Accepted: ${paper.title}`);
  // هون بتنادي الـ API عشان تبعت الداتا للباك إند
};

// دالة رفض البحث
const rejectPaper = (paper) => {
  console.log(`Rejected paper: ${paper.title} with notes: ${paper.evaluation}`);
  if(!paper.evaluation) {
    alert('Please add observations before rejecting.');
    return;
  }
  alert(`Rejected: ${paper.title}`);
};
</script>

<template>
  <div class="content-wrapper">
    <h2 class="page-title">Research Papers for Review</h2>

    <div class="table-container">
      <table class="review-table">
        <thead>
          <tr>
            <th style="width: 200px;">Research evaluation</th>
            <th>Research observations</th>
            <th>Research Title</th>
            <th>Research Type</th>
            <th>Research Field</th>
            <th>Research Description</th>
            <th>Research Presentation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="paper in papers" :key="paper.id">
            <td class="evaluation-col">
              <textarea 
                v-model="paper.evaluation" 
                placeholder="Add your observations..." 
                class="obs-input"
              ></textarea>
              <div class="action-buttons">
                <button @click="acceptPaper(paper)" class="btn-accept">Accept</button>
                <button @click="rejectPaper(paper)" class="btn-reject">Reject</button>
              </div>
            </td>
            
            <td></td>

            <td>{{ paper.title }}</td>
            <td>{{ paper.type }}</td>
            <td>{{ paper.field }}</td>
            <td>{{ paper.description }}</td>
            <td class="presentation-cell">
              <a href="#" class="file-link">
                <span v-if="paper.presentation === 'PDF'">📄 PDF</span>
                <span v-else>📊 PowerPoint</span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.page-title {
  color: #111827;
  margin-bottom: 25px;
  font-size: 26px;
  font-weight: 700;
  border-left: 5px solid #1e3a8a; /* حركة جمالية بجانب العنوان */
  padding-left: 15px;
}

/* كونتينر الجدول بتصميم الكارد */
.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 12px; /* زوايا دائرية */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* ظل ناعم */
  border: 1px solid #f3f4f6;
}

.review-table {
  width: 100%;
  border-collapse: separate; /* عشان نقدر نتحكم بالمسافات */
  border-spacing: 0;
  min-width: 1000px;
}

/* ترويسة الجدول */
.review-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 16px;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* خلايا الجدول */
.review-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 15px;
  vertical-align: top;
  background-color: white;
  transition: background-color 0.2s;
}

/* تأثير عند المرور على السطر */
.review-table tr:hover td {
  background-color: #f8fafc;
}

/* إزالة الحدود الأخيرة */
.review-table tr:last-child td {
  border-bottom: none;
}

/* تحسين خانة التقييم */
.obs-input {
  width: 100%;
  height: 70px;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  resize: none;
  font-family: inherit;
  font-size: 13px;
  margin-bottom: 8px;
  transition: border-color 0.2s;
}

.obs-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* تحسين الأزرار */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-accept, .btn-reject {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: transform 0.1s, opacity 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.btn-accept {
  background-color: #10b981; /* أخضر أهدأ شوي */
}

.btn-reject {
  background-color: #ef4444;
}

.btn-accept:hover, .btn-reject:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-accept:active, .btn-reject:active {
  transform: translateY(0);
}

/* تحسين روابط الملفات */
.file-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #2563eb;
  font-weight: 600;
  background-color: #eff6ff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  transition: background-color 0.2s;
}

.file-link:hover {
  background-color: #dbeafe;
}
</style>