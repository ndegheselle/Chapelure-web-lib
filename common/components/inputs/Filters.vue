<script setup lang="ts" generic="T">
import type { FilterDefinition } from '@chapelure/api/filters';
import Modal from '@chapelure/common/components/popups/Modal.vue';
import { useDeferredModal } from '@chapelure/common/composables/popups/useModal';
import { ChevronRightIcon, FunnelIcon } from 'lucide-vue-next';
import { ref } from 'vue';
import FiltersForm from './FiltersForm.vue';

const numberOfAdditionalsFilters = ref(0);
const controller = useDeferredModal();

const { numberDisplay = 3 } = defineProps<{
    numberDisplay?: number,
    filters: FilterDefinition<T>[],
}>();
</script>

<template>
    <section class="flex gap-1">
        <button v-for="filter in Object.values(filters).slice(0, numberDisplay)" class="btn btn-sm flex-1">
            {{ $t(filter.label) }}
            <ChevronRightIcon />
        </button>
        <button class="btn btn-sm ms-auto" @click="() => controller.show()">
            <FunnelIcon />
            {{ $t('actions.filter') }}
            <div v-if="numberOfAdditionalsFilters > 0" class="badge badge-sm badge-primary">{{ numberOfAdditionalsFilters }}</div>
        </button>
    </section>
    <Modal :controller="controller">
        <template #title>
            TEST
        </template>
        <FiltersForm :filters="filters" />
    </Modal>
</template>