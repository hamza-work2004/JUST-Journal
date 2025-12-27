<script setup>
import AuthorNavbar from '@/components/AuthorNavbar.vue'; 
</script>

<template>
  <div class="dashboard-layout">
    <AuthorNavbar />

    <main class="dashboard-content">
      <router-view></router-view> 
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}
.dashboard-content {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>