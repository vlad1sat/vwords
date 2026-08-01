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
    authStateChange(setUser: (user: User | null) => void, onReady?: () => void): Unsubscribe {
        return onAuthStateChanged(
            auth,
            (user) => {
                setUser(user);
                onReady?.();
            },
            (error) => {
                console.error('Auth state error', error);
                setUser(null);
                onReady?.();
            },
        );
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
        await signOut(auth);
        setUser(null);
    }
}

export const loginService = new LoginService();
