<script setup lang="ts">
import { type Item, languageService } from '@/services/languageService.ts';
import { ref } from 'vue';
import type { StatusItem } from '@/utils/types.ts';
import { getTrainType, TrainType } from '@/utils/generateTypeTrain.ts';

interface Props {
    selectedItem: Item;
}

interface Emits {
    (e: 'goToNextWord'): void;
}

const { selectedItem } = defineProps<Props>();
const emits = defineEmits<Emits>();

const trainType = ref(getTrainType());

const inputValue = ref('');
const status = ref<StatusItem | null>(null);

const checkAnswer = () => {
    const examples =
        trainType.value === TrainType.ForeignWorld
            ? selectedItem.TranslateVariants
            : selectedItem.Word;
    if (languageService.checkWorld(inputValue.value, ...examples)) {
        status.value = 'correct';
        return;
    }
    status.value = 'failure';
};

const goToNextWord = () => {
    status.value = null;
    inputValue.value = '';
    trainType.value = getTrainType();
    emits('goToNextWord');
};
</script>

<template>
    <div>
        Задание:
        {{
            trainType === TrainType.ForeignWorld
                ? selectedItem.Word
                : selectedItem.TranslateVariants
        }}
    </div>
    <div>Произношение: {{ selectedItem.Pronunciation }}</div>
    <InputText v-model="inputValue" />
    <Button v-if="status !== 'correct'" @click="checkAnswer">Проверить!</Button>
    <div v-if="status === 'correct'">
        Правильно!
        <div v-if="trainType === TrainType.ForeignWorld">
            Ответы:
            <template v-for="item in selectedItem.TranslateVariants" :key="item"
                >{{ item }} ,
            </template>
        </div>
        <div v-if="trainType === TrainType.NationalWorld">Ответ: {{ selectedItem.Word }}</div>
    </div>
    <div v-if="status === 'failure'">Неправильно! Попробуй еще раз!</div>
    <Button v-if="status" @click="goToNextWord">Далее</Button>
</template>

<style scoped></style>
