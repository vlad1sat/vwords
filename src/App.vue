<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { Unsubscribe } from 'firebase/auth';
import { loginService } from '@/services/loginService.ts';
import { useUserStore } from '@/stores/userStore.ts';
import ApiLoader from '@/components/ApiLoader.vue';

let unsubscribeAuth: Unsubscribe | null = null;
const { setUser } = useUserStore();
const isAuthLoading = ref(true);

onMounted(() => {
    unsubscribeAuth = loginService.authStateChange(setUser, () => {
        isAuthLoading.value = false;
    });
});
onUnmounted(() => {
    unsubscribeAuth?.();
    unsubscribeAuth = null;
});
</script>

<template>
    <Toast />
    <ApiLoader v-if="isAuthLoading" overlay message="Проверяем авторизацию..." />
    <RouterView v-else />
</template>

<style scoped></style>
