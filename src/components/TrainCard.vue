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
    <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
        <div class="mb-6">
            <div class="text-sm text-gray-500 uppercase tracking-wide mb-1">Задание</div>
            <div class="text-2xl md:text-3xl font-bold text-gray-800 break-words">
                {{
                    trainType === TrainType.ForeignWorld
                        ? selectedItem.Word
                        : selectedItem.TranslateVariants.join(', ')
                }}
            </div>
        </div>

        <div class="mb-6 text-gray-600 italic">
            📢 Произношение: {{ selectedItem.Pronunciation || '—' }}
        </div>

        <div class="mb-6">
            <InputText
                v-model="inputValue"
                placeholder="Введите ответ..."
                class="w-full p-3 text-lg rounded-xl border-gray-300 focus:border-indigo-400 focus:ring focus:ring-indigo-200"
            />
        </div>

        <div v-if="status !== 'correct'" class="flex justify-center">
            <Button
                class="bg-indigo-600 hover:bg-indigo-700 border-none text-white font-semibold px-8 py-2 rounded-full transition-all"
                @click="checkAnswer"
            >
                Проверить
            </Button>
        </div>

        <div
            v-if="status === 'correct'"
            class="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"
        >
            <div class="font-semibold text-green-800 mb-2">✅ Правильно!</div>
            <div v-if="trainType === TrainType.ForeignWorld" class="text-gray-700">
                Ответы:
                <span class="font-medium">{{ selectedItem.TranslateVariants.join('/ ') }}</span>
            </div>
            <div v-if="trainType === TrainType.NationalWorld" class="text-gray-700">
                Ответ: <span class="font-medium">{{ selectedItem.Word }}</span>
            </div>
        </div>

        <div
            v-if="status === 'failure'"
            class="mt-6 p-4 bg-red-50 rounded-xl border border-red-200 text-red-700 font-medium"
        >
            ❌ Неправильно! Попробуйте ещё раз.
        </div>

        <div v-if="status" class="mt-6 flex justify-center">
            <Button
                class="bg-emerald-600 hover:bg-emerald-700 border-none text-white font-semibold px-8 py-2 rounded-full transition-all"
                @click="goToNextWord"
            >
                Далее →
            </Button>
        </div>
    </div>
</template>
<style scoped></style>
