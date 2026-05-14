<script setup lang="ts">
import { useAlert } from '@chapelure/common/composables/popups/useAlert';
import { FileIcon, FolderOpenIcon, UploadIcon, XIcon } from 'lucide-vue-next';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { accept = 'image/*', maxFilesNumber = 1, maxMbSize = 2 } = defineProps<{
    accept?: string;
    maxFilesNumber?: number;
    maxMbSize?: number;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const files = ref<File[]>([]);
const alert = useAlert();

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

function matchesAccept(file: File, accept: string): boolean {
    return accept.split(',').map(s => s.trim()).some(token => {
        if (token.startsWith('.')) {
            return file.name.toLowerCase().endsWith(token.toLowerCase());
        }
        if (token.endsWith('/*')) {
            return file.type.startsWith(token.slice(0, -1));
        }
        return file.type === token;
    });
}

function onChange() {
    const fileList = fileInput.value?.files;
    if (!fileList) return;

    const maxBytes = maxMbSize * 1_048_576;
    const rejected: string[] = [];

    const valid = Array.from(fileList).filter(file => {
        if (!matchesAccept(file, accept)) {
            rejected.push(t('inputs.file.upload.unsuported', { name: file.name }));
            return false;
        }
        if (file.size > maxBytes) {
            rejected.push(t('inputs.file.upload.exceed', { name: file.name, size: formatBytes(file.size), maxSize: maxMbSize }));
            return false;
        }
        return true;
    });

    if (rejected.length) {
        alert.error(rejected.join('\n'));
    }

    if (!valid.length) return;

    let merged = files.value.concat(valid);
    if (merged.length > maxFilesNumber) {
        merged = merged.slice(merged.length - maxFilesNumber);
    }
    files.value = merged;
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
    files.value.splice(index, 1);
}
</script>

<template>
    <div class="flex flex-col">
        <div class="rounded-box border border-dashed border-base-300 h-32 flex flex-col justify-center items-center cursor-pointer transitions transition-colors"
            :class="{ 'border-primary bg-base-200': isDragging, 'hover:border-primary': !isDragging }"
            @click="triggerFileSelect" @dragover="onDragOver" @dragleave="isDragging = false" @drop="onDrop">
            <UploadIcon class="icon-lg opacity-50" />
            <b>{{ $t('inputs.file.upload.label') }}</b>
            <div v-if="$slots.constraints" class="label text-sm opacity-60">
                <slot name="constraints" />
            </div>
            <button class="btn btn-sm mt-1">
                <FolderOpenIcon />
                {{ $t('inputs.file.upload.browse') }}
            </button>
        </div>
        <input @change="onChange" ref="fileInput" type="file" :accept="accept" class="hidden"
            :multiple="maxFilesNumber > 1" />
        <ul class="list bg-base-200 rounded-box mt-1" v-if="files.length">
            <li v-for="(file, index) in files" class="list-row p-1 items-center">
                <img v-if="canPreviewAsImage(file)" :src="toLink(file)" class="size-10 rounded-box" />
                <div v-else class="size-10 flex">
                    <FileIcon class="m-auto icon-lg" />
                </div>
                <a :href="toLink(file)" target="_blank" rel="noopener noreferrer">
                    {{ file.name }}
                </a>
                <span class="text-xs uppercase font-semibold opacity-60">{{ formatBytes(file.size) }}</span>
                <button class="btn btn-sm btn-square btn-ghost" @click="removeFile(index)">
                    <XIcon />
                </button>
            </li>
        </ul>
    </div>
</template>