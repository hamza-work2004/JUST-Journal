<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
// import Navbar from '../components/navbar.vue'; // تأكد انه هذا الملف موجود عندك

const router = useRouter();

// --- State Variables ---
const userRole = ref('');
const token = ref('');
const userId = ref('');

// --- Data Lists ---
const myResearches = ref([]); // للمؤلف
const newResearches = ref([]); // للإديتور (الأبحاث الجديدة)

// --- Author Form Data ---
const researchTitle = ref('');
const researchDescription = ref(''); // ضفت وصف لأنه غالبا مطلوب
const file = ref(null);

// --- تهيئة الصفحة وجلب البيانات ---
const fetchData = async () => {
    userRole.value = localStorage.getItem('userRole');
    token.value = localStorage.getItem('token');
    userId.value = localStorage.getItem('userId');

    // إعداد الهيدر عشان التوكن
    const config = {
        headers: { 
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        if (!token.value) {
            router.push('/login');
            return;
        }

        // 1. لو كان المستخدم Author (مؤلف)
        if (userRole.value === 'author') {
            // جلب أبحاثي
            // ملاحظة: تأكد من الباك اند هل يحتاج ID في الرابط أو بيجيبه من التوكن
            // جربنا نبعثه كـ Query Param أو نعتمد ع التوكن
            const res = await axios.get(`http://localhost:8080/myResearch`, {
                params: { authorId: userId.value }, 
                ...config
            });
            myResearches.value = res.data;
        }

        // 2. لو كان المستخدم Editor (محرر)
        if (userRole.value === 'editor') {
            // جلب الأبحاث الجديدة التي تحتاج مراجعين
            const res = await axios.get('http://localhost:8080/getResearch', config);
            newResearches.value = res.data;
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && error.response.status === 401) {
            alert("انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى");
            router.push('/login');
        }
    }
};

onMounted(() => fetchData());

// --- دوال المؤلف (Author) ---
const onFileChange = (e) => {
    file.value = e.target.files[0];
};

const handleUpload = async () => {
    if (!researchTitle.value || !file.value) return alert("الرجاء تعبئة العنوان واختيار ملف");

    const formData = new FormData();
    formData.append('title', researchTitle.value);
    formData.append('description', researchDescription.value || 'No description');
    formData.append('file', file.value);
    formData.append('authorId', userId.value); // ضروري نبعث مين صاحب البحث

    try {
        await axios.post('http://localhost:8080/createResearch', formData, {
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        alert("تم رفع البحث بنجاح!");
        researchTitle.value = '';
        file.value = null;
        fetchData(); // تحديث القائمة
    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء الرفع");
    }
};

// --- دوال مشتركة ---
const downloadFile = (path) => {
    // افترضنا أن الملفات مخزنة في مجلد uploads ويمكن الوصول إليها
    window.open(`http://localhost:8080/${path}`, '_blank');
};

const logout = () => {
    localStorage.clear();
    router.push('/login');
};
</script>

<template>
  <div class="page-wrapper">
    <header class="top-bar">
        <h3>مرحباً، {{ userRole }}</h3>
        <button @click="logout" class="logout-btn">تسجيل خروج</button>
    </header>

    <div class="container">
        
        <div v-if="userRole === 'author'" class="role-section">
            <div class="card upload-card">
                <h2>رفع بحث جديد</h2>
                <div class="form-group">
                    <label>عنوان البحث</label>
                    <input v-model="researchTitle" type="text" placeholder="اكتب عنوان البحث هنا...">
                </div>
                <div class="form-group">
                    <label>ملف البحث (PDF)</label>
                    <input @change="onFileChange" type="file" accept=".pdf,.doc,.docx">
                </div>
                <button @click="handleUpload" class="action-btn">رفع البحث</button>
            </div>

            <div class="card list-card">
                <h2>أبحاثي السابقة</h2>
                <table v-if="myResearches.length > 0">
                    <thead>
                        <tr>
                            <th>العنوان</th>
                            <th>الحالة</th>
                            <th>التاريخ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in myResearches" :key="item.id">
                            <td>{{ item.title }}</td>
                            <td><span class="badge">{{ item.status || 'Pending' }}</span></td>
                            <td>{{ new Date(item.created_at || Date.now()).toLocaleDateString() }}</td>
                        </tr>
                    </tbody>
                </table>
                <p v-else>لا يوجد أبحاث مرفوعة بعد.</p>
            </div>
        </div>

        <div v-if="userRole === 'editor'" class="role-section">
            <div class="card list-card">
                <h2>أبحاث جديدة بحاجة لمراجعين</h2>
                <table v-if="newResearches.length > 0">
                    <thead>
                        <tr>
                            <th>العنوان</th>
                            <th>اسم الباحث</th>
                            <th>الملف</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in newResearches" :key="item.id">
                            <td>{{ item.title }}</td>
                            <td>{{ item.authorName || item.author_id }}</td>
                            <td>
                                <button @click="downloadFile(item.file_path)" class="small-btn">عرض الملف</button>
                            </td>
                            <td>
                                <button class="action-btn secondary">تعيين مراجع</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-else>لا يوجد أبحاث جديدة حالياً.</p>
            </div>
        </div>

    </div>
  </div>
</template>

<style scoped>
.page-wrapper { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; }
.top-bar { background: #333; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
.logout-btn { background: #d9534f; color: white; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px; }
.container { max-width: 1000px; margin: 30px auto; padding: 0 20px; }

.card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.card h2 { margin-top: 0; color: #0275d8; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-bottom: 20px; }

.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.form-group input[type="text"] { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }

.action-btn { background: #5cb85c; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; font-size: 16px; }
.action-btn.secondary { background: #0275d8; font-size: 14px; padding: 5px 10px; }
.small-btn { background: #eee; border: 1px solid #ccc; padding: 5px 10px; cursor: pointer; border-radius: 3px; }

table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 12px; text-align: right; }
th { background-color: #f7f7f7; }
.badge { background: #f0ad4e; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.9em; }
</style>