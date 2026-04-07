<script setup lang="ts">
import { loginService } from '@/services/loginService.ts';
import { useUserStore } from '@/stores/userStore.ts';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-6 text-center"
    >
        <h1
            class="font-sans text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8"
        >
            vworls
        </h1>
        <div class="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md">
            <RouterLink to="/packs" class="w-full">
                <Button
                    class="w-full bg-indigo-600 hover:bg-indigo-700 border-none text-white font-semibold py-2 rounded-xl shadow-md transition-all"
                >
                    К пакам
                </Button>
            </RouterLink>

            <RouterLink to="/packs" class="w-full">
                <Button
                    disabled
                    class="w-full bg-indigo-600 hover:bg-indigo-700 border-none text-white font-semibold py-2 rounded-xl shadow-md transition-all"
                >
                    К заданиям
                </Button>
            </RouterLink>
            <RouterLink v-if="!user" to="/auth" class="w-full">
                <Button
                    class="w-full bg-emerald-600 hover:bg-emerald-700 border-none text-white font-semibold py-2 rounded-xl shadow-md transition-all"
                >
                    Авторизоваться
                </Button>
            </RouterLink>
            <Button
                v-if="user"
                class="w-full bg-rose-600 hover:bg-rose-700 border-none text-white font-semibold py-2 rounded-xl shadow-md transition-all"
                @click="() => loginService.logout(userStore.setUser)"
            >
                Выйти
            </Button>
        </div>
    </div>
</template>
<style scoped></style>
