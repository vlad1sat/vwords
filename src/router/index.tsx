import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore.ts';
import AuthPage from '@/components/AuthPage.vue';
import ListPacks from '@/components/ListPacks.vue';
import TrainPage from '@/components/TrainPage.vue';
import HomePage from '@/components/HomePage.vue';
import AddNewWord from '@/components/AddNewWord.vue';
import { loginService } from '@/services/loginService.ts';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: <HomePage />,
        },
        {
            path: '/auth',
            name: 'auth',
            component: <AuthPage />,
        },
        {
            path: '/add',
            name: 'add',
            component: <AddNewWord />,
            meta: { requiresAuth: true },
        },
        {
            path: '/packs',
            name: 'packs',
            component: <ListPacks />,
            meta: { requiresAuth: true },
        },
        {
            path: '/train',
            name: 'train',
            component: <TrainPage />,
            meta: { requiresAuth: true },
        },
        {
            path: '/korean-numbers',
            name: 'korean-numbers',
            component: () => import('@/features/koreanNumbers/KoreanNumbersPage.vue'),
            meta: { requiresAuth: true },
        },
        /*{
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue'),
        },*/
    ],
});

router.beforeEach(async (to) => {
    const userStore = useUserStore();

    try {
        const user = await loginService.getAuthenticatedUser();
        userStore.setUser(user);

        if (to.meta.requiresAuth && !user) {
            return {
                name: 'auth',
                query: { redirect: to.fullPath },
            };
        }

        if (to.name === 'auth' && user) {
            return { name: 'home' };
        }
    } catch (error) {
        console.error('Failed to restore auth state', error);
        userStore.setUser(null);

        if (to.meta.requiresAuth) {
            return {
                name: 'auth',
                query: { redirect: to.fullPath },
            };
        }
    }

    return true;
});

export default router;
