<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// بيانات النموذج
const form = ref({
  title: '',
  type: '',        // Research Type
  field: '',       // Research Field
  description: '', // Research Description
  file: null,
  agreedToPolicy: false // Checkbox
});

// قائمة أنواع الأبحاث (Dropdown)
const researchTypes = [
  'Original Research', 
  'Review Article', 
  'Case Study', 
  'Methodology', 
  'Short Communication'
];

// دالة تخزين الملف
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.file = file;
  }
};

// دالة الإرسال
const submitResearch = () => {
  // 1. التحقق من الموافقة على السياسات (أهم شرط)
  if (!form.value.agreedToPolicy) {
    alert('⚠️ You must agree to the publication policy before submitting.');
    return;
  }

  // 2. التحقق من باقي الحقول
  if (!form.value.title || !form.value.type || !form.value.file) {
    alert('Please fill in all required fields.');
    return;
  }

  // 3. محاكاة الإرسال الناجح
  console.log("Submitting:", form.value);
  alert('Research submitted successfully!');
  router.push('/author/my-research');
};
</script>

<template>
  <div class="create-research-container">
    
    <div class="form-card">
      <h2 class="form-title">Create New Research</h2>

      <form @submit.prevent="submitResearch" class="research-form">
        
        <div class="form-group">
          <label>Research Title:</label>
          <input 
            type="text" 
            v-model="form.title" 
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label>Research Type:</label>
          <select v-model="form.type" class="form-control" required>
            <option value="" disabled selected>Select Type</option>
            <option v-for="type in researchTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Research Field:</label>
          <input 
            type="text" 
            v-model="form.field" 
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label>Research Description:</label>
          <textarea 
            v-model="form.description" 
            rows="4" 
            class="form-control"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Upload File:</label>
          <input 
            type="file" 
            @change="handleFileUpload" 
            class="form-control file-input"
            required 
          />
        </div>

        <div class="checkbox-group">
          <input 
            type="checkbox" 
            id="policyCheck" 
            v-model="form.agreedToPolicy" 
          />
          <label for="policyCheck">I agree to the publication policy</label>
        </div>

        <button type="submit" class="btn-submit">Submit Research</button>

      </form>
    </div>

  </div>
</template>

<style scoped>
/* كونتينر الصفحة */
.create-research-container {
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

/* الكرت الأبيض */
.form-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #e0e0e0;
}

.form-title {
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
}

/* تنسيق المجموعات */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #222;
}

/* تنسيق الحقول (Input, Select, Textarea) */
.form-control {
  width: 100%;
  padding: 10px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  background-color: white;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #1b396a;
}

/* تنسيق الـ Textarea */
textarea.form-control {
  resize: vertical; /* يسمح بتكبير البوكس عمودياً فقط */
}

/* تنسيق ملف التحميل */
.file-input {
  padding: 8px; /* عشان يبين زر الـ Browse */
}

/* تنسيق الـ Checkbox */
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-group label {
  font-size: 0.95rem;
  color: #444;
  cursor: pointer;
  user-select: none; /* عشان ما يحدد النص لما يكبس عليه */
}

/* زر الإرسال */
.btn-submit {
  background-color: #1b396a; /* الكحلي الغامق */
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #152c52;
}
</style>