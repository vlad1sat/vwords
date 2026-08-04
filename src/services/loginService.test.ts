import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from 'firebase/auth';

const firebaseAuthMocks = vi.hoisted(() => ({
    auth: {
        currentUser: null as User | null,
        authStateReady: vi.fn<() => Promise<void>>(),
    },
    browserLocalPersistence: { type: 'LOCAL' },
    onAuthStateChanged: vi.fn(() => vi.fn()),
    setPersistence: vi.fn<() => Promise<void>>(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn<() => Promise<void>>(),
}));

vi.mock('@/firebase/initFirebase.ts', () => ({
    auth: firebaseAuthMocks.auth,
}));

vi.mock('firebase/auth', () => ({
    browserLocalPersistence: firebaseAuthMocks.browserLocalPersistence,
    onAuthStateChanged: firebaseAuthMocks.onAuthStateChanged,
    setPersistence: firebaseAuthMocks.setPersistence,
    signInWithEmailAndPassword: firebaseAuthMocks.signInWithEmailAndPassword,
    signOut: firebaseAuthMocks.signOut,
}));

import { loginService } from './loginService.ts';

const user = { uid: 'user-1' } as User;

describe('loginService', () => {
    beforeEach(() => {
        firebaseAuthMocks.auth.currentUser = null;
        firebaseAuthMocks.auth.authStateReady.mockReset();
        firebaseAuthMocks.auth.authStateReady.mockResolvedValue();
        firebaseAuthMocks.setPersistence.mockReset();
        firebaseAuthMocks.setPersistence.mockResolvedValue();
        firebaseAuthMocks.signInWithEmailAndPassword.mockReset();
        firebaseAuthMocks.signOut.mockReset();
        firebaseAuthMocks.signOut.mockResolvedValue();
    });

    it('дожидается восстановления Firebase Auth перед возвратом пользователя', async () => {
        firebaseAuthMocks.auth.currentUser = user;

        await expect(loginService.getAuthenticatedUser()).resolves.toBe(user);
        expect(firebaseAuthMocks.auth.authStateReady).toHaveBeenCalledOnce();
    });

    it('возвращает null после готовности Auth, если сохранённой сессии нет', async () => {
        await expect(loginService.getAuthenticatedUser()).resolves.toBeNull();
    });

    it('включает локальное хранение сессии до входа', async () => {
        const calls: string[] = [];
        firebaseAuthMocks.setPersistence.mockImplementation(async () => {
            calls.push('persistence');
        });
        firebaseAuthMocks.signInWithEmailAndPassword.mockImplementation(async () => {
            calls.push('sign-in');
            return { user };
        });
        const setUser = vi.fn();

        await expect(loginService.login(setUser, 'user@example.com', 'password')).resolves.toEqual([
            user,
            null,
        ]);
        expect(calls).toEqual(['persistence', 'sign-in']);
        expect(firebaseAuthMocks.setPersistence).toHaveBeenCalledWith(
            firebaseAuthMocks.auth,
            firebaseAuthMocks.browserLocalPersistence,
        );
        expect(setUser).toHaveBeenCalledWith(user);
    });

    it('возвращает ошибку входа и не изменяет пользователя', async () => {
        const error = new Error('Invalid credentials');
        firebaseAuthMocks.signInWithEmailAndPassword.mockRejectedValue(error);
        const setUser = vi.fn();

        await expect(loginService.login(setUser, 'user@example.com', 'wrong')).resolves.toEqual([
            null,
            error,
        ]);
        expect(setUser).not.toHaveBeenCalled();
    });

    it('выходит из Firebase до очистки пользователя', async () => {
        const calls: string[] = [];
        firebaseAuthMocks.signOut.mockImplementation(async () => {
            calls.push('sign-out');
        });
        const setUser = vi.fn(() => {
            calls.push('clear-user');
        });

        await loginService.logout(setUser);

        expect(calls).toEqual(['sign-out', 'clear-user']);
        expect(setUser).toHaveBeenCalledWith(null);
    });
});
