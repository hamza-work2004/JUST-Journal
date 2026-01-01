<script setup>
const reviewerName = "Reviewer Name";
</script>

<template>
  <div class="content-wrapper">
      <div class="welcome-card">
        <h1>Welcome, {{ reviewerName }}</h1>
        <p>Please review the general peer-review policies below</p>
      </div>

      <div class="content-card">
        <h2 class="section-title">Please conduct the peer-review process according to scientific principles.</h2>
        
        <p class="intro-text">
          The peer-review of a scientific research paper or scholarly work should not be conducted arbitrarily; rather, it must be based on criteria and guidelines established by expert reviewers. These criteria aim to eliminate randomness and inconsistency in the review process, prevent reviewer bias toward any researcher, reduce contradictions in reviewers' final judgments, and ensure transparency and integrity in evaluating scientific or scholarly work. The main scientific foundations for evaluating research can be summarized as follows:
        </p>

        <ul class="guidelines-list">
          <li>
            <strong>Review based on the completeness of the research:</strong> verifying that the scientific research or scholarly work contains all required elements from the first page to the final section.
          </li>
          <li>
            <strong>Review based on the presence and quality of research components:</strong> evaluating each section individually to ensure it is accurate and properly written, including the research title, research problem, objectives and significance, chapters, tables, and indexes.
          </li>
          <li>
            <strong>Review based on citation and referencing practices:</strong> assessing the percentage of cited material and determining its appropriateness, as well as evaluating whether the referencing method follows proper academic standards.
          </li>
          <li>
            <strong>Review based on the organization and formatting of the research:</strong> ensuring that the research follows a logical sequence and that its components are arranged according to standard scientific research principles.
          </li>
          <li>
            <strong>Review based on writing accuracy and technical correctness:</strong> confirming the absence of linguistic and typographical errors, and ensuring that the researcher has performed proper linguistic and grammatical proofreading.
          </li>
          <li>
            <strong>Review based on research ethics:</strong> verifying that the researcher adhered to ethical standards, ensuring the absence of plagiarism, and evaluating the objectivity, logic, honesty, and accuracy reflected in the scientific work.
          </li>
        </ul>
      </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* ستايل بطاقة الترحيب */
.welcome-card {
  background-color: white;
  padding: 30px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 20px;
}

.welcome-card h1 {
  color: #1e3a8a;
  margin-bottom: 10px;
  font-size: 28px;
}

.welcome-card p {
  color: #6b7280;
  font-size: 16px;
}

/* ستايل بطاقة المحتوى */
.content-card {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.section-title {
  color: #1e3a8a;
  font-size: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.intro-text {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 25px;
  font-size: 15px;
  text-align: justify;
}

.guidelines-list {
  padding-left: 20px;
}

.guidelines-list li {
  margin-bottom: 15px;
  color: #374151;
  line-height: 1.5;
  font-size: 15px;
}

.guidelines-list strong {
  color: #1f2937;
  font-weight: 600;
}
</style>