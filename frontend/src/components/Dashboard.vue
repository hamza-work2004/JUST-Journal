<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Navbar from '../components/navbar.vue';

const router = useRouter();

// State
const userRole = ref('');
const userId = ref(localStorage.getItem('userId') || 1);

// Author Data
const file = ref(null);
const researchTitle = ref('');
const myResearches = ref([]);

// Editor Data
const pendingList = ref([]);
const categories = ref([]);
const newCategoryInput = ref('');

// Researcher Data
const approvedResearches = ref([]);
const searchQuery = ref('');

// --- Fetch Data ---
const fetchData = async () => {
    userRole.value = localStorage.getItem('userRole');
    userId.value = localStorage.getItem('userId'); // تأكيد الآيدي

    try {
        if (userRole.value === 'author') {
            const res = await axios.get(`http://localhost:3000/api/my-researches/${userId.value}`);
            myResearches.value = res.data;
        }
        if (userRole.value === 'editor') {
            const resPending = await axios.get('http://localhost:3000/api/pending-researches');
            pendingList.value = resPending.data.map(item => ({...item, selectedCategory: ''}));
            const resCats = await axios.get('http://localhost:3000/api/categories');
            categories.value = resCats.data;
        }
        if (userRole.value === 'researcher') {
            const res = await axios.get('http://localhost:3000/api/approved-researches');
            approvedResearches.value = res.data;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

onMounted(() => fetchData());

// --- Author Functions ---
const onFileChange = (e) => {
    file.value = e.target.files[0];
};

const uploadResearch = async () => {
    if (!file.value || !researchTitle.value) return alert("تعبئة البيانات مطلوبة");
    
    // 1. فحص نوع الملف (Client Side Validation)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.value.type)) {
        return alert("فقط ملفات PDF و Word مسموحة");
    }

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
        fetchData();
    } catch (error) {
        alert(error.response?.data?.message || "فشل الرفع");
    }
};

// مشاهدة الملف
const openFile = (filename) => {
    window.open(`http://localhost:3000/uploads/${filename}`, '_blank');
};

// حذف البحث (فقط المعلق)
const deleteResearch = async (id) => {
    if(!confirm("هل أنت متأكد من حذف هذا البحث؟")) return;
    
    try {
        await axios.delete(`http://localhost:3000/api/research/${id}`);
        alert("تم الحذف");
        fetchData();
    } catch (error) {
        alert("فشل الحذف");
    }
};

// --- Editor Functions ---
const addCategory = async () => {
    if (!newCategoryInput.value) return;
    try {
        await axios.post('http://localhost:3000/api/categories', { newCategory: newCategoryInput.value });
        categories.value.push(newCategoryInput.value);
        newCategoryInput.value = '';
    } catch (error) { alert("خطأ في الإضافة"); }
};

const approveWithCategory = async (item) => {
    if (!item.selectedCategory) return alert("اختر تصنيفاً أولاً");
    try {
        await axios.post('http://localhost:3000/api/update-status', {
            researchId: item.id,
            status: 'Approved',
            category: item.selectedCategory
        });
        fetchData(); // تحديث القائمة
        alert("تم الاعتماد ✅");
    } catch (error) { alert("حدث خطأ"); }
};

const rejectResearch = async (id) => {
    // نطلب سبب الرفض
    const reason = prompt("ما هو سبب الرفض؟ (سيظهر للمؤلف)");
    if (reason === null) return; // لو كبس Cancel

    try {
        await axios.post('http://localhost:3000/api/update-status', {
            researchId: id,
            status: 'Rejected',
            note: reason || 'لا يوجد سبب محدد'
        });
        fetchData();
        alert("تم الرفض ❌");
    } catch (error) { alert("حدث خطأ"); }
};

// --- Researcher Logic ---
const filteredResearches = computed(() => {
    return approvedResearches.value.filter(r => 
        r.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (r.category && r.category.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
});
</script>

<template>
  <navbar />
  <div class="dashboard-container">
    
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Welcome, <span class="role-badge">{{ userRole }}</span></p>
    </header>

    <div v-if="userRole === 'author'" class="section">
      <div class="upload-box">
        <h3>Upload New Research</h3>
        <input type="text" v-model="researchTitle" placeholder="عنوان البحث..." class="input-field">
        <input type="file" @change="onFileChange" accept=".pdf,.doc,.docx" class="input-field">
        <small style="color: gray;">Allowed: PDF, DOC, DOCX</small>
        <br><br>
        <button @click="uploadResearch" class="btn-primary">Upload Now</button>
      </div>

      <h2>My Uploaded Researches</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status / Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in myResearches" :key="item.id">
            <td>{{ item.title }}</td>
            <td>{{ item.category || '-' }}</td>
            <td>
              <span :class="`status-${item.status.toLowerCase()}`">
                {{ item.status }}
              </span>
              <div v-if="item.status === 'Rejected' && item.note" class="note-box">
                Reason: {{ item.note }}
              </div>
            </td>
            <td>
                <button @click="openFile(item.filePath)" class="btn-action view">👁️ View</button>
                
                <button v-if="item.status === 'Pending'" @click="deleteResearch(item.id)" class="btn-action delete">🗑️ Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="userRole === 'editor'" class="section">
      <div class="category-manager">
          <h3>Manage Categories</h3>
          <div style="display: flex; gap: 10px;">
              <input v-model="newCategoryInput" placeholder="New Category..." class="input-field" />
              <button @click="addCategory" class="btn-view">Add</button>
          </div>
      </div>

      <h2>Pending Approvals</h2>
      <p v-if="pendingList.length === 0">No pending requests.</p>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>View File</th>
            <th>Assign Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pendingList" :key="item.id">
            <td>{{ item.title }}</td>
            <td><button @click="openFile(item.filePath)" class="btn-view-small">📄 File</button></td>
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
      <input type="text" v-model="searchQuery" placeholder="Search..." class="search-input">
      
      <div class="cards-container">
        <div v-for="item in filteredResearches" :key="item.id" class="research-card">
          <h3>{{ item.title }}</h3>
          <p><strong>Category:</strong> {{ item.category }}</p>
          <small>Author ID: {{ item.authorId }} | Date: {{ item.date }}</small>
          <br><br>
          <button @click="openFile(item.filePath)" class="btn-view">Download / Read</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Base Styles */
.dashboard-container { max-width: 900px; margin: 40px auto; padding: 20px; font-family: 'Cairo', sans-serif; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; margin-bottom: 30px; padding-bottom: 10px; }
.role-badge { background-color: #e3f2fd; color: #0d47a1; padding: 5px 10px; border-radius: 15px; font-weight: bold; text-transform: capitalize; }

/* Components */
.upload-box, .category-manager { border: 2px dashed #ccc; padding: 20px; margin-bottom: 25px; border-radius: 8px; background-color: #f9f9f9; }
.input-field { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.cat-select { padding: 8px; border-radius: 4px; width: 100%; }
.note-box { font-size: 0.85em; color: #721c24; background: #f8d7da; padding: 5px; margin-top: 5px; border-radius: 4px; }

/* Table */
.data-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
.data-table th, .data-table td { border: 1px solid #ddd; padding: 12px; text-align: left; vertical-align: middle; }
.data-table th { background-color: #f8f9fa; }

/* Status Colors */
.status-pending { color: orange; font-weight: bold; }
.status-approved { color: green; font-weight: bold; }
.status-rejected { color: red; font-weight: bold; }

/* Buttons */
.btn-primary { background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
.btn-approve { background-color: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px; }
.btn-reject { background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; }
.btn-view { background-color: #6c757d; color: white; border: none; padding: 8px 15px; border-radius: 3px; cursor: pointer; }
.btn-view-small { background: #17a2b8; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 0.9em; }

/* Actions */
.btn-action { margin-right: 5px; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; color: white; }
.btn-action.view { background-color: #6c757d; }
.btn-action.delete { background-color: #dc3545; }

/* Researcher */
.search-input { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 20px; font-size: 16px; box-sizing: border-box; }
.cards-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
.research-card { border: 1px solid #eee; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); background: white; transition: transform 0.2s; }
.research-card:hover { transform: translateY(-5px); }
</style>