<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import type { Unsubscribe } from 'firebase/auth';
import { loginService } from '@/services/loginService.ts';
import { useUserStore } from '@/stores/userStore.ts';

let unsubscribeAuth: Unsubscribe | null = null;
const { setUser } = useUserStore();

onMounted(() => {
    unsubscribeAuth = loginService.authStateChange(setUser);
});
onUnmounted(() => {
    unsubscribeAuth?.();
    unsubscribeAuth = null;
});
</script>

<template>
    <Toast />
    <RouterView />
</template>

<style scoped></style>
