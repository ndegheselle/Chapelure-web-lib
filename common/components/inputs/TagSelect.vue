<script setup lang="ts">
import { XIcon } from 'lucide-vue-next';
import { ref, useTemplateRef } from 'vue';

const items = ref<any[]>([
    { id: 1, name: 'Tag 1' },
    { id: 2, name: 'Tag 2' },
    { id: 3, name: 'Tag 3' },
]);
const selectedItems = ref<any[]>([]);
const detailRef = useTemplateRef('detail');

function removeItem(index: number) {
    selectedItems.value.splice(index, 1);
}

function openDetail()
{
    if (!detailRef.value)
        return;
    detailRef.value.open = true;
}

</script>

<template>
    <details class="dropdown" ref="detail">
        <summary class="bg-base-100 rounded-box border border-base-content/20 px-1 flex items-center gap-1">
            <span class="badge pe-0" v-for="(value, index) in selectedItems" :key="value.id">
                {{ value.name }}
                <button class="btn btn-xs btn-square btn-ghost" @click="() => removeItem(index)">
                    <XIcon class="icon-sm" />
                </button>
            </span>
            <input type="text" class="input input-sm input-ghost w-full" placeholder="Type here" @focus="openDetail" />
        </summary>
        <ul class="menu dropdown-contentbg-base-200 rounded-box shadow p-2">
            <li v-for="value in items" :key="value.id">
                <a>{{ value.name }}</a>
            </li>
        </ul>
    </details>
</template>
<style scoped>
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}

</style>