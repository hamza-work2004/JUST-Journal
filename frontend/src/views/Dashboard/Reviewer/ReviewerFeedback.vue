<!-- <script setup>
import { ref } from 'vue';
import axios from 'axios';

const message = ref('');
const subject = ref('');
const isLoading = ref(false);

const sendFeedback = async () => {
    const userId = localStorage.getItem('userId');
    if(!message.value || !subject.value) return alert("Please fill all fields");

    isLoading.value = true;
    try {
        // بنستخدم نفس الباك اند تبع الاوثر لأنه مشترك
        await axios.post('http://localhost:8080/createFeedback', {
            user_id: userId,
            subject: subject.value,
            message: message.value
        });
        alert("Feedback sent successfully!");
        message.value = '';
        subject.value = '';
    } catch (e) {
        alert("Error sending feedback");
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="feedback-container">
        <h2>Reviewer Feedback</h2>
        <p>Send your suggestions or issues to the editor.</p>
        
        <input v-model="subject" placeholder="Subject" class="input-field" />
        <textarea v-model="message" placeholder="Write your message here..." class="textarea-field"></textarea>
        
        <button @click="sendFeedback" :disabled="isLoading" class="btn">
            {{ isLoading ? 'Sending...' : 'Send Feedback' }}
        </button>
    </div>
</template>

<style scoped>
.feedback-container { max-width: 600px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
.input-field, .textarea-field { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; }
.textarea-field { height: 150px; resize: vertical; }
.btn { background: #1e3a8a; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
.btn:hover { background: #152c52; }
</style> -->

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const message = ref('');
const isLoading = ref(false);

const sendFeedback = async () => {
    const userId = localStorage.getItem('userId');
    if(!message.value) return alert("Please write a message first.");

    isLoading.value = true;
    try {
        // بنبعث عنوان افتراضي تلقائي عشان الباك إند ما يضرب ايرور إذا كان مطلوب
        // أو بنعدل الباك إند ليقبل بدون عنوان (الأفضل نبعث قيمة افتراضية حالياً)
        const defaultSubject = "General Feedback"; 

        await axios.post(`${API_BASE_URL}/createFeedback`, {
            user_id: userId,
            subject: defaultSubject, 
            message: message.value
        });
        
        alert("Feedback sent successfully! 📨");
        message.value = ''; // تفريغ الحقل
    } catch (e) {
        console.error(e);
        alert("Error sending feedback");
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="feedback-container">
        <h2 class="page-title">Reviewer Feedback</h2>
        <p class="subtitle">Have an issue or suggestion? Send it directly to the editor.</p>
        
        <div class="form-group">
            <textarea 
                v-model="message" 
                placeholder="Type your message here..." 
                class="textarea-field"
            ></textarea>
        </div>
        
        <div class="actions">
            <button @click="sendFeedback" :disabled="isLoading" class="btn">
                {{ isLoading ? 'Sending...' : 'Send Feedback 🚀' }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.feedback-container { 
    max-width: 700px; 
    margin: 40px auto; 
    padding: 30px; 
    background: white; 
    border-radius: 8px; 
    box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
    font-family: 'Segoe UI', sans-serif; 
    border: 1px solid #eee;
}

.page-title { color: #1b396a; margin-bottom: 5px; font-size: 1.5rem; font-weight: 700; }
.subtitle { color: #666; margin-bottom: 25px; font-size: 0.95rem; }

.form-group { margin-bottom: 20px; }

.textarea-field { 
    width: 100%; 
    height: 180px; 
    padding: 15px; 
    border: 1px solid #ccc; 
    border-radius: 6px; 
    font-size: 1rem; 
    resize: vertical; 
    font-family: inherit;
    transition: border 0.3s; 
}
.textarea-field:focus { border-color: #1b396a; outline: none; box-shadow: 0 0 0 3px rgba(27, 57, 106, 0.1); }

.actions { text-align: right; }

.btn { 
    background: #1b396a; 
    color: white; 
    padding: 12px 30px; 
    border: none; 
    border-radius: 6px; 
    cursor: pointer; 
    font-size: 1rem; 
    font-weight: bold; 
    transition: background 0.3s;
}
.btn:hover { background: #152c52; }
.btn:disabled { background: #ccc; cursor: not-allowed; }
</style>