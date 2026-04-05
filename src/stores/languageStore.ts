import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Language } from '@/services/languageService.ts';

export const useLanguageStore = defineStore('language', () => {
    const selectedPacks = ref<Set<string>>(new Set());
    const selectedLanguage = ref<Language | null>(null);

    const onChangeSelectedPacks = (packId: string, checked: boolean) => {
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
