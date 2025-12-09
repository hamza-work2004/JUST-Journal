<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// ==========================================
// 1. المتغيرات العامة (State)
// ==========================================
const userRole = ref('');
const userName = ref('User');
const userId = ref(1); // مفروض ييجي من اللوجن، حالياً مثبت للتجربة

// للمؤلف (Author)
const file = ref(null);
const researchTitle = ref('');
const myResearches = ref([]);

// للمحرر (Editor)
const pendingList = ref([]);
const categories = ref([]);
const newCategoryInput = ref('');

// للباحث (Researcher)
const approvedResearches = ref([]);
const searchQuery = ref('');

// ==========================================
// 2. دوال جلب البيانات (Fetch Data)
// ==========================================
const fetchData = async () => {
    userRole.value = localStorage.getItem('userRole');
    
    try {
        // A. بيانات المؤلف
        if (userRole.value === 'author') {
            const res = await axios.get(`http://localhost:3000/api/my-researches/${userId.value}`);
            myResearches.value = res.data;
        }

        // B. بيانات المحرر
        if (userRole.value === 'editor') {
            // جلب الأبحاث المعلقة
            const resPending = await axios.get('http://localhost:3000/api/pending-researches');
            // بنضيف خاصية selectedCategory لكل سطر عشان القائمة المنسدلة
            pendingList.value = resPending.data.map(item => ({...item, selectedCategory: ''}));
            
            // جلب التصنيفات
            const resCats = await axios.get('http://localhost:3000/api/categories');
            categories.value = resCats.data;
        }

        // C. بيانات الباحث
        if (userRole.value === 'researcher') {
            const res = await axios.get('http://localhost:3000/api/approved-researches');
            approvedResearches.value = res.data;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
// استدعاء الدالة عند تحميل المكون

onMounted(() => {
    fetchData();
});

// ==========================================
// 3. دوال المؤلف (Author Actions)
// ==========================================
const onFileChange = (e) => {
    file.value = e.target.files[0];
};

const uploadResearch = async () => {
    if (!file.value || !researchTitle.value) return alert("الرجاء تعبئة العنوان واختيار الملف");

    const formData = new FormData();
    formData.append('file', file.value);
    formData.append('title', researchTitle.value);
    formData.append('authorId', userId.value);

    try {
        await axios.post('http://localhost:3000/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("تم الرفع بنجاح!");
        researchTitle.value = '';
        file.value = null;
        fetchData(); // تحديث الجدول فوراً
    } catch (error) {
        alert("فشل الرفع");
        console.error(error);
    }
};

// ==========================================
// 4. دوال المحرر (Editor Actions)
// ==========================================
const addCategory = async () => {
    if (!newCategoryInput.value) return;
    try {
        await axios.post('http://localhost:3000/api/categories', { newCategory: newCategoryInput.value });
        categories.value.push(newCategoryInput.value);
        newCategoryInput.value = '';
        alert("تمت إضافة التصنيف");
    } catch (error) {
        alert("فشل إضافة التصنيف (قد يكون موجود مسبقاً)");
    }
};

const approveWithCategory = async (item) => {
    if (!item.selectedCategory) return alert("الرجاء اختيار تصنيف للبحث");
    
    try {
        await axios.post('http://localhost:3000/api/update-status', {
            researchId: item.id,
            status: 'Approved',
            category: item.selectedCategory
        });
        // إزالة العنصر من القائمة
        pendingList.value = pendingList.value.filter(r => r.id !== item.id);
        alert("تم اعتماد البحث!");
    } catch (error) {
        alert("حدث خطأ");
    }
};

const rejectResearch = async (id) => {
    try {
        await axios.post('http://localhost:3000/api/update-status', {
            researchId: id,
            status: 'Rejected'
        });
        pendingList.value = pendingList.value.filter(r => r.id !== id);
        alert("تم رفض البحث");
    } catch (error) {
        alert("حدث خطأ");
    }
};

// ==========================================
// 5. دوال الباحث (Researcher Logic)
// ==========================================
// فلترة الأبحاث حسب نص البحث
const filteredResearches = computed(() => {
    return approvedResearches.value.filter(r => 
        r.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (r.category && r.category.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
});
</script>

<template>
  <div class="dashboard-container">
    
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Welcome, <span class="role-badge">{{ userRole }}</span></p>
    </header>

    <div v-if="userRole === 'author'" class="section">
      <div class="upload-box">
        <h3>Upload New Research</h3>
        <input type="text" v-model="researchTitle" placeholder="Enter Research Title..." class="input-field">
        <input type="file" @change="onFileChange" accept=".pdf,.doc,.docx" class="input-field">
        <button @click="uploadResearch" class="btn-primary">Upload Now</button>
      </div>

      <h2>My Uploaded Researches</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in myResearches" :key="item.id">
            <td>{{ item.title }}</td>
            <td>{{ item.date }}</td>
            <td>
              <span :class="{'status-pending': item.status === 'Pending', 'status-approved': item.status === 'Approved', 'status-rejected': item.status === 'Rejected'}">
                {{ item.status }}
              </span>
              <span v-if="item.status === 'Approved' && item.category"> ({{ item.category }})</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="userRole === 'editor'" class="section">
      
      <div class="category-manager">
          <h3>Manage Categories</h3>
          <div style="display: flex; gap: 10px;">
              <input v-model="newCategoryInput" placeholder="New Category Name (e.g. AI)" class="input-field" />
              <button @click="addCategory" class="btn-view">Add</button>
          </div>
      </div>

      <h2>Pending Approvals</h2>
      <div v-if="pendingList.length === 0">
          <p>No pending requests. Good job! ☕</p>
      </div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Assign Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pendingList" :key="item.id">
            <td>{{ item.title }}</td>
            <td>{{ item.date }}</td>
            <td>
               <select v-model="item.selectedCategory" class="cat-select">
                   <option disabled value="">Select Category</option>
                   <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
               </select>
            </td>
            <td>
              <button @click="approveWithCategory(item)" class="btn-approve">✅ Approve</button>
              <button @click="rejectResearch(item.id)" class="btn-reject">❌ Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="userRole === 'researcher'" class="section">
      <h2>Published Researches</h2>
      <input type="text" v-model="searchQuery" placeholder="Search by title or category..." class="search-input">
      
      <div class="cards-container">
        <div v-for="item in filteredResearches" :key="item.id" class="research-card">
          <h3>{{ item.title }}</h3>
          <p><strong>Category:</strong> {{ item.category || 'General' }}</p>
          <small>Date: {{ item.date }}</small>
          <br>
          <button class="btn-view">Download PDF</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.dashboard-container { max-width: 900px; margin: 40px auto; padding: 20px; font-family: 'Cairo', sans-serif; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; margin-bottom: 30px; padding-bottom: 10px; }
.role-badge { background-color: #e3f2fd; color: #0d47a1; padding: 5px 10px; border-radius: 15px; font-weight: bold; text-transform: capitalize; }

/* Upload Box */
.upload-box, .category-manager { border: 2px dashed #ccc; padding: 20px; margin-bottom: 25px; border-radius: 8px; background-color: #f9f9f9; }
.input-field { display: block; width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; }
.cat-select { padding: 8px; border-radius: 4px; border: 1px solid #ddd; width: 100%; }

/* Table */
.data-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
.data-table th, .data-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
.data-table th { background-color: #f8f9fa; }

/* Status Colors */
.status-pending { color: orange; font-weight: bold; }
.status-approved { color: green; font-weight: bold; }
.status-approved { color: green; font-weight: bold; }
.status-rejected { color: red; font-weight: bold; }

/* Buttons */
.btn-primary { background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
.btn-approve { background-color: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px; }
.btn-reject { background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; }
.btn-view { background-color: #6c757d; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 5px; }

/* Researcher Section */
.search-input { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 20px; font-size: 16px; }
.cards-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
.research-card { border: 1px solid #eee; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.2s; background: white; }
.research-card:hover { transform: translateY(-5px); }
.research-card h3 { margin-top: 0; color: #333; font-size: 1.1em; }
</style>