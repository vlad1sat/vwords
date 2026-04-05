<script setup lang="ts">
import { useLanguageStore } from '@/stores/languageStore.ts';
import { computed, onMounted, ref } from 'vue';
import { type Item, languageService } from '@/services/languageService.ts';
import { shuffleArray } from '@/utils/shuffleArray.ts';
import TrainCard from '@/components/TrainCard.vue';

const languageStore = useLanguageStore();

const { selectedLanguage, selectedPacks } = languageStore;

const shuffleItems = ref<Item[]>([]);
const selectedItem = ref<Item | null>(null);
const selectedIndex = ref<number>(0);

const goToNextWord = () => {
    selectedIndex.value += 1;
    selectedItem.value = shuffleItems.value[selectedIndex.value] ?? null;
};

const isFinished = computed(() => selectedIndex.value === shuffleItems.value.length - 1);

onMounted(async () => {
    shuffleItems.value = shuffleArray(
        languageService.getLanguageWorldPackItems(
            await languageService.getLanguagesInfo(),
            selectedLanguage!.name,
            ...selectedPacks,
        ),
    );
    selectedItem.value = shuffleItems.value[0] ?? null;
});
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-4 md:p-6">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-6">
                <span
                    class="inline-block bg-indigo-100 text-indigo-800 rounded-full px-4 py-1 text-sm font-semibold"
                >
                    {{ selectedLanguage?.name }}
                </span>
                <div class="text-gray-500 text-sm mt-2">
                    Прогресс: {{ selectedIndex + 1 }} / {{ shuffleItems.length }}
                </div>
            </div>

            <div v-if="selectedItem && !isFinished" class="animate-fade-in">
                <TrainCard :selectedItem="selectedItem" @go-to-next-word="goToNextWord" />
            </div>

            <div v-else-if="isFinished" class="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div class="text-3xl font-bold text-green-600 mb-4">🎉 Отлично!</div>
                <p class="text-gray-600 mb-6">Вы успешно завершили тренировку по всем словам.</p>
                <RouterLink to="/packs">
                    <Button
                        class="bg-indigo-600 hover:bg-indigo-700 border-none text-white font-semibold px-6 py-2 rounded-full transition-all"
                    >
                        Вернуться к пакам
                    </Button>
                </RouterLink>
            </div>
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
