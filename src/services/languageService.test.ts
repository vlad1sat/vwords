import { describe, expect, it } from 'vitest';
import { languageService, type LanguageInfo } from './languageService.ts';

const languagesInfo: LanguageInfo[] = [
    {
        Id: 'english-id',
        Title: 'English',
        UUID: 'user-1',
        UserId: 'user-1',
        WordsPacks: [
            {
                Id: 1,
                AddTime: null,
                Items: [
                    {
                        Word: 'apple',
                        Pronunciation: 'ˈæpəl',
                        TranslateVariants: ['яблоко'],
                    },
                ],
            },
            {
                Id: 2,
                AddTime: null,
                Items: [
                    {
                        Word: 'house',
                        Pronunciation: 'haʊs',
                        TranslateVariants: ['дом'],
                    },
                ],
            },
        ],
    },
    {
        Id: 'german-id',
        Title: 'German',
        UUID: 'user-2',
        UserId: 'user-2',
        WordsPacks: [],
    },
];

describe('languageService helpers', () => {
    it('возвращает только языки выбранного пользователя', () => {
        expect(languageService.getLanguages('user-1', languagesInfo)).toEqual([
            { name: 'English', code: 'English' },
        ]);
    });

    it('возвращает паки выбранного языка', () => {
        expect(languageService.getLanguageWorldPacks(languagesInfo, 'English')).toEqual(
            languagesInfo[0]!.WordsPacks,
        );
        expect(languageService.getLanguageWorldPacks(languagesInfo, 'Unknown')).toEqual([]);
    });

    it('объединяет слова только из выбранных паков', () => {
        expect(languageService.getLanguageWorldPackItems(languagesInfo, 'English', 2)).toEqual([
            languagesInfo[0]!.WordsPacks[1]!.Items[0],
        ]);
    });
});

describe('languageService.checkWorld', () => {
    it.each([
        ['  APP LE ', ['apple'], true],
        ['aple', ['apple'], true],
        ['apples', ['apple'], true],
        ['hause', ['house'], true],
        ['wrold', ['world'], true],
        ['langXXge', ['language'], true],
        ['aple', ['house', 'apple'], true],
        ['cut', ['cat'], false],
        ['back', ['book'], false],
        ['langXXXe', ['language'], false],
        ['', [''], false],
    ])('для %j и вариантов %j возвращает %s', (word, examples, expected) => {
        expect(languageService.checkWorld(word, ...examples)).toBe(expected);
    });
});
