<script setup lang="ts">
import { EnumAlertType, useAlert } from '@chapelure/common/composables/popups/useAlert';
import { BrushCleaningIcon, CircleAlertIcon, CircleCheckIcon, TriangleAlertIcon, XIcon } from 'lucide-vue-next';
import { useTemplateRef, watchEffect } from 'vue';

const { alerts, close } = useAlert();

const dialogRef = useTemplateRef('dialogRef');

watchEffect(() => {
    if (dialogRef.value && !dialogRef.value.open) {
        dialogRef.value.show();
    }
});
</script>

<template>
    <dialog ref="dialogRef" class="toast-dialog z-10"> 
        <div class="toast">
            <div role="alert" class="alert" v-for="alert in alerts" :key="alert.id" :class="{
                'alert-warning alert-dash': alert.type === EnumAlertType.Debug,
                'alert-warning': alert.type === EnumAlertType.Warning,
                'alert-error': alert.type === EnumAlertType.Error,
                'alert-success': alert.type === EnumAlertType.Success
            }">
                <CircleAlertIcon v-if="alert.type === EnumAlertType.Info" />
                <TriangleAlertIcon
                    v-else-if="alert.type === EnumAlertType.Warning || alert.type === EnumAlertType.Error" />
                <CircleCheckIcon v-else-if="alert.type === EnumAlertType.Success" />
                <BrushCleaningIcon v-else-if="alert.type === EnumAlertType.Debug" />
                <span>{{ alert.message }}</span>
                <button @click="close(alert.id)" class="btn btn-sm btn-ghost btn-circle" aria-label="close">
                    <XIcon class="icon-sm" />
                </button>
            </div>
        </div>
    </dialog>
</template>