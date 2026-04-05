import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    type Unsubscribe,
    type User,
} from 'firebase/auth';
import { auth } from '@/firebase/initFirebase.ts';
import { FirebaseError } from 'firebase/app';

class LoginService {
    authStateChange(setUser: (user: User | null) => void): Unsubscribe {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                console.error('Not logged in');
            }
        });
    }

    async login(
        setUser: (user: User | null) => void,
        email: string,
        password: string,
    ): Promise<[User | null, FirebaseError | null]> {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            setUser(user);
            return [user, null];
        } catch (error) {
            return [null, error as FirebaseError];
        }
    }

    async logout(setUser: (user: User | null) => void): Promise<void> {
        setUser(null);
        return signOut(auth);
    }
}

export const loginService = new LoginService();
