<script setup lang="ts">
import { useLanguageStore } from '@/stores/languageStore.ts';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import {
    type Item,
    type LanguageInfo,
    languageService,
    type WordPack,
} from '@/services/languageService.ts';
import { useUserStore } from '@/stores/userStore.ts';
import { useToast } from 'primevue/usetoast';
import type { SelectType } from '@/utils/types.ts';

const languageStore = useLanguageStore();
const { user } = useUserStore();
const toast = useToast();
const { selectedLanguage } = storeToRefs(languageStore);

const languagesInfo = ref<LanguageInfo[]>([]);
const languageWorldPacks = ref<WordPack[]>([]);

const setListPacks = (): void => {
    languageWorldPacks.value = languageService.getLanguageWorldPacks(
        languagesInfo.value,
        selectedLanguage.value!.name,
    );
};

onMounted(async () => {
    languagesInfo.value = await languageService.getLanguagesInfo();
    setListPacks();
});

watch(selectedLanguage, () => {
    setListPacks();
});

const selectedPack = ref<SelectType<number> | null>(null);
const listPacs = computed(() =>
    languageWorldPacks.value.map((_, index) => ({ name: `Пак ${index + 1}`, code: index + 1 })),
);

const initNewWord = computed(() => ({ TranslateVariants: [''] }));
const newWord = ref<Partial<Item>>(initNewWord.value);
const saveNewWord = async (): Promise<void> => {
    if (
        !newWord.value.Word ||
        !newWord.value.Pronunciation ||
        !newWord.value.TranslateVariants?.length
    ) {
        toast.add({
            severity: 'error',
            summary: 'Заполните нужные поля!',
            life: 3000,
        });
        return;
    }

    const err = await languageService.saveNewWord(
        selectedLanguage.value!.name,
        user!.uid,
        selectedPack.value?.code || listPacs.value.length + 1,
        newWord.value as Item,
    );

    if (err) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка добавления слова',
            detail: err.message,
            life: 3000,
        });
        return;
    }

    toast.add({
        severity: 'success',
        summary: `Слово добавлено в Пак ${selectedPack.value ? selectedPack.value.code : listPacs.value.length + 1}`,
        life: 3000,
    });
    newWord.value = initNewWord.value;
    setListPacks();
};
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-4 md:p-6">
        <div class="max-w-3xl mx-auto">
            <h1
                class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center"
            >
                Добавить слово
            </h1>

            <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
                <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Язык</label>
                    <Select
                        v-model="selectedLanguage"
                        :options="languageService.getLanguages(languagesInfo)"
                        optionLabel="name"
                        placeholder="Выберите язык"
                        class="w-full md:w-72"
                    />
                    <p v-if="!selectedLanguage" class="text-xs text-amber-600">
                        Сначала выберите язык
                    </p>
                </div>

                <div v-if="selectedLanguage" class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700"
                        >Пак (необязательно)</label
                    >
                    <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <Select
                            v-model="selectedPack"
                            :options="listPacs"
                            optionLabel="name"
                            placeholder="Выберите существующий пак"
                            class="w-full sm:w-72"
                        />
                        <Button
                            class="bg-gray-200 hover:bg-gray-300 text-gray-800 border-none px-4 py-2 rounded-lg transition-all"
                            @click="selectedPack = null"
                        >
                            Сбросить
                        </Button>
                    </div>
                    <p class="text-xs text-gray-500">
                        Если пак не выбран, будет создан новый (№{{ listPacs.length + 1 }})
                    </p>
                </div>

                <div v-if="selectedLanguage" class="space-y-5">
                    <div class="space-y-1">
                        <label class="block text-sm font-semibold text-gray-700">
                            Слово <span class="text-red-500">*</span>
                        </label>
                        <InputText
                            v-model="newWord.Word"
                            placeholder="Например: apple"
                            class="w-full p-3 rounded-xl border-gray-300 focus:border-indigo-400 focus:ring focus:ring-indigo-200"
                        />
                    </div>

                    <div class="space-y-1">
                        <label class="block text-sm font-semibold text-gray-700"
                            >Произношение <span class="text-red-500">*</span></label
                        >
                        <InputText
                            v-model="newWord.Pronunciation"
                            placeholder="Например: ˈæpəl"
                            class="w-full p-3 rounded-xl border-gray-300 focus:border-indigo-400 focus:ring focus:ring-indigo-200"
                        />
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <label class="text-sm font-semibold text-gray-700">
                                Варианты перевода <span class="text-red-500">*</span>
                            </label>
                            <Button
                                class="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-none px-3 py-1 rounded-full text-sm transition-all"
                                @click="newWord.TranslateVariants?.push('')"
                            >
                                + Добавить
                            </Button>
                        </div>
                        <div class="space-y-2">
                            <div
                                v-for="(_, index) in newWord.TranslateVariants"
                                :key="index"
                                class="flex gap-2 items-center"
                            >
                                <InputText
                                    v-model="newWord.TranslateVariants![index]"
                                    placeholder="Перевод"
                                    class="flex-1 p-2 rounded-lg border-gray-300 focus:border-indigo-400"
                                />
                                <Button
                                    class="bg-rose-100 hover:bg-rose-200 text-rose-600 border-none p-2 rounded-lg transition-all"
                                    :disabled="newWord.TranslateVariants?.length === 1"
                                    @click="newWord.TranslateVariants?.splice(index, 1)"
                                >
                                    ✕
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="selectedLanguage" class="pt-2">
                    <Button
                        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                        @click="saveNewWord"
                    >
                        Сохранить слово
                    </Button>
                </div>
            </div>

            <div class="mt-6 text-center">
                <RouterLink to="/packs">
                    <Button
                        class="bg-gray-100 hover:bg-gray-200 text-gray-700 border-none px-6 py-2 rounded-full shadow-sm transition-all"
                    >
                        ← Вернуться к пакам
                    </Button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.p-inputtext:enabled:focus {
    box-shadow: 0 0 0 2px #c7d2fe;
}
</style>