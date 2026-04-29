<script setup lang="ts">
import type { Filter } from '@chapelure/common/base/filters';
import { FilterType } from '@chapelure/common/base/filters';
const { filters } = defineProps<{
    filters: Record<string, Filter>
}>();
</script>

<template>
    <section class="flex flex-col gap-2">
        <fieldset v-for="filter in Object.values(filters)" class="fieldset">
            <legend class="fieldset-legend">{{ $t(filter.label) }}</legend>

            <!-- Number: min/max range inputs -->
            <template v-if="filter.type === FilterType.Number">
                <div class="flex gap-2">
                    <input
                        type="number"
                        class="input input-sm w-full"
                        :placeholder="$t('filters.min')"
                        v-model.number="filter.value.min"
                    />
                    <input
                        type="number"
                        class="input input-sm w-full"
                        :placeholder="$t('filters.max')"
                        v-model.number="filter.value.max"
                    />
                </div>
            </template>

            <!-- Choice: single select -->
            <template v-else-if="filter.type === FilterType.Choice">
                <select class="select select-sm w-full" v-model="filter.value">
                    <option value="">{{ $t('filters.all') }}</option>
                    <option
                        v-for="option in filter.availables"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ $t(option.label) }}
                    </option>
                </select>
            </template>

            <!-- Choices: multiple checkboxes -->
            <template v-else-if="filter.type === FilterType.Choices">
                <label
                    v-for="option in filter.availables"
                    :key="option.value"
                    class="flex items-center gap-2 cursor-pointer"
                >
                    <input
                        type="checkbox"
                        class="checkbox checkbox-sm"
                        :value="option.value"
                        v-model="filter.values"
                    />
                    <span>{{ $t(option.label) }}</span>
                </label>
            </template>
        </fieldset>
    </section>
</template>
