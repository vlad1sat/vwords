import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/initFirebase.ts';
import type { Item, ItemWithState } from '@/services/languageService.ts';

export interface CheckStateInfo {
    CurrentAskedWord: ItemWithState;
    Stat: {
        [key: string]: {
            TranslateCheckCount: number;
            WordCheckCount: number;
        };
    };
    WordsList: Item[];
}

class CheckStateService {
    async getCheckInfo(userId: string): Promise<CheckStateInfo | null> {
        const checkStateSnapshot = await getDoc(
            doc(db, 'CheckState', userId), // 'KeFXeUBJE1g2Ns4rIJANKMbiV0Q2'),
        );
        return (checkStateSnapshot.data() as CheckStateInfo) ?? null;
    }

    async updateStateCurrentAskedWord(userId: string, state: boolean): Promise<void> {
        const checkInfo = await this.getCheckInfo(userId);
        if (!checkInfo) {
            return;
        }

        const docRef = doc(db, 'CheckState', userId); // 'KeFXeUBJE1g2Ns4rIJANKMbiV0Q2'); // TODO userId
        await updateDoc(docRef, {
            CurrentAskedWord: { ...checkInfo.CurrentAskedWord, IsTranslateAsked: state },
        });
    }

    async setWordList(userId: string, wordList: Item[]): Promise<void> {
        const docRef = doc(db, 'CheckState', userId); // 'KeFXeUBJE1g2Ns4rIJANKMbiV0Q2'); // TODO userId
        await updateDoc(docRef, { WordsList: wordList });
    }

    async setStat(userId: string, stat: CheckStateInfo['Stat']): Promise<void> {
        const docRef = doc(db, 'CheckState', userId); // 'KeFXeUBJE1g2Ns4rIJANKMbiV0Q2'); // TODO userId
        await updateDoc(docRef, { Stat: stat });
    }

    async setWord(userId: string, word: CheckStateInfo['CurrentAskedWord'] | null): Promise<void> {
        const docRef = doc(db, 'CheckState', userId); // 'KeFXeUBJE1g2Ns4rIJANKMbiV0Q2'); // TODO userId
        await updateDoc(docRef, { CurrentAskedWord: word });
    }

    async checkStateWords(userId: string, word: string | null): Promise<Item[] | null> {
        const docRef = doc(db, 'CheckState', userId); // 'KeFXeUBJE1g2Ns4rIJANKMbiV0Q2'); // TODO userId
        const checkInfo = await this.getCheckInfo(userId);
        if (!checkInfo || !word) {
            return null;
        }

        const stat = checkInfo.Stat;
        let wordsList = checkInfo.WordsList;

        const state = stat[word];
        if (!(state && state.WordCheckCount >= 3 && state.TranslateCheckCount >= 3)) {
            return wordsList;
        }

        delete stat[word];
        wordsList = wordsList.filter((item) => item.Word !== word);

        await updateDoc(docRef, { Stat: stat, WordsList: wordsList });

        return wordsList;
    }

    async setStatisticWorld(
        userId: string,
        world: string,
        typeOperation: keyof CheckStateInfo['Stat'][0],
        isUp: boolean,
    ): Promise<void> {
        const docRef = doc(db, 'CheckState', userId); // 'KeFXeUBJE1g2Ns4rIJANKMbiV0Q2'); // TODO userId
        const checkInfo = await this.getCheckInfo(userId);
        if (!checkInfo) {
            return;
        }

        const stat = checkInfo.Stat;

        const state = stat[world] ?? {
            TranslateCheckCount: 0,
            WordCheckCount: 0,
        };

        state[typeOperation] = isUp ? ++state[typeOperation] : --state[typeOperation];
        if (state[typeOperation] < 0) {
            state[typeOperation] = 0;
        }

        stat[world] = state;

        await updateDoc(docRef, { Stat: stat });
    }
}

export const checkStateService = new CheckStateService();
