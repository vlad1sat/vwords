<script setup lang="ts">
import { type Item, languageService } from '@/services/languageService.ts';
import { nextTick, ref, watch } from 'vue';
import type { StatusItem } from '@/utils/types.ts';
import { getTrainType, TrainType } from '@/utils/generateTypeTrain.ts';

interface Props {
    selectedItem: Item;
}

interface Emits {
    (e: 'goToNextWord'): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const trainType = ref(getTrainType());

const inputValue = ref('');
const inputRef = ref<HTMLInputElement | null>(null);
const isPronunciationRevealed = ref(false);
const status = ref<StatusItem | null>(null);
const showCorrectAnswer = ref(false);

const checkAnswer = () => {
    const examples =
        trainType.value === TrainType.ForeignWorld
            ? props.selectedItem.TranslateVariants
            : [props.selectedItem.Word];

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

watch(
    () => props.selectedItem,
    async () => {
        await nextTick();
        inputRef.value?.$el?.focus();
        isPronunciationRevealed.value = false;
        showCorrectAnswer.value = false;
    },
);

const revealPronunciation = () => {
    isPronunciationRevealed.value = true;
};
</script>

<template>
    <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
        <!-- Задание -->
        <div class="mb-6">
            <div class="text-sm text-gray-500 uppercase tracking-wide mb-1">Задание</div>
            <div class="text-2xl md:text-3xl font-bold text-gray-800 break-words">
                {{
                    trainType === TrainType.ForeignWorld
                        ? selectedItem.Word
                        : selectedItem.TranslateVariants.join(' / ')
                }}
            </div>
        </div>

        <!-- Произношение -->
        <div class="mb-6">
            <div
                :class="[
                    'text-gray-600 italic transition-all duration-200 cursor-pointer select-none inline-block',
                    !isPronunciationRevealed && 'blur-sm',
                ]"
                @click="revealPronunciation"
            >
                📢 Произношение: {{ selectedItem.Pronunciation || '—' }}
            </div>
            <p v-if="!isPronunciationRevealed" class="text-xs text-gray-400 mt-1">
                👆 Нажмите, чтобы показать произношение
            </p>
        </div>

        <!-- Поле ввода -->
        <div class="mb-6">
            <InputText
                ref="inputRef"
                v-model="inputValue"
                placeholder="Введите ответ..."
                class="w-full p-3 text-lg rounded-xl border-gray-300 focus:border-indigo-400 focus:ring focus:ring-indigo-200"
                :invalid="status === 'failure'"
                autofocus
            />
        </div>

        <!-- Кнопка проверки -->
        <div v-if="status !== 'correct'" class="flex justify-center">
            <Button
                class="bg-indigo-600 hover:bg-indigo-700 border-none text-white font-semibold px-8 py-2 rounded-full transition-all"
                @click="checkAnswer"
            >
                Проверить
            </Button>
        </div>

        <!-- Блок результата (единый стиль) -->
        <div v-if="status" class="mt-6">
            <!-- Успех -->
            <div
                v-if="status === 'correct'"
                class="p-4 bg-green-50 rounded-xl border border-green-200"
            >
                <div class="text-green-800 font-medium">✅ Правильно!</div>
            </div>

            <!-- Ошибка -->
            <div v-else class="p-4 bg-red-50 rounded-xl border border-red-200">
                <div class="text-red-700 font-medium mb-2">❌ Неправильно!</div>
                <button
                    class="text-sm font-medium transition-colors"
                    @click="showCorrectAnswer = !showCorrectAnswer"
                >
                    {{ showCorrectAnswer ? '🙈 Скрыть ответ' : '👁️ Показать правильный ответ' }}
                </button>
                <div v-if="showCorrectAnswer" class="mt-3 pt-2 text-gray-700">
                    <span class="text-sm text-gray-500">Правильный ответ:</span>
                    <span class="font-medium ml-2">
                        {{
                            trainType === TrainType.ForeignWorld
                                ? selectedItem.TranslateVariants.join(' / ')
                                : selectedItem.Word
                        }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Кнопка далее -->
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
