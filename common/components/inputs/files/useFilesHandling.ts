import { useAlert } from '@chapelure/common/composables/popups/useAlert';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export function useOneFile() {
    const files = ref<File[]>([]);

    function update(newFiles: File[]) {
        files.value = newFiles.slice(0, 1);
    }

    return {
        files,
        update
    }
}

export function useMultipleFiles(maxFilesNumber: number = 10) {
    const { t } = useI18n();
    const alert = useAlert();

    const files = ref<File[]>([]);

    function update(newFiles: File[]) {
        if (files.value.length + newFiles.length > maxFilesNumber) {
            alert.error(t('inputs.file.upload.exceedNumber', { number: maxFilesNumber }));
            newFiles = newFiles.slice(0, maxFilesNumber - files.value.length);
        }
        
        if (newFiles.length)
            files.value = files.value.concat(newFiles);
    }

    return {
        files,
        update
    }
}