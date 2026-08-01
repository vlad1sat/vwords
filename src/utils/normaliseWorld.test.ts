import { describe, expect, it } from 'vitest';
import { getWorldEditDistance, normaliseWorld } from './normaliseWorld.ts';

describe('normaliseWorld', () => {
    it.each([
        ['  HeLLo  ', 'hello'],
        ['hello world', 'helloworld'],
        ['\tПрИвЕт\nмир ', 'приветмир'],
        ['', ''],
        ['   ', ''],
    ])('нормализует %j в %j', (word, expected) => {
        expect(normaliseWorld(word)).toBe(expected);
    });
});

describe('getWorldEditDistance', () => {
    it.each([
        ['apple', 'apple', 0],
        ['apple', 'aple', 1],
        ['apple', 'apples', 1],
        ['house', 'hause', 1],
        ['world', 'wrold', 1],
        ['book', 'back', 2],
        ['', 'word', 4],
    ])('возвращает расстояние между %j и %j', (firstWord, secondWord, expected) => {
        expect(getWorldEditDistance(firstWord, secondWord)).toBe(expected);
    });

    it('учитывает нормализацию входных значений', () => {
        expect(getWorldEditDistance(' Hello World ', 'helloworld')).toBe(0);
    });

    it('возвращает одинаковое расстояние независимо от порядка аргументов', () => {
        expect(getWorldEditDistance('language', 'langauge')).toBe(
            getWorldEditDistance('langauge', 'language'),
        );
    });
});
