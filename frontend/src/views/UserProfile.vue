<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // عشان التوجيه
import axios from 'axios';

const router = useRouter();
const API_BASE_URL = 'http://localhost:8080';

// متغيرات البيانات
const user = ref({
  name: '',
  email: '',
  role: '',
  photoUrl: null
});

const passwordForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const selectedFile = ref(null);
const previewImage = ref(null);
const homeLink = ref('/'); // رابط الرجوع الافتراضي

// 1. عند التحميل: جلب البيانات + تحديد الرتبة
onMounted(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole'); // لازم نكون مخزنين الرتبة

    if (!userId) {
        router.push('/login');
        return;
    }

    // تحديد رابط الرجوع حسب الرتبة
    if (role === 'author') homeLink.value = '/author';
    else if (role === 'editor') homeLink.value = '/editor';
    else if (role === 'reviewer') homeLink.value = '/reviewer';

    fetchUserInfo(userId);
});

// جلب بيانات المستخدم الحالية
const fetchUserInfo = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/information/${id}`);
        if(response.data && response.data.data) {
            const data = response.data.data;
            user.value = {
                name: data.name,
                email: data.email,
                role: data.role,
                // معالجة رابط الصورة
                photoUrl: data.profile_photo_path 
                    ? `${API_BASE_URL}/${data.profile_photo_path.replace(/\\/g, "/")}` 
                    : null
            };
            // عرض الصورة الحالية في الـ Preview
            if(user.value.photoUrl) previewImage.value = user.value.photoUrl;
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
};

// 2. معالجة الصورة
const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        previewImage.value = URL.createObjectURL(file);
    }
};

const uploadPhoto = async () => {
    if (!selectedFile.value) return alert("Please select a photo first.");
    const userId = localStorage.getItem('userId');

    try {
        const formData = new FormData();
        formData.append('profile_photo', selectedFile.value); // تأكد ان الاسم يطابق الباك اند

        // انتبه: تأكد من اسم الراوت في الباك اند (هل هو updateProfilePhoto أو غيره)
        await axios.put(`${API_BASE_URL}/updateProfilePhoto/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        alert("Profile photo updated successfully! 📸");
        // تحديث الصفحة عشان الناف بار يلقط الصورة الجديدة
        window.location.reload(); 

    } catch (error) {
        console.error("Upload Error:", error);
        alert("Failed to update photo");
    }
};

// 3. تغيير كلمة السر
const changePassword = async () => {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        return alert("New passwords do not match!");
    }

    const userId = localStorage.getItem('userId');
    try {
        await axios.put(`${API_BASE_URL}/changePassword`, {
            userId: userId,
            oldPassword: passwordForm.value.oldPassword,
            newPassword: passwordForm.value.newPassword
        });

        alert("Password changed successfully! 🔒");
        passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.error || "Failed to change password");
    }
};
</script>

<template>
  <div class="profile-container">
    
    <div class="header-section">
        <router-link :to="homeLink" class="back-btn">← Back to Dashboard</router-link>
        <h2>My Profile Settings</h2>
    </div>

    <div class="info-summary">
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Role:</strong> <span class="role-badge">{{ user.role }}</span></p>
    </div>

    <div class="profile-grid">
      
      <div class="card photo-card">
        <h3>Profile Photo</h3>
        <div class="photo-preview-area">
          <img v-if="previewImage" :src="previewImage" class="avatar-preview" />
          <div v-else class="avatar-placeholder">{{ user.name.charAt(0) }}</div>
        </div>
        <div class="form-group">
          <input type="file" @change="handleFileSelect" accept="image/*" class="file-input" />
        </div>
        <button @click="uploadPhoto" class="btn-save">Update Photo</button>
      </div>

      <div class="card password-card">
        <h3>Change Password</h3>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label>Current Password</label>
            <input type="password" v-model="passwordForm.oldPassword" required class="form-control" />
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input type="password" v-model="passwordForm.newPassword" required class="form-control" />
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" v-model="passwordForm.confirmPassword" required class="form-control" />
          </div>
          <button type="submit" class="btn-save btn-danger">Change Password</button>
        </form>
      </div>

    </div>
  </div>
</template>

<style scoped>
.profile-container { max-width: 900px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', sans-serif; }
.header-section { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 2px solid #1b396a; padding-bottom: 10px; }
.back-btn { text-decoration: none; color: #666; font-weight: 600; transition: 0.2s; }
.back-btn:hover { color: #1b396a; }
h2 { color: #333; margin: 0; }

.info-summary { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 30px; display: flex; gap: 30px; border: 1px solid #e9ecef; }
.role-badge { background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 10px; font-size: 0.85rem; font-weight: bold; text-transform: uppercase; }

.profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
@media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr; } }

.card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #e0e0e0; }
h3 { margin-top: 0; color: #1b396a; margin-bottom: 20px; }

.photo-preview-area { display: flex; justify-content: center; margin-bottom: 20px; }
.avatar-preview { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
.avatar-placeholder { width: 150px; height: 150px; border-radius: 50%; background: #f97316; color: white; display: flex; align-items: center; justify-content: center; font-size: 50px; font-weight: bold; }

.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: 600; color: #555; }
.form-control { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
.file-input { margin-top: 10px; }

.btn-save { background-color: #1b396a; color: white; border: none; padding: 10px 20px; width: 100%; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.2s; }
.btn-save:hover { background-color: #162a4d; }
.btn-danger { background-color: #dc3545; }
.btn-danger:hover { background-color: #b02a37; }
</style>