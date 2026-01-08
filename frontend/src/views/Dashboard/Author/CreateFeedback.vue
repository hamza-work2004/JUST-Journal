<script setup>
import { ref } from 'vue';
import axios from 'axios';

const message = ref('');
const isSubmitting = ref(false);

const submitFeedback = async () => {
  // 1. التحقق من أن الحقل ليس فارغاً
  if (!message.value.trim()) {
    alert("Please enter a message before sending.");
    return;
  }

  // 2. جلب الآيدي من التخزين
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert("Error: User not found. Please login again.");
    return;
  }

  isSubmitting.value = true;

  try {
    // 3. إرسال الطلب للباك إند
    // لاحظ: الباك إند بتوقع 'user_id' و 'message'
    await axios.post('http://localhost:8080/createFeedback', {
      user_id: userId,
      message: message.value
    });

    // 4. نجاح العملية
    alert("Feedback sent successfully! Thank you.");
    message.value = ''; // تصفير الحقل

  } catch (error) {
    console.error("Feedback Error:", error);
    alert("Failed to send feedback. Please try again later.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="feedback-container">
    <div class="feedback-card">
      <div class="header">
        <h2>Send Feedback</h2>
        <p>We value your opinion. Please let us know if you have any suggestions or issues.</p>
      </div>

      <form @submit.prevent="submitFeedback">
        <div class="form-group">
          <label for="feedbackMsg">Your Message:</label>
          <textarea 
            id="feedbackMsg"
            v-model="message" 
            rows="6" 
            placeholder="Write your feedback here..." 
            class="form-control"
            required
          ></textarea>
        </div>

        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Sending...' : 'Submit Feedback' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.feedback-container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
}

.feedback-card {
  background: white;
  width: 100%;
  max-width: 600px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 1px solid #e0e0e0;
}

.header {
  text-align: center;
  margin-bottom: 25px;
}

.header h2 {
  color: #1b396a;
  margin-bottom: 10px;
}

.header p {
  color: #666;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical; /* يسمح بالتكبير عمودياً فقط */
  transition: border-color 0.2s;
  outline: none;
}

.form-control:focus {
  border-color: #1b396a;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #1b396a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #152c52;
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>