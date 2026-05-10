<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
}>(), {
  title: 'Default Title',
})
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>
