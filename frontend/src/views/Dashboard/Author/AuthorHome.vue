<script setup>
import { ref, onMounted } from 'vue';

const authorName = ref('Loading...');
const stats = ref({ submitted: 0, underReview: 0, published: 0 });

onMounted(() => {
  const storedName = localStorage.getItem('userName');
  authorName.value = storedName || 'Researcher';
  // محاكاة
  setTimeout(() => {
    stats.value = { submitted: 5, underReview: 2, published: 3 };
  }, 500);
});
</script>

<template>
  <div class="author-home">
    <div class="header-section">
      <h1>Welcome, '{{ authorName }}', to JUST Journal</h1>
      <p>Please review our publication policies below</p>
    </div>

    <div class="content-card policies-card">
      <h3>Publication Policies</h3>
      <ul class="policy-list">
        <li>The research paper must be complete and well-structured.</li>
        <li>Must be relevant to the journal’s scope.</li>
        <li>Researcher takes full responsibility for content.</li>
        <li>Citation percentage must be respected.</li>
        <li>No simultaneous submissions allowed.</li>
        <li>All info must be documented.</li>
        <li>Research undergoes peer review.</li>
        <li>Copyrights transferred upon acceptance.</li>
      </ul>
    </div>

    <div class="stats-container">
      <div class="stat-card">
        <span class="number">{{ stats.submitted }}</span>
        <span class="label">Submitted Papers</span>
      </div>
      <div class="stat-card">
        <span class="number">{{ stats.underReview }}</span>
        <span class="label">Under Review</span>
      </div>
      <div class="stat-card">
        <span class="number">{{ stats.published }}</span>
        <span class="label">Published</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* نفس الستايل اللي اتفقنا عليه */
.header-section { margin-bottom: 25px; }
.header-section h1 { font-size: 1.8rem; font-weight: 700; margin-bottom: 5px; color: #333;}
.header-section p { color: #666; }
.content-card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); margin-bottom: 30px; }
.policy-list { padding-left: 20px; list-style-type: disc; color: #444; line-height: 1.6; }
.stats-container { display: flex; gap: 20px; justify-content: space-between; }
.stat-card { background: white; flex: 1; padding: 25px; border-radius: 8px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
.stat-card .number { font-size: 2rem; font-weight: 700; display: block; color: #000; }
.stat-card .label { font-size: 0.9rem; color: #666; }
</style>