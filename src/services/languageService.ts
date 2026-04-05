import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/initFirebase.ts';
import stringSimilarity from 'string-similarity-js';
import { normaliseWorld } from '@/utils/normaliseWorld.ts';

export interface Item {
    Pronunciation: string;
    TranslateVariants: string[];
    Word: string;
}

export interface WorldPack {
    AddTime: unknown;
    Id: string;
    Items: Item[];
}

export interface LanguageInfo {
    Id: string;
    Title: string;
    UUID: string;
    UserId: string;
    WordsPacks: WorldPack[];
}

export interface Language {
    name: string;
    code: string;
}

class LanguageService {
    async getLanguagesInfo(): Promise<LanguageInfo[]> {
        const languagesSnapshot = await getDocs(collection(db, 'Languages'));
        return languagesSnapshot.docs.map((doc) => doc.data() as LanguageInfo);
    }

    getLanguages(info: LanguageInfo[]): Language[] {
        return info.map((l) => ({ name: l.Title, code: l.Title }));
    }

    getLanguageWorldPacks(info: LanguageInfo[], language: string): WorldPack[] {
        return info.find((l) => l.Title === language)?.WordsPacks ?? [];
    }

    getLanguageWorldPackItems(
        info: LanguageInfo[],
        language: string,
        ...idWorldPacks: string[]
    ): Item[] {
        return this.getLanguageWorldPacks(info, language)
            .filter((pack) => idWorldPacks.includes(pack.Id))
            .reduce<Item[]>((items, pack) => items.concat(pack.Items), []);
    }

    checkWorld(world: string, ...examples: string[]): boolean {
        for (const example of examples) {
            if (stringSimilarity(normaliseWorld(world), normaliseWorld(example)) > 0.9) return true;
        }
        return false;
    }
}

export const languageService = new LanguageService();
