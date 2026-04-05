<script setup lang="ts">
import { loginService } from '@/services/loginService.ts';
import { useUserStore } from '@/stores/userStore.ts';

const { setUser } = useUserStore();
</script>

<template>
    <div>
        <h1>vworls</h1>
    </div>
    <div class="flex gap-2">
        <RouterLink to="/packs">
            <Button>К пакам</Button>
        </RouterLink>
        <RouterLink to="/auth">
            <Button>Авторизоваться</Button>
        </RouterLink>

        <Button @click="() => loginService.logout(setUser)">Выйти</Button>
    </div>
</template>

<style scoped></style>
