<script setup lang="ts" generic="T">
import type { FilterDefinition, FilterGroup } from '@chapelure/api/filters';
import Modal from '@chapelure/common/components/popups/Modal.vue';
import { useDeferredModal } from '@chapelure/common/composables/popups/useModal';
import { ChevronRightIcon, FunnelIcon } from 'lucide-vue-next';
import { computed } from 'vue';
import FiltersForm from './FiltersForm.vue';

const controller = useDeferredModal();

const { numberDisplay = 3 } = defineProps<{
    numberDisplay?: number,
    filters: FilterDefinition<T>[],
}>();

const group = defineModel<FilterGroup>({ required: true });

const numberOfActiveFilters = computed(() => group.value.filters.length);
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
            <div v-if="numberOfActiveFilters > 0" class="badge badge-sm badge-primary">{{ numberOfActiveFilters }}</div>
        </button>
    </section>
    <Modal :controller="controller">
        <template #title>
            {{  $t('actions.filter') }}
        </template>
        <FiltersForm :filters="filters" v-model="group" />
    </Modal>
</template>