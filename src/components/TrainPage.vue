<script setup lang="ts">
import { useLanguageStore } from '@/stores/languageStore.ts';
import { computed, onMounted, ref } from 'vue';
import { type Item, type ItemWithState, languageService } from '@/services/languageService.ts';
import { shuffleArray } from '@/utils/shuffleArray.ts';
import TrainCard from '@/components/TrainCard.vue';
import { checkStateService } from '@/services/checkStateService.ts';
import { useUserStore } from '@/stores/userStore.ts';
import ApiLoader from '@/components/ApiLoader.vue';
import { useToast } from 'primevue/usetoast';
import router from '@/router';
import { getNextTrainItem } from '@/utils/getNextTrainItem.ts';

const languageStore = useLanguageStore();
const { user } = useUserStore();
const toast = useToast();

const { selectedLanguage, selectedPacks } = languageStore;

const shuffleItems = ref<Item[]>([]);
const selectedItem = ref<ItemWithState | null>(null);
const isInitialLoading = ref(true);
const isLoadingNextWord = ref(false);
const questionKey = ref(0);

const goToNextWord = async (): Promise<void> => {
    if (!user?.uid || isLoadingNextWord.value) {
        return;
    }

    isLoadingNextWord.value = true;
    try {
        const currentWord = selectedItem.value?.Word ?? null;
        shuffleItems.value = (await checkStateService.checkStateWords(user.uid, currentWord)) ?? [];

        const nextItem = getNextTrainItem(shuffleItems.value, currentWord);
        const wordWithState = nextItem ? { ...nextItem, IsTranslateAsked: false } : null;

        await checkStateService.setWord(user.uid, wordWithState);
        selectedItem.value = wordWithState;
        questionKey.value += 1;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Не удалось загрузить следующее слово',
            detail: error instanceof Error ? error.message : undefined,
            life: 3000,
        });
    } finally {
        isLoadingNextWord.value = false;
    }
};

onMounted(async () => {
    if (!user?.uid) {
        isInitialLoading.value = false;
        return;
    }

    try {
        const checkInfo = await checkStateService.getCheckInfo(user.uid);
        if (checkInfo?.WordsList.length) {
            shuffleItems.value = checkInfo.WordsList;
            selectedItem.value = checkInfo.CurrentAskedWord ?? {
                ...checkInfo.WordsList[0]!,
                IsTranslateAsked: false,
            };

            if (!checkInfo.CurrentAskedWord) {
                await checkStateService.setWord(user.uid, selectedItem.value);
            }
            return;
        }

        if (!selectedLanguage) {
            toast.add({
                severity: 'warn',
                summary: 'Сначала выберите язык и паки',
                life: 3000,
            });
            await router.push('/packs');
            return;
        }

        const worldList = shuffleArray(
            languageService.getLanguageWorldPackItems(
                await languageService.getLanguagesInfo(),
                selectedLanguage.name,
                ...selectedPacks,
            ),
        );

        shuffleItems.value = worldList;
        await Promise.all([
            checkStateService.setWordList(user.uid, worldList),
            checkStateService.setStat(user.uid, {}),
        ]);

        const word = worldList[0];
        if (!word) {
            selectedItem.value = null;
            await checkStateService.setWord(user.uid, null);
            return;
        }

        const wordWithState = { ...word, IsTranslateAsked: false };
        await checkStateService.setWord(user.uid, wordWithState);
        selectedItem.value = wordWithState;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Не удалось загрузить тренировку',
            detail: error instanceof Error ? error.message : undefined,
            life: 3000,
        });
    } finally {
        isInitialLoading.value = false;
    }
});

const isFinished = computed(() => shuffleItems.value.length === 0);
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-4 md:p-6">
        <div class="max-w-4xl mx-auto">
            <ApiLoader v-if="isInitialLoading" message="Загружаем тренировку..." />
            <template v-else>
                <div class="text-center mb-6">
                    <span
                        v-if="selectedLanguage"
                        class="inline-block bg-indigo-100 text-indigo-800 rounded-full px-4 py-1 text-sm font-semibold"
                    >
                        {{ selectedLanguage.name }}
                    </span>
                    <div class="text-gray-500 text-sm mt-2">
                        Осталось слов: {{ shuffleItems.length }}
                    </div>
                </div>

                <div
                    v-if="selectedItem && !isFinished && !selectedItem?.IsTranslateAsked"
                    class="animate-fade-in"
                >
                    <TrainCard
                        :key="questionKey"
                        :selectedItem="selectedItem"
                        :isLoading="isLoadingNextWord"
                        @go-to-next-word="goToNextWord"
                    />
                </div>

                <div v-if="selectedItem?.IsTranslateAsked" class="animate-fade-in mt-6">
                    <div
                        class="bg-amber-50 rounded-xl border border-amber-200 p-4 flex items-center justify-between flex-wrap gap-3"
                    >
                        <div class="flex items-center gap-2 text-amber-700">
                            <span>⚠️</span>
                            <span>Слово "{{ selectedItem.Word }}" уже проверено</span>
                        </div>
                        <Button
                            :loading="isLoadingNextWord"
                            :disabled="isLoadingNextWord"
                            class="bg-amber-100 hover:bg-amber-200 text-amber-700 border-none px-4 py-1.5 rounded-full text-sm transition-all"
                            @click="goToNextWord"
                        >
                            Далее →
                        </Button>
                    </div>
                </div>

                <div v-else-if="isFinished" class="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div class="text-3xl font-bold text-green-600 mb-4">🎉 Отлично!</div>
                    <p class="text-gray-600 mb-6">
                        Вы успешно завершили тренировку по всем словам.
                    </p>
                    <RouterLink to="/packs">
                        <Button
                            class="bg-indigo-600 hover:bg-indigo-700 border-none text-white font-semibold px-6 py-2 rounded-full transition-all"
                        >
                            Вернуться к пакам
                        </Button>
                    </RouterLink>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}
</style>
