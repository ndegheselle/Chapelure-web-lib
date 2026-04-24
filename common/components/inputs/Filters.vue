<script setup lang="js">
import { FunnelIcon } from 'lucide-vue-next';

</script>

<template>
    <section class="flex gap-1">
        <button class="btn btn-sm">Age</button>
        <button class="btn btn-sm ms-auto">
            <FunnelIcon />
            {{ $t('actions.filter') }}
        </button>
    </section>
</template>