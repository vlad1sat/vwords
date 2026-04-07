import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore.ts';
import AuthPage from '@/components/AuthPage.vue';
import ListPacks from '@/components/ListPacks.vue';
import TrainPage from '@/components/TrainPage.vue';
import HomePage from '@/components/HomePage.vue';
import AddNewWord from '@/components/AddNewWord.vue';

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

router.beforeEach((to, from, next) => {
    const { user } = useUserStore();
    const isAuthenticated = !!user?.uid;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/auth');
        return;
    }

    next();
});

export default router;
