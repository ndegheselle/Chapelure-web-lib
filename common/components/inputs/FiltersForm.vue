<script setup lang="ts" generic="T">
import { type FilterDefinition } from '@chapelure/api/filters';

const { filters } = defineProps<{
    filters: FilterDefinition<T>[]
}>();
</script>

<template>
    <section class="flex flex-col gap-2">
        <fieldset v-for="filter in filters" class="fieldset">
            <legend class="fieldset-legend">{{ $t(filter.label) }}</legend>
        </fieldset>
    </section>
</template>
