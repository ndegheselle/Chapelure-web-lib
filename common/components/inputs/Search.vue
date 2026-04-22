<script setup lang="ts">
import { debounce } from '@chapelure/common/utils/debounce';
import { SearchIcon, XIcon } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
    modelValue?: string;
    delay?: number;
}>(), {
    delay: 300,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'search', value: string): void;
}>();

const internalValue = ref(props.modelValue ?? '');

watch(() => props.modelValue, (val) => {
    internalValue.value = val ?? '';
});

const model = computed({
    get: () => internalValue.value,
    set: (value) => {
        internalValue.value = value;
        emit('update:modelValue', value);
    },
});

const emitSearch = props.delay
    ? debounce((value: string) => emit('search', value), props.delay)
    : (value: string) => emit('search', value);

function onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    emitSearch(value);
}

function clear() {
    model.value = '';
    emitSearch('');
}
</script>

<template>
    <label class="input w-full p-0 ps-2 pe-0.5">
        <SearchIcon class="opacity-50" />
        <input type="search" :placeholder="$t('actions.search')" v-model="model" @input="onInput" />
        <button v-if="model" class="btn btn-sm btn-ghost btn-square" @click="clear">
            <XIcon />
        </button>
    </label>
</template>
