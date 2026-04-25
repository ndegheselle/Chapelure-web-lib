<script setup lang="ts">
import type { Filter } from '@chapelure/common/base/filters';
import { ChevronRightIcon, FunnelIcon } from 'lucide-vue-next';
import { ref } from 'vue';

const numberOfAdditionalsFilters = ref(0);

const { numberDisplay = 3 } = defineProps<{
    numberDisplay?: number,
    filters: Record<string, Filter>
}>();
</script>

<template>
    <section class="flex gap-1">
        <button v-for="filter in Object.values(filters).slice(0, numberDisplay)" class="btn btn-sm flex-1">
            {{ $t(filter.label) }}
            <ChevronRightIcon />
        </button>
        <button class="btn btn-sm ms-auto">
            <FunnelIcon />
            {{ $t('actions.filter') }}
            <div v-if="numberOfAdditionalsFilters > 0" class="badge badge-sm badge-primary">{{ numberOfAdditionalsFilters }}</div>
        </button>
    </section>
</template>