<script setup>
import EditorNavbar from '@/components/EditorNavbar.vue'; 
</script>

<template>
  <div class="dashboard-layout">
    <EditorNavbar />

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
  padding: 30px;
  max-width: 1400px; /* وسعنا العرض شوي لأنه جداول المحرر بتكون عريضة */
  margin: 0 auto;
}
</style>