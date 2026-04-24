import { Deferred } from '@chapelure/common/base/deferred.ts';
import { ref, type Ref } from 'vue';

export interface IModalController<T = boolean> {
    isShown: Ref<boolean>;
    show(): Promise<T | null>;
    confirm(result: T | null): void;
    cancel(): void;
}

export function useDeferredModal<T = boolean>() : IModalController<T> {
    const isShown = ref<boolean>(false);
    let deferred: Deferred<T | null> | null = null;

    function show(): Promise<T | null> {
        // XXX : could replace by
        // let { promise, resolve, reject } = Promise.withResolvers<T | null>();
        deferred = new Deferred<T | null>();
        isShown.value = true;
        return deferred.promise;
    }

    function confirm(result: T | null = true as any) {
        isShown.value = false;
        deferred?.resolve(result ?? true as any);
        deferred = null;
    }

    function cancel() {
        isShown.value = false;
        deferred?.resolve(null);
        deferred = null;
    }

    return {
        isShown,
        show,
        confirm,
        cancel
    } as IModalController<T>;
}