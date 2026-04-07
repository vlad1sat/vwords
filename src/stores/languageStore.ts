import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { SelectType } from '@/utils/types.ts';

export const useLanguageStore = defineStore('language', () => {
    const selectedPacks = ref<Set<number>>(new Set());
    const selectedLanguage = ref<SelectType<string> | null>(null);

    const onChangeSelectedPacks = (packId: number, checked: boolean) => {
        if (checked) {
            selectedPacks.value.add(packId);
            return;
        }
        selectedPacks.value.delete(packId);
    };

    watch(selectedLanguage, () => selectedPacks.value.clear());

    return {
        selectedLanguage,
        selectedPacks,
        onChangeSelectedPacks,
    };
});
