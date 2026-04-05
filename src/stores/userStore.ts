import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type User } from 'firebase/auth';

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null);

    const setUser = (userSet: User | null) => {
        user.value = userSet;
    };

    return { user, setUser };
});
