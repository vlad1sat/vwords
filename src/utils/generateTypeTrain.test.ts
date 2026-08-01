import { describe, expect, it, vi } from 'vitest';
import { getBackTrainValue, getTrainType, TrainType } from './generateTypeTrain.ts';

describe('getTrainType', () => {
    it.each([
        [0, TrainType.NationalWorld],
        [0.5, TrainType.NationalWorld],
        [0.500001, TrainType.ForeignWorld],
        [1, TrainType.ForeignWorld],
    ])('при Math.random() = %s возвращает %s', (randomValue, expected) => {
        vi.spyOn(Math, 'random').mockReturnValue(randomValue);

        expect(getTrainType()).toBe(expected);
    });
});

describe('getBackTrainValue', () => {
    it.each([
        [TrainType.ForeignWorld, 'TranslateCheckCount'],
        [TrainType.NationalWorld, 'WordCheckCount'],
    ] as const)('для %s возвращает %s', (trainType, expected) => {
        expect(getBackTrainValue(trainType)).toBe(expected);
    });
});
