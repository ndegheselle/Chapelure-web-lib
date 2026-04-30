<script setup lang="ts" generic="T">
import {
    BindingKind,
    type Filter,
    type FilterDefinition,
    type FilterGroup,
    FilterOperator,
    FilterType,
    createFilter,
} from '@chapelure/api/filters';

const { filters } = defineProps<{
    filters: FilterDefinition<T>[]
}>();

const group = defineModel<FilterGroup>({ required: true });

function getFilterValue(key: string): any {
    const f = group.value.filters.find((f): f is Filter => 'key' in f && (f as Filter).key === key) as Filter | undefined;
    return f?.value ?? null;
}

function setFilterValue(key: string, value: any, operator: FilterOperator) {
    const idx = group.value.filters.findIndex((f) => 'key' in f && (f as Filter).key === key);
    const isEmpty = value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0) || Number.isNaN(value);
    if (isEmpty) {
        if (idx !== -1) group.value.filters.splice(idx, 1);
    } else {
        const filter = createFilter({ key, value, operator });
        if (idx !== -1) group.value.filters[idx] = filter;
        else group.value.filters.push(filter);
    }
}

function toggleChoice(key: string, value: any) {
    const current: any[] = Array.isArray(getFilterValue(key)) ? [...getFilterValue(key)] : [];
    const idx = current.indexOf(value);
    if (idx === -1) current.push(value);
    else current.splice(idx, 1);
    setFilterValue(key, current, FilterOperator.Equals);
}
</script>

<template>
    <section class="flex flex-col gap-2">
        <fieldset v-for="filter in filters" :key="filter.label" class="fieldset">
            <legend class="fieldset-legend">{{ $t(filter.label) }}</legend>

            <template v-if="filter.type === FilterType.Number && filter.binding.kind === BindingKind.Range">
                <div class="flex gap-2 items-center">
                    <input
                        type="number"
                        class="input input-sm w-full"
                        :value="getFilterValue(String(filter.binding.keyMin))"
                        @input="setFilterValue(String(filter.binding.keyMin), ($event.target as HTMLInputElement).valueAsNumber, FilterOperator.GreaterThan)"
                    />
                    <span class="text-base-content/50">—</span>
                    <input
                        type="number"
                        class="input input-sm w-full"
                        :value="getFilterValue(String(filter.binding.keyMax))"
                        @input="setFilterValue(String(filter.binding.keyMax), ($event.target as HTMLInputElement).valueAsNumber, FilterOperator.LessThan)"
                    />
                </div>
            </template>

            <template v-else-if="filter.type === FilterType.Number && filter.binding.kind === BindingKind.Single">
                <input
                    type="number"
                    class="input input-sm w-full"
                    :value="getFilterValue(String(filter.binding.key))"
                    @input="setFilterValue(String(filter.binding.key), ($event.target as HTMLInputElement).valueAsNumber, FilterOperator.Equals)"
                />
            </template>

            <template v-else-if="filter.type === FilterType.Choice">
                <div class="flex flex-col gap-x-4 gap-y-1">
                    <label
                        v-for="choice in filter.availables"
                        :key="choice.value"
                        class="label cursor-pointer gap-2"
                    >
                        <input
                            v-if="filter.multiple"
                            type="checkbox"
                            class="checkbox checkbox-sm"
                            :value="choice.value"
                            :checked="Array.isArray(getFilterValue(String(filter.binding.key))) && getFilterValue(String(filter.binding.key)).includes(choice.value)"
                            @change="toggleChoice(String(filter.binding.key), choice.value)"
                        />
                        <input
                            v-else
                            type="radio"
                            class="radio radio-sm"
                            :name="String(filter.binding.key)"
                            :value="choice.value"
                            :checked="getFilterValue(String(filter.binding.key)) === choice.value"
                            @change="setFilterValue(String(filter.binding.key), choice.value, FilterOperator.Equals)"
                        />
                        <span class="text-sm">{{ $t(choice.label) }}</span>
                    </label>
                </div>
            </template>
        </fieldset>
    </section>
</template>
