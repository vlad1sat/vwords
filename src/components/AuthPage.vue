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
    <div class="p-8"></div>
    <div class="flex flex-col gap-y-2">
        <FloatLabel variant="on">
            <InputText v-model="values.email" type="email" />
            <label for="on_label">Email</label>
        </FloatLabel>
        <FloatLabel variant="on">
            <Password v-model="values.password" :feedback="false" toggleMask />
            <label for="on_label">Password</label>
        </FloatLabel>
        <Button
            type="submit"
            severity="secondary"
            label="Submit"
            class="w-full sm:w-56"
            @click="onFormSubmit"
        />
    </div>
</template>

<style scoped></style>
