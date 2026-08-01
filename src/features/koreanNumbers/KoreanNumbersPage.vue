<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import type { StatusItem } from '@/utils/types.ts';
import {
    checkKoreanNumberAnswer,
    createKoreanNumberQuestion,
    KOREAN_NUMBER_SYSTEM_LABELS,
    type KoreanNumberMode,
} from './koreanNumbers.ts';

const modeOptions: Array<{
    value: KoreanNumberMode;
    label: string;
    caption: string;
}> = [
    {
        value: 'mixed',
        label: 'Обе системы',
        caption: 'Система выбирается случайно',
    },
    {
        value: 'native',
        label: 'Исконно корейская',
        caption: '하나, 둘, 셋…',
    },
    {
        value: 'sino',
        label: 'Сино-корейская',
        caption: '일, 이, 삼…',
    },
];

const selectedMode = ref<KoreanNumberMode>('mixed');
const question = ref(createKoreanNumberQuestion(selectedMode.value));
const answer = ref('');
const status = ref<StatusItem | null>(null);
const attempts = ref(0);
const correctAnswers = ref(0);
const streak = ref(0);
const showHint = ref(false);
const answerInput = ref<{ $el: HTMLInputElement } | null>(null);

const accuracy = computed(() =>
    attempts.value === 0 ? 0 : Math.round((correctAnswers.value / attempts.value) * 100),
);
const systemLabel = computed(() => KOREAN_NUMBER_SYSTEM_LABELS[question.value.system]);
const hint = computed(() =>
    question.value.system === 'native'
        ? '1 하나 · 2 둘 · 3 셋 · 4 넷 · 10 열 · 20 스물 · 30 서른'
        : '1 일 · 2 이 · 3 삼 · 4 사 · 10 십 · 20 이십 · 30 삼십',
);

const focusAnswer = async (): Promise<void> => {
    await nextTick();
    answerInput.value?.$el?.focus();
};

const resetQuestion = (): void => {
    question.value = createKoreanNumberQuestion(selectedMode.value, question.value);
    answer.value = '';
    status.value = null;
    showHint.value = false;
    void focusAnswer();
};

const selectMode = (mode: KoreanNumberMode): void => {
    selectedMode.value = mode;
    question.value = createKoreanNumberQuestion(mode);
    answer.value = '';
    status.value = null;
    attempts.value = 0;
    correctAnswers.value = 0;
    streak.value = 0;
    showHint.value = false;
    void focusAnswer();
};

const checkAnswer = (): void => {
    if (!answer.value.trim() || status.value) {
        return;
    }

    const isCorrect = checkKoreanNumberAnswer(question.value, answer.value);
    attempts.value += 1;
    status.value = isCorrect ? 'correct' : 'failure';

    if (isCorrect) {
        correctAnswers.value += 1;
        streak.value += 1;
    } else {
        streak.value = 0;
    }
};

