import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: 'languagelearningsupport-tgbot.firebaseapp.com',
    projectId: 'languagelearningsupport-tgbot',
    storageBucket: 'languagelearningsupport-tgbot.firebasestorage.app',
    messagingSenderId: '66988762510',
    appId: '1:66988762510:web:f39a9d557d6b101d22b0df',
    measurementId: 'G-K3790TJ3Q7',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
