<script setup>
import { ref } from 'vue';
import axios from 'axios';

// ==============================
// 1. منطق تغيير كلمة المرور
// ==============================
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const changePassword = async () => {
  // التحقق من تطابق الباسورد الجديد
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert("New passwords do not match!");
    return;
  }

  const userId = localStorage.getItem('userId');
  if (!userId) return;

  try {
    // إرسال طلب تغيير الباسورد
    await axios.put('http://localhost:8080/changePassword', {
      userId: userId,
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    });

    alert("Password changed successfully!");
    // تصفير الحقول بعد النجاح
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.error || "Failed to change password");
  }
};

// ==============================
// 2. منطق تغيير الصورة الشخصية
// ==============================
const selectedFile = ref(null);
const previewImage = ref(null); // عشان نعرض الصورة لليوزر قبل ما يكبس حفظ

// دالة لما يختار ملف من جهازه
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    // عمل رابط مؤقت لعرض الصورة
    previewImage.value = URL.createObjectURL(file);
  }
};

// دالة الرفع للسيرفر
const uploadPhoto = async () => {
  if (!selectedFile.value) {
    alert("Please select a photo first.");
    return;
  }

  const userId = localStorage.getItem('userId');
  if (!userId) return;

  try {
    const formData = new FormData();
    // المفتاح هون 'profile_photo' لازم يطابق الباك إند بالضبط
    formData.append('profile_photo', selectedFile.value);

    // إرسال الطلب (لاحظ الرابط يحتوي على ID)
    await axios.put(`http://localhost:8080/updateProfilePhoto/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    alert("Profile photo updated successfully!");
    
    // (اختياري) تحديث الصفحة عشان الصورة الجديدة تظهر في الناف بار
    // window.location.reload();

  } catch (error) {
    console.error("Upload Error:", error);
    alert(error.response?.data?.error || "Failed to update profile photo");
  }
};
</script>

<template>
  <div class="profile-container">
    <h2>User Profile Settings</h2>

    <div class="profile-grid">
      
      <div class="card photo-card">
        <h3>Change Profile Photo</h3>
        
        <div class="photo-preview-area">
          <img 
            v-if="previewImage" 
            :src="previewImage" 
            class="avatar-preview" 
          />
          <div v-else class="avatar-placeholder">No Image Selected</div>
        </div>

        <div class="form-group">
          <input 
            type="file" 
            @change="handleFileSelect" 
            accept="image/*" 
            class="file-input"
          />
        </div>
        
        <button @click="uploadPhoto" class="btn-save">Update Photo</button>
      </div>

      <div class="card password-card">
        <h3>Change Password</h3>
        
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label>Old Password</label>
            <input 
              type="password" 
              v-model="passwordForm.oldPassword" 
              required 
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              v-model="passwordForm.newPassword" 
              required 
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              v-model="passwordForm.confirmPassword" 
              required 
              class="form-control"
            />
          </div>

          <button type="submit" class="btn-save">Change Password</button>
        </form>
      </div>

    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  color: #333;
  margin-bottom: 30px;
  border-bottom: 2px solid #1b396a;
  padding-bottom: 10px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* عمودين */
  gap: 30px;
}

@media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr; /* عمود واحد للموبايل */
  }
}

.card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #e0e0e0;
}

h3 {
  margin-top: 0;
  color: #1b396a;
  margin-bottom: 20px;
}

/* تنسيقات الصورة */
.photo-preview-area {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f0f0;
}

.avatar-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-weight: bold;
}

/* تنسيقات الفورم */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.file-input {
  margin-top: 10px;
}

.btn-save {
  background-color: #1b396a;
  color: white;
  border: none;
  padding: 10px 20px;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}

.btn-save:hover {
  background-color: #162a4d;
}
</style>