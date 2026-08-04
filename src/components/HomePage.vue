<script setup lang="ts">
import { loginService } from '@/services/loginService.ts';
import { useUserStore } from '@/stores/userStore.ts';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { checkStateService } from '@/services/checkStateService.ts';
import { useToast } from 'primevue/usetoast';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const toast = useToast();

const disabledTrain = ref(true);
const isCheckingTraining = ref(false);
const isLoggingOut = ref(false);

onMounted(async () => {
    if (!user.value?.uid) {
        return;
    }

    isCheckingTraining.value = true;
    try {
        const checkInfo = await checkStateService.getCheckInfo(user.value.uid);
        disabledTrain.value = !checkInfo?.WordsList.length;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Не удалось загрузить состояние тренировки',
            detail: error instanceof Error ? error.message : undefined,
            life: 3000,
        });
    } finally {
        isCheckingTraining.value = false;
    }
});

const logout = async (): Promise<void> => {
    if (isLoggingOut.value) {
        return;
    }

    isLoggingOut.value = true;
    try {
        await loginService.logout(userStore.setUser);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Не удалось выйти из аккаунта',
            detail: error instanceof Error ? error.message : undefined,
            life: 3000,
        });
    } finally {
        isLoggingOut.value = false;
    }
};
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-6 text-center"
    >
        <h1
            class="font-sans text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8"
        >
            vwords
        </h1>
        <div class="grid w-full max-w-xs grid-cols-1 gap-4 sm:max-w-2xl sm:grid-cols-2">
            <RouterLink to="/packs" class="w-full">
                <Button
                    class="w-full bg-indigo-600 hover:bg-indigo-700 border-none text-white font-semibold py-2 rounded-xl shadow-md transition-all"
                >
                    К пакам
                </Button>
            </RouterLink>

            <RouterLink to="/train" class="w-full">
                <Button
                    :disabled="disabledTrain"
                    :loading="isCheckingTraining"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 border-none text-white font-semibold py-2 rounded-xl shadow-md transition-all"
                >
                    К заданиям
                </Button>
            </RouterLink>
            <RouterLink v-if="user" to="/korean-numbers" class="w-full">
                <Button
                    class="w-full rounded-xl border-none bg-violet-600 py-2 font-semibold text-white shadow-md transition-all hover:bg-violet-700"
                >
                    Корейские числительные
                </Button>
            </RouterLink>
            <Button
                v-else
                disabled
                title="Авторизуйтесь, чтобы открыть тренировку"
                class="w-full rounded-xl border-none bg-violet-600 py-2 font-semibold text-white shadow-md"
            >
                Корейские числительные
            </Button>
            <RouterLink v-if="!user" to="/auth" class="w-full">
                <Button
                    class="w-full bg-emerald-600 hover:bg-emerald-700 border-none text-white font-semibold py-2 rounded-xl shadow-md transition-all"
                >
                    Авторизоваться
                </Button>
            </RouterLink>
            <Button
                v-if="user"
                :loading="isLoggingOut"
                :disabled="isLoggingOut"
                class="w-full bg-rose-600 hover:bg-rose-700 border-none text-white font-semibold py-2 rounded-xl shadow-md transition-all"
                @click="logout"
            >
                Выйти
            </Button>
        </div>
    </div>
</template>
<style scoped></style>
