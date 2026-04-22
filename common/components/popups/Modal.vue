<!-- Example of a reusable modal -->
<script setup lang="ts" generic="T = boolean">
import { useDeferredModal } from '@chapelure/common/composables/popups/modal';
import { useTemplateRef } from 'vue';
import { CheckIcon, XIcon } from 'lucide-vue-next';

const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const modal = useDeferredModal<T>(dialog);

const { withActions = true } = defineProps<{
    withActions?: boolean
}>();

const emit = defineEmits<{
    cancel: []
}>();

function handleCancel() {
    modal.cancel();
    emit('cancel');
}

defineExpose({ confirm: modal.confirm, show: modal.show, cancel: modal.cancel });
defineSlots<{
    title: any;
    body: any;
    actions: any;
}>();
</script>

<template>
    <dialog ref="dialog" class="modal">
        <div class="modal-box">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleCancel">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <h3 class="text-lg font-bold">
                <slot name="title" />
            </h3>

            <slot name="body" />

            <!-- Actions -->
            <div class="modal-action" v-if="withActions">
                <slot name="actions">
                    <button class="btn" @click="handleCancel">
                        <XIcon />
                        {{ $t("actions.cancel") }}
                    </button>
                    <button class="btn btn-primary" @click="modal.confirm()">
                        <CheckIcon />
                        {{ $t("actions.confirm") }}
                    </button>
                </slot>
            </div>
        </div>

        <div class="modal-backdrop">
            <button @click="handleCancel">close</button>
        </div>
    </dialog>
</template>