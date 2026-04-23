<!-- Example of a reusable modal -->
<script setup lang="ts" generic="T = boolean">
import { useTemplateRef, watch } from 'vue';
import { CheckIcon, XIcon } from 'lucide-vue-next';
import { useDeferredModal, type IModalController } from '@chapelure/common/composables/popups/useModal';

const { controller = useDeferredModal(), withActions = true } = defineProps<{
    withActions?: boolean,
    controller?: IModalController<T>
}>();

const dialog = useTemplateRef<HTMLDialogElement>('dialog');

watch(controller.isShown, (isShown) => {
    if (isShown) {
        dialog.value?.showModal();
    } else {
        dialog.value?.close();
    }
});

defineExpose({ confirm: controller.confirm, show: controller.show, cancel: controller.cancel });
defineSlots<{
    title: any;
    default: any;
    actions: any;
}>();
</script>

<template>
    <dialog ref="dialog" class="modal">
        <div class="modal-box">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="() => controller.cancel()">
                <XIcon />
            </button>
            <h3 class="text-lg font-bold">
                <slot name="title" />
            </h3>

            <slot />

            <!-- Actions -->
            <div class="modal-action" v-if="withActions">
                <slot name="actions">
                    <button class="btn" @click="() => controller.cancel()">
                        <XIcon />
                        {{ $t("actions.cancel") }}
                    </button>
                    <button class="btn btn-primary" @click="() => controller.confirm(true as any)">
                        <CheckIcon />
                        {{ $t("actions.confirm") }}
                    </button>
                </slot>
            </div>
        </div>

        <div class="modal-backdrop">
            <button @click="() => controller.cancel()">close</button>
        </div>
    </dialog>
</template>