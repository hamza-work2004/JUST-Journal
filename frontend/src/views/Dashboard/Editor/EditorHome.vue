<script setup>
import { ref, onMounted } from 'vue';

// 1. متغير لاسم المحرر
const editorName = ref('Loading...');

onMounted(() => {
  // 2. بنجيب الاسم من التخزين المحلي (اللي تخزن وقت اللوج ان)
  // تأكد انو في صفحة الـ Login انت بتخزن الاسم بـ 'userName'
  const storedName = localStorage.getItem('userName');
  
  // اذا لقينا اسم بنعرضه، اذا لا بنحط 'Editor' كاحتياط
  editorName.value = storedName || 'Editor';
});
</script>

<template>
  <div class="editor-home">
    
    <div class="welcome-card">
      <h2>Welcome, {{ editorName }}, to JUST Journal</h2>
      
      <p class="intro-text">You have the following main responsibilities:</p>

      <ul class="responsibilities-list">
        <li>Receive research submissions from publishers.</li>
        <li>Send research papers for peer review.</li>
        <li>Receive reviewers' decisions and comments on the research.</li>
        <li>Give final decisions on research submissions.</li>
        <li>Promote researchers to reviewers within the journal.</li>
      </ul>
    </div>

  </div>
</template>

<style scoped>
.editor-home {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  display: flex;
  justify-content: center;
}

.welcome-card {
  background: white;
  width: 100%;
  max-width: 900px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #e0e0e0;
}

.welcome-card h2 {
  color: #1b396a;
  font-size: 1.8rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 15px;
}

.intro-text {
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
}

.responsibilities-list {
  padding-left: 20px;
  list-style-type: disc;
}

.responsibilities-list li {
  margin-bottom: 12px;
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
}

@media (max-width: 768px) {
  .welcome-card { padding: 20px; }
  .welcome-card h2 { font-size: 1.5rem; }
}
</style>