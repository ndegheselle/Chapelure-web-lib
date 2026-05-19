<script setup lang="ts">
import { useAlert } from '@chapelure/common/composables/popups/useAlert';
import { FileIcon, XIcon } from 'lucide-vue-next';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { maxFilesNumber = 1 } = defineProps<{
    maxFilesNumber?: number;
}>();

const files = defineModel<File[]>({ default: [] });
watch(files, (newFiles) => {
    // Selection of one file allow replacement
    if (maxFilesNumber == 1)
        files.value = newFiles.slice(0, 1);
    else if (newFiles.length > maxFilesNumber) {
        alert.error(t('inputs.file.upload.exceedNumber', { number: maxFilesNumber }));
        files.value = newFiles.slice(0, maxFilesNumber);
    }
});

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
    <ul class="list bg-base-200 shadow rounded-box mt-1" v-if="files.length">
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
</template>