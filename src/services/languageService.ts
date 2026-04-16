import { collection, doc, getDocs, runTransaction } from 'firebase/firestore';
import { db } from '@/firebase/initFirebase.ts';
import { normaliseWorld } from '@/utils/normaliseWorld.ts';
import { FirebaseError } from 'firebase/app';
import type { SelectType } from '@/utils/types.ts';

export interface Item {
    Pronunciation: string;
    TranslateVariants: string[];
    Word: string;
}

export interface WordPack {
    AddTime: unknown;
    Id: number;
    Items: Item[];
}

export interface LanguageInfo {
    Id: string;
    Title: string;
    UUID: string;
    UserId: string;
    WordsPacks: WordPack[];
}

class LanguageService {
    async getLanguagesInfo(): Promise<LanguageInfo[]> {
        const languagesSnapshot = await getDocs(collection(db, 'Languages'));
        return languagesSnapshot.docs.map((doc) => doc.data() as LanguageInfo);
    }

    async saveNewWord(
        language: string,
        userId: string,
        wordPackId: number | null,
        newItem: Item,
    ): Promise<FirebaseError | null> {
        const docRef = doc(db, 'Languages', language);

        try {
            await runTransaction(db, async (transaction) => {
                const data = (await this.getLanguagesInfo()).filter(
                    (l) => l.UUID === userId && l.Title === language,
                )[0]!;
                const wordsPacks: WordPack[] = data.WordsPacks || [];
                const packIndex = wordsPacks.findIndex((pack) => pack?.Id === wordPackId);

                let updatedWordsPacks: WordPack[];
                if (packIndex === -1) {
                    const newPack: WordPack = {
                        Id: wordPackId ?? 1,
                        Items: [newItem],
                        AddTime: new Date(),
                    };
                    updatedWordsPacks = [...wordsPacks, newPack];
                } else {
                    const existingPack = wordsPacks[packIndex]!;
                    const existingItems = Array.isArray(existingPack.Items)
                        ? existingPack.Items
                        : [];

                    const updatedPack: WordPack = {
                        ...existingPack,
                        Items: [...existingItems, newItem],
                    };
                    updatedWordsPacks = [...wordsPacks];
                    updatedWordsPacks[packIndex] = updatedPack;
                }

                transaction.update(docRef, { WordsPacks: updatedWordsPacks });
            });
            return null;
        } catch (error) {
            return error as FirebaseError;
        }
    }

    getLanguages(userId: string, info: LanguageInfo[]): SelectType<string>[] {
        return info.filter((l) => l.UUID === userId).map((l) => ({ name: l.Title, code: l.Title }));
    }

    getLanguageWorldPacks(info: LanguageInfo[], language: string): WordPack[] {
        return info.find((l) => l.Title === language)?.WordsPacks ?? [];
    }

    getLanguageWorldPackItems(
        info: LanguageInfo[],
        language: string,
        ...idWorldPacks: number[]
    ): Item[] {
        return this.getLanguageWorldPacks(info, language)
            .filter((pack) => idWorldPacks.includes(pack.Id))
            .reduce<Item[]>((items, pack) => items.concat(pack.Items), []);
    }

    checkWorld(word: string, ...examples: string[]): boolean {
        for (const example of examples) {
            if (normaliseWorld(word) === normaliseWorld(example)) return true;
        }
        return false;
    }
}

export const languageService = new LanguageService();
