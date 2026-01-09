<!-- <script setup>
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
</style> -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// رابط السيرفر
const API_BASE_URL = 'http://localhost:8080';

const researchers = ref([]);
const isLoading = ref(false);

// 1. جلب البيانات من الباك إند
const fetchResearchers = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${API_BASE_URL}/authorPromotion`);
    
    if(response.data && response.data.data) {
        researchers.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // alert("Failed to fetch authors");
  } finally {
    isLoading.value = false;
  }
};

// تشغيل الجلب عند فتح الصفحة
onMounted(() => {
    fetchResearchers();
});

// 2. دالة الترقية مع الربط بالباك إند
const promoteResearcher = async (researcher) => {
  // تجميع الاسم لأنه في الداتابيز مقسوم
  const fullName = researcher.first_name ? `${researcher.first_name} ${researcher.last_name}` : researcher.name;

  if (confirm(`Are you sure you want to promote ${fullName} to a Reviewer?`)) {
    try {
        // إرسال الطلب للسيرفر
        await axios.put(`${API_BASE_URL}/authorPromotion/${researcher.id}`);
        
        // تحديث الحالة محلياً (أو حذف الشخص من القائمة لأنه صار مراجع)
        alert(`Success! ${fullName} is now a Reviewer.`);
        
        // نحذفه من القائمة الحالية لأنه لم يعد Author
        researchers.value = researchers.value.filter(item => item.id !== researcher.id);

    } catch (error) {
        console.error("Promotion failed:", error);
        alert("Failed to promote user. Check console for details.");
    }
  }
};
</script>

<template>
  <div class="promotion-container">
    
    <h3 class="page-title">Researcher Promotion</h3>

    <div v-if="isLoading" style="text-align:center; padding: 20px;">Loading authors...</div>

    <div v-else class="table-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th style="width: 50px;">#</th>
            <th>Author Name</th>
            <th>Email</th>
            <th>Degree</th> <th>Institution</th> <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in researchers" :key="item.id">
            <td>{{ index + 1 }}</td>
            
            <td>
                {{ item.first_name }} {{ item.last_name }}
                {{ item.name }}
            </td>
            
            <td>{{ item.email }}</td>
            
            <td>{{ item.degree || 'N/A' }}</td>
            <td>{{ item.institution || 'N/A' }}</td>
            
            <td>
              <span class="badge badge-author">
                {{ item.role }}
              </span>
            </td>

            <td>
              <button 
                class="btn-promote" 
                @click="promoteResearcher(item)"
              >
                Promote to Reviewer
              </button>
            </td>
          </tr>
          
          <tr v-if="researchers.length === 0">
            <td colspan="7" style="text-align:center; padding: 20px;">No authors found to promote.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.promotion-container { font-family: 'Segoe UI', sans-serif; color: #333; }
.page-title { color: #1b396a; font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; }
.table-wrapper { border: 1px solid #ddd; background: white; border-radius: 4px; overflow: hidden; }
.custom-table { width: 100%; border-collapse: collapse; min-width: 900px; }
.custom-table th, .custom-table td { border: 1px solid #e0e0e0; padding: 12px 15px; text-align: left; font-size: 0.95rem; vertical-align: middle; }
.custom-table th { background-color: #f9f9f9; font-weight: 700; color: #222; }
.badge { padding: 5px 12px; border-radius: 15px; color: white; font-weight: 600; font-size: 0.85rem; display: inline-block; min-width: 70px; text-align: center; }
.badge-author { background-color: #6c757d; }
.badge-reviewer { background-color: #28a745; }
.btn-promote { background-color: #1b396a; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.3s; }
.btn-promote:hover { background-color: #152c52; }
</style>