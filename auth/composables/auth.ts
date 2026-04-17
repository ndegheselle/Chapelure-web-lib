import { users } from '@chapelure/auth/data/users';
import { NotAuthentifiedError } from '@chapelure/common/utils/dev';
import type { BaseSystemFields } from '@common/types.g';
import { routesNames } from '@features/users/routes';
import { computed, readonly, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const current = ref<BaseSystemFields | null>(null);

export function useAuth<TUser extends BaseSystemFields>() {
    const router = useRouter();
    const isLoggedIn = computed(() => current.value !== null);

    async function update(data: Partial<TUser>) {
        if (!current.value) return;
        const updated = await users.update(current.value.id, data);
        current.value = updated;
    }

    async function register(email: string, password: string, passwordConfirm: string) {
        current.value = await users.register(email, password, passwordConfirm);
    }

    async function login(email: string, password: string) {
        current.value = await users.login(email, password);
    }

    async function logout() {
        await users.logout();
        current.value = null;
        router.push({ name: routesNames.login });
    }

    async function refresh() {
        try {
            current.value = await users.refresh();
        } catch {
            current.value = null;
        }
        return isLoggedIn.value;
    }

    function currentId(): string {
        if (!current.value) throw new NotAuthentifiedError();
        return current.value.id;
    }

    return {
        current: readonly(current) as Readonly<Ref<TUser | null>>,
        isLoggedIn,
        login,
        register,
        logout,
        refresh,
        update,
        currentId,
    };
}