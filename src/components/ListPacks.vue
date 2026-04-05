<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type LanguageInfo, languageService, type WorldPack } from '@/services/languageService.ts';
import { useLanguageStore } from '@/stores/languageStore.ts';
import { storeToRefs } from 'pinia';

const languageStore = useLanguageStore();
const { selectedLanguage, selectedPacks } = storeToRefs(languageStore);

const languagesInfo = ref<LanguageInfo[]>([]);
const languageWorldPacks = ref<WorldPack[]>([]);

onMounted(async () => {
    languagesInfo.value = await languageService.getLanguagesInfo();
});

watch(selectedLanguage, () => {
    languageWorldPacks.value = languageService.getLanguageWorldPacks(
        languagesInfo.value,
        selectedLanguage.value!.name,
    );
});
</script>

<template v-if="languagesInfo">
    <Select
        v-model="selectedLanguage"
        :options="languageService.getLanguages(languagesInfo!)"
        optionLabel="name"
        placeholder="Select a Language"
        class="w-full md:w-56"
    />
    <template v-if="languageWorldPacks.length">
        <template v-for="(pack, index) in languageWorldPacks" :key="index">
            <div>
                <div>Пак {{ index + 1 }}</div>
                <ToggleSwitch
                    :modelValue="selectedPacks.has(pack.Id)"
                    @update:model-value="
                        (checked: boolean) => languageStore.onChangeSelectedPacks(pack.Id, checked)
                    "
                />
                <div>Количество слов: {{ pack.Items.length }}</div>
            </div>
        </template>
    </template>
    <template v-else>
        <p>Нет паков!</p>
    </template>
    <template v-if="selectedPacks.size">
        <RouterLink to="/train">
            <Button>Начать!</Button>
        </RouterLink>
    </template>
</template>

<style scoped></style>
