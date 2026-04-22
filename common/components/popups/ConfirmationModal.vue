<script setup lang="ts">
import { useConfirmation } from '@chapelure/common/composables/popups/confirmation.ts';
import { onMounted, useTemplateRef } from 'vue';
import Modal from '@chapelure/common/components/popups/Modal.vue';

const confirmation = useConfirmation();
const modal = useTemplateRef<{ show(): any; confirm(): void; cancel(): void }>('modal');

onMounted(() => {
    if (modal.value) {
        confirmation.registerModal(modal.value);
    }
});
</script>
<template>
    <Modal ref="modal" @cancel="confirmation.cancel()">
        <template #title>
            <component :is="confirmation.icon.value" v-if="confirmation.icon.value" class="mr-2 icon-lg inline" />
            {{ confirmation.title }}
        </template>

        <template #body>
            <p v-html="confirmation.message.value"></p>
        </template>
    </Modal>
</template>
