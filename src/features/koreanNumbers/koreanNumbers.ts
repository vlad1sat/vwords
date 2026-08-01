import { normaliseWorld } from '@/utils/normaliseWorld.ts';

export type KoreanNumberSystem = 'native' | 'sino';
export type KoreanNumberMode = KoreanNumberSystem | 'mixed';

export interface KoreanNumberQuestion {
    value: number;
    system: KoreanNumberSystem;
    answer: string;
}

export const KOREAN_NUMBER_MIN = 1;
export const KOREAN_NUMBER_MAX = 99;

export const KOREAN_NUMBER_SYSTEM_LABELS: Record<KoreanNumberSystem, string> = {
    native: 'Исконно корейская',
    sino: 'Сино-корейская',
};

const nativeOnes = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
const nativeTens = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];
const sinoDigits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

const assertSupportedNumber = (value: number): void => {
    if (!Number.isInteger(value) || value < KOREAN_NUMBER_MIN || value > KOREAN_NUMBER_MAX) {
        throw new RangeError(
            `Поддерживаются только целые числа от ${KOREAN_NUMBER_MIN} до ${KOREAN_NUMBER_MAX}`,
        );
    }
};

export const toNativeKoreanNumber = (value: number): string => {
    assertSupportedNumber(value);

    const tens = Math.floor(value / 10);
    const ones = value % 10;

    return `${nativeTens[tens] ?? ''}${nativeOnes[ones] ?? ''}`;
};

export const toSinoKoreanNumber = (value: number): string => {
    assertSupportedNumber(value);

    const tens = Math.floor(value / 10);
    const ones = value % 10;
    const tensValue = tens === 0 ? '' : `${tens === 1 ? '' : (sinoDigits[tens] ?? '')}십`;

    return `${tensValue}${sinoDigits[ones] ?? ''}`;
};

export const toKoreanNumber = (value: number, system: KoreanNumberSystem): string =>
    system === 'native' ? toNativeKoreanNumber(value) : toSinoKoreanNumber(value);

const getRandomValue = (): number =>
    Math.floor(Math.random() * (KOREAN_NUMBER_MAX - KOREAN_NUMBER_MIN + 1)) + KOREAN_NUMBER_MIN;

export const createKoreanNumberQuestion = (
    mode: KoreanNumberMode,
    previousQuestion: KoreanNumberQuestion | null = null,
): KoreanNumberQuestion => {
    const system: KoreanNumberSystem =
        mode === 'mixed' ? (Math.random() < 0.5 ? 'native' : 'sino') : mode;
    let value = getRandomValue();

    if (previousQuestion?.system === system && previousQuestion.value === value) {
        value = value === KOREAN_NUMBER_MAX ? KOREAN_NUMBER_MIN : value + 1;
    }

    return {
        value,
        system,
        answer: toKoreanNumber(value, system),
    };
};

export const checkKoreanNumberAnswer = (question: KoreanNumberQuestion, answer: string): boolean =>
    normaliseWorld(answer) === normaliseWorld(question.answer);
