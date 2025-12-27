<script setup>
import { ref } from 'vue';
import axios from 'axios';
const email = ref('');

const resetPassword = async () => {
    try {
        const response = await axios.post('/api/forgot-password', { email: email.value });
        alert('Password reset link sent to your email');
    } catch (error) {
        console.error('Error resetting password:', error);
    }
};

</script>

<template>
    <div class="forgot-pass-container">
        <h1>Forgot Password</h1>
        <form>
            <label for="email">Email:</label>
            <input type="email" id="email" required>

            <button type="submit">Reset Password</button>
            <div class="login-link">
                <p>Remembered your password? <router-link to="/login">Log in</router-link></p>
            </div>
        </form>
    </div>
</template>
<style scoped>
.forgot-pass-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.forgot-pass-container h1 {
    text-align: center;
    margin-bottom: 20px;
}
.forgot-pass-container form {
    display: flex;
    flex-direction: column;
}
.forgot-pass-container label {
    margin-bottom: 5px;
    font-weight: bold;
}
.forgot-pass-container input {
    margin-bottom: 15px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
}
.forgot-pass-container button {
    padding: 10px;
    background-color: #ffc107;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}
.forgot-pass-container .login-link {
    text-align: center;
    margin-top: 15px;
}
.forgot-pass-container button:hover {
    background-color: #e0a800;
}

</style>