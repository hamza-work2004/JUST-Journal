<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import backtohome from '@/components/backtohome.vue'; 

const router = useRouter();

// المتغيرات
const prefix = ref('Mr.'); 
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const degree = ref('');
const birthDate = ref('');
const country = ref('');
const institution = ref('');

const errorMessage = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleSignup = async () => {
    errorMessage.value = '';

    // 1. التحقق من تطابق الباسورد
    if (password.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match!";
        return;
    }

    // 2. التحقق من قوة الباسورد في الفرونت اند
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password.value)) {
        errorMessage.value = "Password must be 8+ chars, contain 1 Uppercase letter & 1 Number.";
        return;
    }

    // 3. التحقق من العمر في الفرونت اند
    const birth = new Date(birthDate.value);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    if (age < 18) {
        errorMessage.value = "You must be 18+ to register.";
        return;
    }

    isLoading.value = true;

    try {
        const fullName = `${firstName.value} ${lastName.value}`;

        const response = await axios.post('http://localhost:8080/createUser', {
            prefix: prefix.value,
            name: fullName,
            degree: degree.value,
            email: email.value,
            birth_date: birthDate.value,
            country: country.value,
            institution: institution.value,
            password: password.value
        });

        if (response.status === 201) {
            alert("Account created successfully! Please login.");
            router.push('/login');
        }

    } catch (error) {
        console.error(error);
        if (error.response && error.response.data) {
            errorMessage.value = error.response.data.error;
        } else {
            errorMessage.value = "Connection error. Please ensure server is running.";
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <backtohome />
    <div class="signup-container">
        <h1>Create New Account</h1>
        <form @submit.prevent="handleSignup">
            
            <div class="form-row">
                <div class="form-group small">
                    <label>Prefix</label>
                    <select v-model="prefix" required>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" v-model="firstName" required placeholder="Ahmad">
                </div>
                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" v-model="lastName" required placeholder="Ali">
                </div>
            </div>

            <label>Institution (University)</label>
            <input type="text" v-model="institution" required placeholder="Jordan University of Science and Technology">

            <div class="form-row">
                <div class="form-group">
                    <label>Degree</label>
                    <select v-model="degree" required>
                        <option value="" disabled>Select Degree</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Master">Master</option>
                        <option value="PhD">PhD</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Country</label>
                    <input type="text" v-model="country" required placeholder="Jordan">
                </div>
            </div>

            <label>Date of Birth</label>
            <input type="date" v-model="birthDate" required>
            
            <label>Email</label>
            <input type="email" v-model="email" required placeholder="example@just.edu.jo">

            <div class="form-row">
                <div class="form-group password-wrapper">
                    <label>Password</label>
                    <div class="input-icon-group">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password" required>
                        <span class="eye-icon" @click="showPassword = !showPassword">
                            <span v-if="showPassword">👁️</span>
                            <span v-else>🔒</span>
                        </span>
                    </div>
                </div>

                <div class="form-group password-wrapper">
                    <label>Confirm Password</label>
                    <div class="input-icon-group">
                        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" required>
                        <span class="eye-icon" @click="showConfirmPassword = !showConfirmPassword">
                            <span v-if="showConfirmPassword">👁️</span>
                            <span v-else>🔒</span>
                        </span>
                    </div>
                </div>
            </div>
            
            <small class="hint-text">
                * Password must be at least 8 chars, include 1 uppercase letter & 1 number.
            </small>

            <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
            </button>
            
            <div class="login-link">
                <p>Already have an account? <router-link to="/login">Log in</router-link></p>
            </div>
        </form>
    </div>
</template>

<style scoped>
.signup-container {
    max-width: 550px;
    margin: 40px auto;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    background: #fff;
    font-family: 'Segoe UI', sans-serif;
}
.signup-container h1 { text-align: center; margin-bottom: 25px; color: #1e3a8a; } /* لون كحلي */

.signup-container form { display: flex; flex-direction: column; }
.form-row { display: flex; gap: 15px; }
.form-group { flex: 1; display: flex; flex-direction: column; position: relative;}
.form-group.small { flex: 0.4; }

label { margin-bottom: 6px; font-weight: 600; font-size: 0.9rem; color: #444; }
input, select { margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; width: 100%; box-sizing: border-box; font-size: 14px; transition: border-color 0.3s; }
input:focus, select:focus { border-color: #1e3a8a; outline: none; }

/* زر التسجيل باللون الكحلي */
button { 
    padding: 12px; 
    background-color: #1e3a8a; 
    color: white; 
    border: none; 
    border-radius: 5px; 
    cursor: pointer; 
    font-size: 16px; 
    font-weight: bold; 
    margin-top: 15px; 
    transition: background 0.3s; 
}
button:hover { background-color: #152c52; }
button:disabled { background-color: #ccc; cursor: not-allowed; }

.login-link { text-align: center; margin-top: 15px; font-size: 0.9em; }
.login-link a { color: #1e3a8a; font-weight: bold; text-decoration: none; }
.login-link a:hover { text-decoration: underline; }

.error-msg { color: #dc3545; text-align: center; margin-bottom: 10px; font-size: 0.9em; background: #fff5f5; padding: 8px; border: 1px solid #dc3545; border-radius: 4px; }
.hint-text { font-size: 0.75rem; color: #666; margin-top: -10px; margin-bottom: 15px; }

/* أيقونة العين */
.input-icon-group { position: relative; width: 100%; }
.eye-icon {
    position: absolute;
    right: 10px;
    top: 35%;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 1.2rem;
    user-select: none;
}

</style>

<!-- <script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import backtohome from '@/components/backtohome.vue'; 

const router = useRouter();

// المتغيرات المطلوبة للباك اند
const prefix = ref('Mr.'); 
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const degree = ref('');
const birthDate = ref('');
const country = ref('');
const institution = ref('');

const errorMessage = ref('');
const isLoading = ref(false);

// متغيرات التحكم بإظهار كلمة المرور
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleSignup = async () => {
    if (password.value !== confirmPassword.value) {
        errorMessage.value = "كلمة المرور غير متطابقة!";
        return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
        const fullName = `${firstName.value} ${lastName.value}`;

        const response = await axios.post('http://localhost:8080/createUser', {
            prefix: prefix.value,
            name: fullName,
            degree: degree.value,
            email: email.value,
            birth_date: birthDate.value,
            country: country.value,
            institution: institution.value,
            password: password.value
        });

        if (response.status === 201) {
            alert("تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.");
            router.push('/login');
        }

    } catch (error) {
        console.error(error);
        if (error.response && error.response.data) {
            errorMessage.value = error.response.data.error || "حدث خطأ، ربما البريد الإلكتروني مستخدم مسبقاً";
        } else {
            errorMessage.value = "حدث خطأ في الاتصال بالسيرفر (تأكد من تشغيل Port 8080)";
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <backtohome />
    <div class="signup-container">
        <h1>Create New Account</h1>
        <form @submit.prevent="handleSignup">
            
            <div class="form-row">
                <div class="form-group small">
                    <label>Prefix</label>
                    <select v-model="prefix" required>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" v-model="firstName" required placeholder="Ahmad">
                </div>
                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" v-model="lastName" required placeholder="Ali">
                </div>
            </div>

            <label>Institution (University)</label>
            <input type="text" v-model="institution" required placeholder="Jordan University of Science and Technology">

            <div class="form-row">
                <div class="form-group">
                    <label>Degree</label>
                    <select v-model="degree" required>
                        <option value="" disabled>Select Degree</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Master">Master</option>
                        <option value="PhD">PhD</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Country</label>
                    <input type="text" v-model="country" required placeholder="Jordan">
                </div>
            </div>

            <label>Date of Birth</label>
            <input type="date" v-model="birthDate" required>
            
            <label>Email</label>
            <input type="email" v-model="email" required placeholder="example@just.edu.jo">

            <div class="form-row">
                <div class="form-group password-wrapper">
                    <label>Password</label>
                    <div class="input-icon-group">
                        <input 
                            :type="showPassword ? 'text' : 'password'" 
                            v-model="password" 
                            required
                        >
                        <span 
                            class="eye-icon" 
                            @click="showPassword = !showPassword"
                        >
                            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </span>
                    </div>
                </div>

                <div class="form-group password-wrapper">
                    <label>Confirm Password</label>
                    <div class="input-icon-group">
                        <input 
                            :type="showConfirmPassword ? 'text' : 'password'" 
                            v-model="confirmPassword" 
                            required
                        >
                        <span 
                            class="eye-icon" 
                            @click="showConfirmPassword = !showConfirmPassword"
                        >
                             <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </span>
                    </div>
                </div>
            </div>

            <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
            </button>
            
            <div class="login-link">
                <p>Already have an account? <router-link to="/login">Log in</router-link></p>
            </div>
        </form>
    </div>
</template>

<style scoped>
.signup-container {
    max-width: 500px;
    margin: 40px auto;
    padding: 25px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background: #fff;
}
.signup-container h1 { text-align: center; margin-bottom: 25px; color: #333; }
.signup-container form { display: flex; flex-direction: column; }
.form-row { display: flex; gap: 10px; }
.form-group { flex: 1; display: flex; flex-direction: column; }
.form-group.small { flex: 0.4; }

label { margin-bottom: 5px; font-weight: 600; font-size: 0.9em; color: #555; }
input, select { margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; width: 100%; box-sizing: border-box; font-size: 14px; }
input:focus, select:focus { border-color: #007bff; outline: none; }

button { padding: 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold; margin-top: 10px; transition: background 0.3s; }
button:hover { background-color: #218838; }
button:disabled { background-color: #ccc; cursor: not-allowed; }

.login-link { text-align: center; margin-top: 15px; font-size: 0.9em; }
.login-link a { color: #007bff; text-decoration: none; }
.error-msg { color: #dc3545; text-align: center; margin-bottom: 10px; font-size: 0.9em; background: #f8d7da; padding: 8px; border-radius: 4px; }

/* 👇 ستايل العين الجديد */
.password-wrapper { position: relative; }
.input-icon-group { position: relative; width: 100%; }
.eye-icon {
    position: absolute;
    right: 10px;
    top: 38%; /* تعديل بسيط للمحاذاة */
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #777; /* لون الأيقونة رمادي */
}
.eye-icon:hover { color: #333; } /* تغميق اللون عند المرور */

/* تعديل عشان النص ما يجي فوق العين */
.input-icon-group input { padding-right: 40px; margin-bottom: 0; } 
</style> -->