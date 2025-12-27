<script setup>
import { ref } from 'vue';
// تأكد ان اسم الملف هون بطابق اسم الملف عندك (كبير او صغير)
import Navbar from "@/components/navbar.vue"; 

// 1. تعريف المتغير (Reactive Data)
const selectedPolicy = ref('general');

// 2. دالة التغيير (Method)
const selectPolicy = (type) => {
  selectedPolicy.value = type;
};
</script>

<template>
  <Navbar :showSearch="false"/>

  <section class="policies-page">
    <div class="section-header">
      <h3>Journal Publication Policies</h3>
      <p>Please review the publication and peer-review policies below.</p>
    </div>

    <div class="policy-buttons">
      <button
        :class="['policy-btn', selectedPolicy === 'general' ? 'active' : '']"
        @click="selectPolicy('general')"
      >
        General Publishing Policies
      </button>

      <button
        :class="['policy-btn', selectedPolicy === 'peer' ? 'active' : '']"
        @click="selectPolicy('peer')"
      >
        Peer Review Policies
      </button>
    </div>

    <div v-if="selectedPolicy === 'general'" class="policy-card">
      <h4 class="policy-title">General Publishing Policies</h4>
      <ul class="policy-list">
        <li>The submitted research must be complete and well-structured.</li>
        <li>Authors are fully responsible for all information and data included in the manuscript.</li>
        <li>Researchers must adhere to the allowed citation percentage and ensure the originality of the ideas.</li>
        <li>The manuscript must not be published previously or submitted to any other journal.</li>
        <li>All information must be properly referenced according to scientific standards.</li>
        <li>Research must be submitted in two languages: the original language and English (or Arabic if originally in English).</li>
        <li>Submitted manuscripts undergo professional review, editing, and evaluation.</li>
        <li>Upon acceptance, all publishing and copyright rights are transferred to the journal.</li>
      </ul>
    </div>

    <div v-if="selectedPolicy === 'peer'" class="policy-card">
      <h4 class="policy-title">Peer Review Policies</h4>
      <ul class="policy-list">
        <li>Reviewers verify that the manuscript is complete in all sections.</li>
        <li>Each element is evaluated separately (title, problem, objectives, chapters, tables...).</li>
        <li>Citation percentage and documentation accuracy are checked.</li>
        <li>Reviewers ensure proper formatting and logical structure.</li>
        <li>The manuscript must be free from linguistic and grammatical errors.</li>
        <li>Ethical standards must be followed: academic honesty, objectivity, validity, and integrity.</li>
        <li>Review ensures detection of plagiarism and scientific misconduct if present.</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* نفس الستايل تبعك بالزبط */

.policies-page {
  padding: 40px 20px;
  max-width: 1200px;
  margin: auto;
}

/* Header */
.section-header {
  text-align: center;
  margin-bottom: 25px;
}
.section-header h3 {
  font-size: 28px;
  color: #1b396a;
}
.section-header p {
  color: #666;
}

/* Buttons */
.policy-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 25px;
}

.policy-btn {
  padding: 10px 22px;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  border: 1px solid #1b396a;
  background: transparent;
  color: #1b396a;
  transition: 0.3s;
}

.policy-btn:hover {
  background: #1b396a;
  color: white;
}

.policy-btn.active {
  background: #1b396a;
  color: white;
}

/* Card */
.policy-card {
  background: #ffffff;
  padding: 30px 35px;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
}

.policy-title {
  font-size: 22px;
  margin-bottom: 20px;
  color: #1b396a;
}

.policy-list {
  list-style: disc;
  padding-left: 25px;
}

.policy-list li {
  margin-bottom: 12px;
  line-height: 1.6;
  color: #444;
}
</style>