<script setup lang="ts">
interface GateEntry {
  title: string
  seal: string
  eyebrow: string
  description: string
  link: string
  meta: string
  tone: 'cinnabar' | 'jade' | 'gold' | 'ink'
}

defineProps<{
  entries: GateEntry[]
}>()
</script>

<template>
  <section class="zz-rivers-gates" aria-labelledby="zz-home-gates-title">
    <div class="zz-rivers-section-heading">
      <p>FOUR GATES</p>
      <h2 id="zz-home-gates-title">
        四门入卷
      </h2>
      <span>从总览到实作，按用途进入不同卷册。</span>
    </div>

    <div class="zz-rivers-gates__grid">
      <a
        v-for="entry in entries"
        :key="entry.title"
        class="zz-rivers-gate"
        :class="`zz-rivers-gate--${entry.tone}`"
        :href="entry.link"
      >
        <span class="zz-rivers-gate__seal">{{ entry.seal }}</span>
        <small>{{ entry.eyebrow }}</small>
        <strong>{{ entry.title }}</strong>
        <em>{{ entry.meta }}</em>
        <p>{{ entry.description }}</p>
      </a>
    </div>
  </section>
</template>
