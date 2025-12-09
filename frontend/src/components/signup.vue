<script setup>
import { ref } from 'vue';
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

</script>
<template>
    <div class="signup-container">
        <h1>Sign Up</h1>
        <form>
            <label for="first-name" >First Name: </label>
            <input type="text" id="first-name" v-model="firstName" required >
            
            <label for="last-name" >Last Name: </label>
            <input type="text" id="last-name" v-model="lastName" required >
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" required>

            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required>

            <label for="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" v-model="confirmPassword" required>

            <button type="submit">Sign Up</button>
            <div class="login-link">
                <p>Already have an account? <router-link to="/login">Log in</router-link></p>
            </div>
        </form>
    </div>
</template>
<style scoped>
.signup-container {
    max-width: 400px;
    margin: 0 auto;
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
.signup-container input {
    margin-bottom: 15px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
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

</style>