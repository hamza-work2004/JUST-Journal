<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
const router = useRouter();
const isHome = ref(false);
onMounted(() => {
    if (router.currentRoute.value.name !== 'home') {
        isHome.value = true;
    }
});
const goHome = () => {
    router.push({ name: 'home' });
}
</script>
<template>
    <div v-if="isHome" class="back-to-home" @click="goHome">
        ← Back to Home
    </div>
</template>
<style scoped>
.back-to-home {
    cursor: pointer;
    color: #007bff;
    margin: 20px;
    font-size: 16px;
}
.back-to-home:hover {
    text-decoration: underline;
}

</style>