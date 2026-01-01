<script setup>
import ReviewerNavbar from '@/components/ReviewerNavbar.vue'; // تأكد أن الناف بار موجود في الكومبوننتس
</script>

<template>
  <div class="page-container">
    <ReviewerNavbar />
    
    <router-view />
  </div>
</template>

<style scoped>
.page-container {
  background-color: #f3f4f6;
  min-height: 100vh;
}
</style>