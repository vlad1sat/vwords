import { describe, expect, it, vi } from 'vitest';
import { getNextTrainItem } from './getNextTrainItem.ts';

const items = [{ Word: 'apple' }, { Word: 'house' }, { Word: 'world' }];

describe('getNextTrainItem', () => {
    it('возвращает null для пустого списка', () => {
        expect(getNextTrainItem([], 'apple')).toBeNull();
    });

    it('возвращает единственное слово, даже если оно было текущим', () => {
        expect(getNextTrainItem([items[0]!], 'apple')).toBe(items[0]);
    });

    it.each([0, 0.25, 0.5, 0.999999])(
        'не возвращает текущее слово при Math.random() = %s',
        (randomValue) => {
            vi.spyOn(Math, 'random').mockReturnValue(randomValue);

            expect(getNextTrainItem(items, 'apple')?.Word).not.toBe('apple');
        },
    );

    it('выбирает из полного списка, если текущего слова в нём нет', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        expect(getNextTrainItem(items, 'unknown')).toBe(items[0]);
    });

    it('не изменяет исходный список', () => {
        const original = [...items];

        getNextTrainItem(items, 'apple');

        expect(items).toEqual(original);
    });
});
