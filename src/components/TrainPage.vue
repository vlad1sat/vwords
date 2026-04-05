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
    {{ selectedLanguage }}
    <template v-if="selectedItem">
        <TrainCard
            v-if="!isFinished"
            :selectedItem="selectedItem"
            @go-to-next-word="goToNextWord"
        />
        <template v-else>
            <div>Вы закончили проверку!</div>
            <RouterLink to="/packs">
                <Button>Вернуться к пакам</Button>
            </RouterLink>
        </template>
    </template>
</template>

<style scoped></style>
