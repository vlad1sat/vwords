<script setup lang="ts">
import { useUserStore } from '@/stores/userStore.ts';
import { loginService } from '@/services/loginService.ts';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import router from '@/router';

const toast = useToast();
const values = ref({
    email: '',
    password: '',
});

const { setUser } = useUserStore();

const onFormSubmit = async () => {
    const [, error] = await loginService.login(setUser, values.value.email, values.value.password);
    if (error) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка авторизации',
            detail: error.message,
            life: 3000,
        });

        return;
    }

    router.push({ path: '/packs' });
};
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center p-4"
    >
        <div class="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
            <h2 class="text-2xl font-bold text-gray-800 text-center mb-6">Вход в аккаунт</h2>
            <div class="flex flex-col gap-y-5">
                <FloatLabel variant="on" class="w-full">
                    <InputText v-model="values.email" type="email" class="w-full" />
                    <label for="on_label">Email</label>
                </FloatLabel>
                <FloatLabel variant="on" class="w-full">
                    <Password
                        v-model="values.password"
                        :feedback="false"
                        toggleMask
                        class="w-full"
                        fluid
                    />
                    <label for="on_label">Пароль</label>
                </FloatLabel>
                <Button
                    type="submit"
                    severity="secondary"
                    label="Войти"
                    class="w-full sm:w-auto mt-2 bg-indigo-600 hover:bg-indigo-700 border-none text-white font-semibold py-2 px-6 rounded-lg transition-all"
                    @click="onFormSubmit"
                />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
