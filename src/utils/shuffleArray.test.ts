import { describe, expect, it } from 'vitest';
import { shuffleArray } from './shuffleArray.ts';

describe('shuffleArray', () => {
    it('возвращает новый массив с теми же элементами', () => {
        const source = [4, 1, 3, 2, 2];

        const result = shuffleArray(source);

        expect(result).not.toBe(source);
        expect(result).toHaveLength(source.length);
        expect([...result].sort()).toEqual([...source].sort());
    });

    it('не изменяет исходный массив', () => {
        const source = ['one', 'two', 'three'];
        const original = [...source];

        shuffleArray(source);

        expect(source).toEqual(original);
    });

    it.each([
        [[], []],
        [[42], [42]],
    ])('корректно обрабатывает массив %j', (source, expected) => {
        expect(shuffleArray(source)).toEqual(expected);
    });
});
