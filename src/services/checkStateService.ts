import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/initFirebase.ts';
import type { Item } from '@/services/languageService.ts';

interface CheckStateInfo {
    CurrentAskedWord: Item & { IsTranslateAsked: boolean };
    Stat: {
        [key: string]: {
            TranslateCheckCount: number;
            WordCheckCount: number;
        };
    };
    WorldsList: Item[];
}

class CheckStateService {
    async getCheckInfo(): Promise<CheckStateInfo[]> {
        const checkStateSnapshot = await getDocs(collection(db, 'CheckState'));
        return checkStateSnapshot.docs.map((doc) => doc.data() as CheckStateInfo);
    }

    async setWordList(userId: string, wordList: Item[]): Promise<void> {
        const docRef = doc(db, 'CheckState', 'KeFXeUBJE1g2Ns4rI.JANKMbiv0Q2');
        await updateDoc(docRef, { WordsList: wordList });
    }
}

export const checkStateService = new CheckStateService();
