<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Navbar from '../components/navbar.vue'; // تأكد ان المسار صح

const router = useRouter();

// المتغيرات
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('researcher'); // القيمة الافتراضية
const errorMessage = ref('');

const handleSignup = async () => {
    // 1. التحقق من تطابق الباسورد
    if (password.value !== confirmPassword.value) {
        errorMessage.value = "كلمة المرور غير متطابقة!";
        return;
    }

    try {
        errorMessage.value = '';
        
        // 2. دمج الاسم الأول والأخير عشان السيرفر
        const fullName = `${firstName.value} ${lastName.value}`;

        // 3. إرسال البيانات
        const response = await axios.post('http://localhost:3000/api/signup', {
            name: fullName,
            email: email.value,
            password: password.value,
            privilege: role.value // الرتبة المختارة
        });

        if (response.data.success) {
            alert("تم إنشاء الحساب بنجاح! سجل دخولك الآن.");
            router.push('/login');
        }

    } catch (error) {
        console.error(error);
        if (error.response) {
            errorMessage.value = error.response.data.message;
        } else {
            errorMessage.value = "حدث خطأ في الاتصال بالسيرفر";
        }
    }
};
</script>

<template>
    <Navbar />

    <div class="signup-container">
        <h1>Sign Up</h1>
        <form @submit.prevent="handleSignup">
            
            <label for="first-name">First Name: </label>
            <input type="text" id="first-name" v-model="firstName" required placeholder="Ahmad">
            
            <label for="last-name">Last Name: </label>
            <input type="text" id="last-name" v-model="lastName" required placeholder="Ali">
            
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" required placeholder="example@just.edu.jo">

            <label for="role">Register As:</label>
            <select id="role" v-model="role" required class="role-select">
                <option value="researcher">Researcher (Student - تصفح فقط)</option>
                <option value="author">Author (Submit Research - نشر أبحاث)</option>
            </select>

            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required>

            <label for="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" v-model="confirmPassword" required>

            <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

            <button type="submit">Sign Up</button>
            
            <div class="login-link">
                <p>Already have an account? <router-link to="/login">Log in</router-link></p>
            </div>
        </form>
    </div>
</template>

<style scoped>
/* نفس الستايل تبعك مع إضافات بسيطة لل Select */
.signup-container {
    max-width: 400px;
    margin: 50px auto; /* زدنا المسافة شوي عشان الناف بار */
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.signup-container h1 {
    text-align: center;
    margin-bottom: 20px;
}
.signup-container form {
    display: flex;
    flex-direction: column;
}
.signup-container label {
    margin-bottom: 5px;
    font-weight: bold;
}
/* ضفنا select هون عشان توخذ نفس شكل ال input */
.signup-container input, 
.signup-container select {
    margin-bottom: 15px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    width: 100%;
    box-sizing: border-box; /* عشان ما يخرب العرض */
}
.signup-container button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}
.signup-container .login-link {
    text-align: center;
    margin-top: 15px;
}
.signup-container .login-link a {
    color: #007bff;
    text-decoration: none;
}
.signup-container .login-link a:hover {
    text-decoration: underline;
}
.signup-container button:hover {
    background-color: #0056b3;
}
.error-msg {
    color: red;
    text-align: center;
    margin-bottom: 10px;
    font-size: 0.9em;
}
</style>