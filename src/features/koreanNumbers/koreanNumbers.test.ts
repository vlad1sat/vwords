import { describe, expect, it, vi } from 'vitest';
import {
    checkKoreanNumberAnswer,
    createKoreanNumberQuestion,
    KOREAN_NUMBER_MAX,
    KOREAN_NUMBER_MIN,
    toKoreanNumber,
    toNativeKoreanNumber,
    toSinoKoreanNumber,
    type KoreanNumberQuestion,
} from './koreanNumbers.ts';

describe('toNativeKoreanNumber', () => {
    it.each([
        [1, '하나'],
        [2, '둘'],
        [4, '넷'],
        [9, '아홉'],
        [10, '열'],
        [11, '열하나'],
        [20, '스물'],
        [21, '스물하나'],
        [30, '서른'],
        [44, '마흔넷'],
        [55, '쉰다섯'],
        [66, '예순여섯'],
        [77, '일흔일곱'],
        [88, '여든여덟'],
        [99, '아흔아홉'],
    ])('преобразует %i в %s', (value, expected) => {
        expect(toNativeKoreanNumber(value)).toBe(expected);
    });
});

describe('toSinoKoreanNumber', () => {
    it.each([
        [1, '일'],
        [2, '이'],
        [9, '구'],
        [10, '십'],
        [11, '십일'],
        [19, '십구'],
        [20, '이십'],
        [21, '이십일'],
        [44, '사십사'],
        [99, '구십구'],
    ])('преобразует %i в %s', (value, expected) => {
        expect(toSinoKoreanNumber(value)).toBe(expected);
    });
});

describe('toKoreanNumber', () => {
    it('выбирает указанную систему', () => {
        expect(toKoreanNumber(12, 'native')).toBe('열둘');
        expect(toKoreanNumber(12, 'sino')).toBe('십이');
    });

    it.each([0, 100, 1.5, Number.NaN])('отклоняет неподдерживаемое значение %s', (value) => {
        expect(() => toNativeKoreanNumber(value)).toThrow(RangeError);
        expect(() => toSinoKoreanNumber(value)).toThrow(RangeError);
    });

    it('создаёт непустое представление для всего поддерживаемого диапазона', () => {
        for (let value = KOREAN_NUMBER_MIN; value <= KOREAN_NUMBER_MAX; value += 1) {
            expect(toNativeKoreanNumber(value)).not.toBe('');
            expect(toSinoKoreanNumber(value)).not.toBe('');
        }
    });
});

describe('createKoreanNumberQuestion', () => {
    it.each([
        ['native', 'native'],
        ['sino', 'sino'],
    ] as const)('создаёт вопрос для режима %s', (mode, expectedSystem) => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        expect(createKoreanNumberQuestion(mode)).toEqual({
            value: 1,
            system: expectedSystem,
            answer: expectedSystem === 'native' ? '하나' : '일',
        });
    });

    it.each([
        [0, 'native'],
        [0.75, 'sino'],
    ] as const)('в смешанном режиме выбирает систему по случайному значению', (random, system) => {
        vi.spyOn(Math, 'random').mockReturnValueOnce(random).mockReturnValueOnce(0);

        expect(createKoreanNumberQuestion('mixed').system).toBe(system);
    });

    it('не повторяет подряд тот же вопрос', () => {
        const previous: KoreanNumberQuestion = {
            value: 1,
            system: 'native',
            answer: '하나',
        };
        vi.spyOn(Math, 'random').mockReturnValue(0);

        expect(createKoreanNumberQuestion('native', previous)).toEqual({
            value: 2,
            system: 'native',
            answer: '둘',
        });
    });
});

describe('checkKoreanNumberAnswer', () => {
    const question: KoreanNumberQuestion = {
        value: 21,
        system: 'native',
        answer: '스물하나',
    };

    it('принимает правильный ответ с лишними пробелами', () => {
        expect(checkKoreanNumberAnswer(question, '  스물 하나 ')).toBe(true);
    });

    it('не принимает другое числительное', () => {
        expect(checkKoreanNumberAnswer(question, '스물둘')).toBe(false);
    });
});
