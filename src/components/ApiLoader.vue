<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';

withDefaults(
    defineProps<{
        message?: string;
        overlay?: boolean;
    }>(),
    {
        message: 'Загрузка данных...',
        overlay: false,
    },
);
</script>

<template>
    <div
        :class="[
            'flex flex-col items-center justify-center gap-3 text-center text-sm font-medium text-gray-600',
            overlay
                ? 'fixed inset-0 z-50 min-h-screen bg-white/80 p-6 backdrop-blur-sm'
                : 'min-h-64 rounded-2xl bg-white/70 p-8',
        ]"
        role="status"
        aria-live="polite"
        aria-busy="true"
    >
        <ProgressSpinner
            class="h-12 w-12"
            strokeWidth="4"
            animationDuration="0.8s"
            :aria-label="message"
        />
        <span>{{ message }}</span>
    </div>
</template>
