<script setup lang="ts" generic="T">
import Dropdown from '@chapelure/common/components/popups/Dropdown.vue';
import { SearchIcon, XIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';

const { items = [], displayKey } = defineProps<{
    items: T[],
    displayKey?: keyof T
}>();

const selectedItems = ref<any[]>([]);
const availableItems = computed(() => items.filter(
    x => selectedItems.value.indexOf(x) === -1 && x.name.toLowerCase().includes(search.value.toLowerCase())
));
const open = ref<boolean>(false);
const search = ref<string>("");

function getDisplay(value: T) : string
{
    return displayKey? new String(value[displayKey]).toString() : new String(value).toString();
}

function addItem(item: any) {
    selectedItems.value.push(item);
}

function removeItem(index: number) {
    selectedItems.value.splice(index, 1);
}

function openDropdown() {
    open.value = true;
}

</script>

<template>
    <Dropdown v-model="open">
        <template #summary>
            <summary class="bg-base-100 rounded-box border border-base-content/20 flex flex-wrap items-center min-h-10 p-1">
                <div class="flex flex-wrap gap-0.5 me-2">
                    <span class="badge whitespace-nowrap pe-0"
                          v-for="(value, index) in selectedItems"
                          :key="value.id">
                        {{ value.name }}
                        <button class="btn btn-xs btn-square btn-ghost"
                                @click="() => removeItem(index)">
                            <XIcon class="icon-sm" />
                        </button>
                    </span>
                </div>
                <div class="flex-1 min-w-32 flex items-center">
                    <input type="text"
                           class="w-full outline-hidden"
                           :placeholder="$t('actions.search')"
                           @focus="openDropdown"
                           v-model="search" />
                    <SearchIcon class="opacity-50" />
                </div>
            </summary>
        </template>
        <ul class="menu dropdown-contentbg-base-200 rounded-box shadow p-2">
            <li v-for="value in availableItems"
                :key="value.id"
                @click="() => addItem(value)">
                <a>{{ value.name }}</a>
            </li>
            <li class="opacity-30"
                v-if="!availableItems.length">
                <span>{{ $t('data.noResult') }}</span>
            </li>
        </ul>
    </Dropdown>
</template>