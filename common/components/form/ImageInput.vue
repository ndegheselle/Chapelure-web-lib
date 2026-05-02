<script setup lang="ts">
import { UploadIcon } from 'lucide-vue-next';
import { ref } from 'vue';

defineProps<{
    accept?: string;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

function triggerFileSelect() {
    fileInput.value?.click();
}

function onDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging.value = true;
}

function onDrop(e: DragEvent) {
    e.preventDefault();
    isDragging.value = false;

    if (e.dataTransfer?.files && fileInput.value) {
        fileInput.value.files = e.dataTransfer.files;
        fileInput.value.dispatchEvent(new Event('change', { bubbles: true }));
    }
}
</script>

<template>
    <div class="flex flex-col">
        <div 
            class="rounded-box border border-dashed border-base-300 h-32 flex flex-col justify-center items-center cursor-pointer transitions transition-colors"
            :class="{ 'border-primary bg-base-200': isDragging, 'hover:border-primary': !isDragging }"
            @click="triggerFileSelect"
            @dragover="onDragOver"
            @dragleave="isDragging = false"
            @drop="onDrop"
        >
            <UploadIcon class="icon-xl opacity-50" />
            <span v-html="$t('inputs.image.upload')"></span>
            <div v-if="$slots.constraints" class="label text-sm">
                <slot name="constraints" />
            </div>
        </div>
        <input 
            ref="fileInput"
            type="file" 
            :accept="accept ?? 'image/*'" 
            class="file-input w-full mt-1" 
        />
    </div>
</template>