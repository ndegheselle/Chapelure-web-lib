import { ref, shallowRef, type Component } from 'vue';

type ModalRef = { show(): Promise<boolean | null>; confirm(): void; cancel(): void };

const title = ref('');
const message = ref('');
const icon = shallowRef<Component | null>(null);

let modalRef: ModalRef | null = null;

export function useConfirmation() {

    function registerModal(modal: ModalRef) {
        modalRef = modal;
    }

    function show(t: string, m: string, i?: Component): Promise<boolean | null> {
        title.value = t;
        message.value = m;
        icon.value = i ?? null;
        return modalRef!.show();
    }

    function confirm() {
        modalRef?.confirm();
    }

    function cancel() {
        modalRef?.cancel();
    }

    return {
        registerModal,
        title,
        message,
        icon,
        show,
        confirm,
        cancel,
    };
}
