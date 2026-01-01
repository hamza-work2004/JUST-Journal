<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; 
import backtohome from '@/components/backtohome.vue';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref(''); 

const handleLogin = async () => {
    try {
        errorMessage.value = ''; 
        
        // الاتصال بالسيرفر
        const response = await axios.post('http://localhost:8080/login', {
            email: email.value,
            password: password.value
        });

        // استخراج البيانات
        const token = response.data.token;
        const userData = response.data.user; // اللي هي { userId, userName, role }

        if (token) {
            // تخزين التوكن
            localStorage.setItem('token', token);
            
            // تخزين البيانات حسب المسميات اللي في الباك إند تبعك
            localStorage.setItem('userId', userData.userId); 
            localStorage.setItem('userRole', userData.role); 
            
            // 👇 التعديل هون: صارت userData.userName بدل userData.name
            localStorage.setItem('userName', userData.userName); 

            // التوجيه حسب الرتبة
            if (userData.role === 'author') {
                router.push('/author'); 
            } else if (userData.role === 'editor') {
                router.push('/editor');
            } else if (userData.role === 'reviewer') {
                router.push('/reviewer');
            } else {
                router.push('/'); 
            }
        }

    } catch (error) {
        console.error(error);
        if (error.response && error.response.data) {
             errorMessage.value = error.response.data.error || 'بيانات الدخول غير صحيحة';
        } else {
             errorMessage.value = "فشل الاتصال بالسيرفر (تأكد أن Port 8080 شغال)";
        }
    }
}
</script>

<template>
    <backtohome />
    <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <label for="email">Email:</label>
            <input 
                type="text" 
                id="email" 
                v-model="email" 
                required 
                placeholder="editor@just_journal.com"
            >

            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required>

            <p v-if="errorMessage" style="color: red; text-align: center; margin-bottom: 10px;">
                {{ errorMessage }}
            </p>

            <button type="submit">Login</button>
            
            <div class="signup">
                <p>Don't have an account? <router-link to="/signup">Sign up</router-link></p>
            </div>
            <div class="forgot-password">
                <p><router-link to="/forgot-password">Forgot Password ?</router-link></p>
            </div>
        </form>
    </div>
</template>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.login-container h1 {
    text-align: center;
    margin-bottom: 20px;
}
.login-container form {
    display: flex;
    flex-direction: column;
}
.login-container label {
    margin-bottom: 5px;
    font-weight: bold;
}
.login-container input {
    margin-bottom: 15px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
}
.login-container button {
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}
.login-container button:hover {
    background-color: #218838;
}
.signup, .forgot-password {
    text-align: center;
    margin-top: 10px;
}
.signup a, .forgot-password a {
    color: #007bff;
    text-decoration: none;
}
.signup a:hover, .forgot-password a:hover {
    text-decoration: underline;
}
</style>