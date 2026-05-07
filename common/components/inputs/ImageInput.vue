<script setup lang="ts">
import { UploadIcon, XIcon } from 'lucide-vue-next';
import { ref } from 'vue';

defineProps<{
    accept?: string;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const preview = ref<string | null>(null);

function clearFile() {
    if (!fileInput.value)
        return;

    fileInput.value.value = '';
    preview.value = null;
}

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

function onChange() {
    if (!fileInput.value || !fileInput.value.files || fileInput.value.files.length === 0)
        return;

    const file = fileInput.value.files[0];
    if (!file)
        return;
    preview.value = URL.createObjectURL(file);
}
</script>

<template>
    <div class="flex flex-col">
        <div v-if="!preview"
            class="rounded-box border border-dashed border-base-300 h-32 flex flex-col justify-center items-center cursor-pointer transitions transition-colors"
            :class="{ 'border-primary bg-base-200': isDragging, 'hover:border-primary': !isDragging }"
            @click="triggerFileSelect" @dragover="onDragOver" @dragleave="isDragging = false" @drop="onDrop">
            <UploadIcon class="icon-xl opacity-50" />
            <span>{{ $t('inputs.image.upload') }}</span>
            <div v-if="$slots.constraints" class="label text-sm">
                <slot name="constraints" />
            </div>
        </div>
        <div v-else class="h-31 border border-base-300 rounded-box p-0.5">
            <img :src="preview" class="h-full w-full object-cover rounded-box" />
        </div>
        <div class="relative  mt-1">

            <input @change="onChange" ref="fileInput" type="file" :accept="accept ?? 'image/*'"
                class="file-input w-full" />
            <button v-if="fileInput?.value" class="btn btn-ghost btn-square absolute right-0" @click="clearFile">
                <XIcon />
            </button>
        </div>
    </div>
</template>