onMounted(() => {
    void focusAnswer();
});
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 p-4 md:p-6"
    >
        <div class="mx-auto max-w-5xl">
            <div class="mb-6 flex items-center justify-between gap-4">
                <RouterLink
                    to="/"
                    class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                    ← На главную
                </RouterLink>
                <span
                    class="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700"
                >
                    Диапазон 1–99
                </span>
            </div>

            <header class="mb-8 text-center">
                <div class="mb-3 text-5xl">🇰🇷</div>
                <h1
                    class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl"
                >
                    Корейские числительные
                </h1>
                <p class="mx-auto mt-3 max-w-2xl text-gray-600">
                    Тренируйте две системы счёта и учитесь быстро переключаться между ними.
                </p>
            </header>

            <section class="mb-6 grid gap-4 md:grid-cols-2">
                <article class="rounded-2xl border border-emerald-100 bg-white/85 p-5 shadow-sm">
                    <div class="mb-2 flex items-center justify-between gap-3">
                        <h2 class="font-bold text-emerald-700">Исконно корейская</h2>
                        <span class="text-lg font-bold text-gray-800">하나 · 둘 · 셋</span>
                    </div>
                    <p class="text-sm leading-6 text-gray-600">
                        Используется для количества предметов, возраста и часов. Здесь тренируются
                        самостоятельные формы без счётных слов.
                    </p>
                </article>

                <article class="rounded-2xl border border-violet-100 bg-white/85 p-5 shadow-sm">
                    <div class="mb-2 flex items-center justify-between gap-3">
                        <h2 class="font-bold text-violet-700">Сино-корейская</h2>
                        <span class="text-lg font-bold text-gray-800">일 · 이 · 삼</span>
                    </div>
                    <p class="text-sm leading-6 text-gray-600">
                        Используется для дат, денег, минут, номеров и вычислений. Десятки строятся
                        регулярно: 이십, 삼십, 사십.
                    </p>
                </article>
            </section>

            <section class="mb-6 rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <div class="grid gap-3 md:grid-cols-3">
                    <button
                        v-for="modeOption in modeOptions"
                        :key="modeOption.value"
                        type="button"
                        :aria-pressed="selectedMode === modeOption.value"
                        :class="[
                            'rounded-xl border p-4 text-left transition',
                            selectedMode === modeOption.value
                                ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100'
                                : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/50',
                        ]"
                        @click="selectMode(modeOption.value)"
                    >
                        <span class="block font-semibold text-gray-800">{{
                            modeOption.label
                        }}</span>
                        <span class="mt-1 block text-xs text-gray-500">{{
                            modeOption.caption
                        }}</span>
                    </button>
                </div>
            </section>

            <section class="mb-6 grid grid-cols-3 gap-3">
                <div class="rounded-xl bg-white p-3 text-center shadow-sm">
                    <div class="text-xs text-gray-500">Правильно</div>
                    <div class="mt-1 text-xl font-bold text-emerald-600">{{ correctAnswers }}</div>
                </div>
                <div class="rounded-xl bg-white p-3 text-center shadow-sm">
                    <div class="text-xs text-gray-500">Точность</div>
                    <div class="mt-1 text-xl font-bold text-indigo-600">{{ accuracy }}%</div>
                </div>
                <div class="rounded-xl bg-white p-3 text-center shadow-sm">
                    <div class="text-xs text-gray-500">Серия</div>
                    <div class="mt-1 text-xl font-bold text-amber-500">{{ streak }}</div>
                </div>
            </section>

            <main class="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-xl md:p-10">
                <div class="text-center">
                    <span
                        :class="[
                            'inline-flex rounded-full px-4 py-1 text-sm font-semibold',
                            question.system === 'native'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-violet-100 text-violet-700',
                        ]"
                    >
                        {{ systemLabel }} система
                    </span>
                    <p class="mt-6 text-sm font-medium uppercase tracking-wide text-gray-400">
                        Запишите число хангылем
                    </p>
                    <div class="my-4 text-7xl font-black text-gray-800 md:text-8xl">
                        {{ question.value }}
                    </div>
                </div>

                <form class="mt-8" @submit.prevent="checkAnswer">
                    <InputText
                        ref="answerInput"
                        v-model="answer"
                        autocomplete="off"
                        :disabled="status !== null"
                        :invalid="status === 'failure'"
                        placeholder="Например: 스물하나"
                        class="w-full rounded-xl p-3 text-center text-xl"
                    />

                    <div class="mt-4 flex flex-wrap items-center justify-center gap-3">
                        <Button
                            v-if="!status"
                            type="submit"
                            :disabled="!answer.trim()"
                            class="rounded-full border-none bg-indigo-600 px-8 py-2 font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Проверить
                        </Button>
                        <Button
                            v-else
                            type="button"
                            class="rounded-full border-none bg-emerald-600 px-8 py-2 font-semibold text-white transition hover:bg-emerald-700"
                            @click="resetQuestion"
                        >
                            Следующее число →
                        </Button>
                        <button
                            v-if="!status"
                            type="button"
                            class="rounded-full px-4 py-2 text-sm font-semibold text-gray-500 transition hover:bg-gray-100"
                            @click="showHint = !showHint"
                        >
                            {{ showHint ? 'Скрыть подсказку' : 'Показать подсказку' }}
                        </button>
                    </div>
                </form>

                <div
                    v-if="showHint && !status"
                    class="mt-5 rounded-xl bg-amber-50 p-4 text-center text-sm font-medium text-amber-800"
                >
                    {{ hint }}
                </div>

                <div
                    v-if="status === 'correct'"
                    class="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-emerald-800"
                    role="status"
                >
                    <div class="font-bold">✅ Правильно!</div>
                    <div class="mt-1 text-lg">{{ question.answer }}</div>
                </div>
                <div
                    v-else-if="status === 'failure'"
                    class="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-center text-rose-800"
                    role="status"
                >
                    <div class="font-bold">Нужно повторить</div>
                    <div class="mt-1">
                        Правильный ответ:
                        <span class="text-lg font-bold">{{ question.answer }}</span>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
