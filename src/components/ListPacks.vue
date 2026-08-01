<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type LanguageInfo, languageService, type WordPack } from '@/services/languageService.ts';
import { useLanguageStore } from '@/stores/languageStore.ts';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore.ts';
import router from '@/router';
import { checkStateService } from '@/services/checkStateService.ts';
import ApiLoader from '@/components/ApiLoader.vue';
import { useToast } from 'primevue/usetoast';

const languageStore = useLanguageStore();
const { user } = useUserStore();
const { selectedLanguage, selectedPacks } = storeToRefs(languageStore);
const toast = useToast();

const languagesInfo = ref<LanguageInfo[]>([]);
const languageWorldPacks = ref<WordPack[]>([]);
const isLoadingPacks = ref(true);
const isStartingTraining = ref(false);

onMounted(async () => {
    try {
        languagesInfo.value = await languageService.getLanguagesInfo();
        setListPacks();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Не удалось загрузить языки и паки',
            detail: error instanceof Error ? error.message : undefined,
            life: 3000,
        });
    } finally {
        isLoadingPacks.value = false;
    }
});

const setListPacks = (): void => {
    if (!selectedLanguage.value) {
        languageWorldPacks.value = [];
        return;
    }

    languageWorldPacks.value = languageService.getLanguageWorldPacks(
        languagesInfo.value,
        selectedLanguage.value.name,
    );
};

watch(selectedLanguage, setListPacks);

const goToTrainPage = async () => {
    if (!user?.uid || isStartingTraining.value) {
        return;
    }

    isStartingTraining.value = true;
    try {
        await Promise.all([
            checkStateService.setWordList(user.uid, []),
            checkStateService.setStat(user.uid, {}),
        ]);
        await router.push('/train');
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Не удалось подготовить тренировку',
            detail: error instanceof Error ? error.message : undefined,
            life: 3000,
        });
    } finally {
        isStartingTraining.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Выберите паки</h1>
            <ApiLoader v-if="isLoadingPacks" message="Загружаем языки и паки..." />
            <template v-else>
                <div class="flex gap-4 mb-8">
                    <Select
                        v-model="selectedLanguage"
                        :options="languageService.getLanguages(user?.uid!, languagesInfo)"
                        optionLabel="name"
                        placeholder="Выберите язык"
                        class="w-full md:w-64 bg-white rounded-xl shadow-sm"
                    />
                    <RouterLink to="/add">
                        <Button
                            class="bg-indigo-600 hover:bg-indigo-700 border-none text-white font-semibold px-8 py-2 rounded-full shadow-md transition-all"
                        >
                            Добавить новое слово
                        </Button>
                    </RouterLink>
                </div>

                <div
                    v-if="languageWorldPacks.length"
                    class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8"
                >
                    <div
                        v-for="(pack, index) in languageWorldPacks"
                        :key="index"
                        class="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3 transition-all hover:shadow-lg"
                    >
                        <div class="flex justify-between items-center">
                            <span class="font-semibold text-gray-700 text-lg"
                                >Пак {{ index + 1 }}</span
                            >
                            <ToggleSwitch
                                :modelValue="selectedPacks.has(pack.Id)"
                                @update:model-value="
                                    (checked: boolean) =>
                                        languageStore.onChangeSelectedPacks(pack.Id, checked)
                                "
                            />
                        </div>
                        <div class="text-gray-500 text-sm">
                            Количество слов: {{ pack.Items.length }}
                        </div>
                    </div>
                </div>
                <div v-else class="bg-amber-50 rounded-xl p-6 text-center text-amber-700">
                    Нет доступных паков для выбранного языка
                </div>
                <div v-if="selectedPacks.size" class="mt-6 flex justify-center">
                    <Button
                        :loading="isStartingTraining"
                        :disabled="isStartingTraining"
                        class="bg-indigo-600 hover:bg-indigo-700 border-none text-white font-semibold px-8 py-2 rounded-full shadow-md transition-all"
                        @click="goToTrainPage"
                    >
                        Начать тренировку!
                    </Button>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped></style>
