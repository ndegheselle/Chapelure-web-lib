<script setup lang="ts">
import { FileIcon, FolderOpenIcon, UploadIcon, XIcon } from 'lucide-vue-next';
import { ref } from 'vue';

const { accept = 'image/*', maxNumber = 1 } = defineProps<{
    accept?: string;
    maxNumber?: number
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const files = ref<File[]>([]);

const PREVIEWABLE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/avif",
]);

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
    const fileList = fileInput.value?.files;
    if (!fileList) return [];

    if (!files.value.length) {
        files.value = Array.from(fileList).slice(0, maxNumber);
    }
    else {
        let merged = files.value.concat(Array.from(fileList));
        if (merged.length > maxNumber)
            merged = merged.slice(merged.length - maxNumber, merged.length);
        files.value = merged;
    }
}

function formatBytes(bytes: number, decimals: number = 2): string {
    const d = Math.max(0, decimals);

    if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(d)} KB`;
    else if (bytes < 1_073_741_824) return `${(bytes / 1_048_576).toFixed(d)} MB`;
    return `${(bytes / 1_073_741_824).toFixed(d)} GB`;
}

function toLink(file: File) { return URL.createObjectURL(file); }

function canPreviewAsImage(file: File): boolean {
    return PREVIEWABLE_TYPES.has(file.type);
}

function removeFile(index: number) {
    if (!fileInput.value) return;

    const files = fileInput.value.files;
    if (!files) return;

    const dt = new DataTransfer();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (index !== i && file) {
            dt.items.add(file);
        }
    }

    /* Assigning data transfer object files to the 'input' variable will not write the data transfer files to it because it doesn't have the reference to the element: Instead write, */
    fileInput.value.files = dt.files;
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
             @drop="onDrop">
            <UploadIcon class="icon-lg opacity-50" />
            <b>{{ $t('inputs.file.upload.label') }}</b>
            <div v-if="$slots.constraints"
                 class="label text-sm">
                <slot name="constraints" />
            </div>
            <button class="btn btn-sm mt-1">
                <FolderOpenIcon />
                {{ $t('inputs.file.upload.browse') }}
            </button>
        </div>
        <input @change="onChange"
               ref="fileInput"
               type="file"
               :accept="accept"
               class="hidden"
               :multiple="maxNumber > 1" />
        <div>
            <div v-for="(file, index) in files">
                <img v-if="canPreviewAsImage(file)"
                     :src="toLink(file)" />
                <FileIcon v-else />
                <a :href="toLink(file)">
                    {{ file.name }}
                </a>
                {{ formatBytes(file.size) }}

                <button class="btn"
                        @click="removeFile(index)">
                    <XIcon />
                </button>
            </div>
        </div>
    </div>
</template>