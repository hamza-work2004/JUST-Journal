<script setup>
import ReviewerNavbar from '@/components/ReviewerNavbar.vue'; // بنجيب الناف بار
</script>

<template>
  <div class="layout">
    <ReviewerNavbar /> <main class="content">
      <router-view></router-view> </main>
  </div>
</template>