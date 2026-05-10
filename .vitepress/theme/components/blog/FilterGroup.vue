<script setup lang="ts">
interface BlogOption {
  name: string
  count: number
}

defineProps<{
  title: string
  options: BlogOption[]
  active: string
  total: number
  allValue: string
}>()

const emit = defineEmits<{
  select: [value: string]
}>()
</script>

<template>
  <section class="zz-blog-filter" :aria-label="title">
    <strong class="zz-blog-filter__title">{{ title }}</strong>

    <div class="zz-blog-filter__chips">
      <button
        class="zz-blog-filter__chip"
        :class="{ 'is-active': active === allValue }"
        type="button"
        :aria-pressed="active === allValue"
        @click="emit('select', allValue)"
      >
        {{ allValue }}
        <small>{{ total }}</small>
      </button>

      <button
        v-for="option in options"
        :key="option.name"
        class="zz-blog-filter__chip"
        :class="{ 'is-active': active === option.name }"
        type="button"
        :aria-pressed="active === option.name"
        @click="emit('select', option.name)"
      >
        {{ option.name }}
        <small>{{ option.count }}</small>
      </button>
    </div>
  </section>
</template>

<style scoped>
.zz-blog-filter {
  position: relative;

  display: grid;
  grid-template-columns: 68px minmax(0, 1fr);
  gap: 14px;
  align-items: start;

  padding: 12px 0 14px;
  border-bottom: 1px solid var(--zz-home-border);
}

.zz-blog-filter__title {
  position: relative;

  padding-top: 7px;

  font-family: "Noto Serif SC", serif;
  font-size: 1rem;
  font-weight: 900;
  color: var(--zz-home-ink);
}

.zz-blog-filter__chips {
  position: relative;

  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  min-width: 0;
}

.zz-blog-filter__chip {
  cursor: pointer;

  display: inline-flex;
  gap: 7px;
  align-items: center;

  padding: 7px 11px;
  border: 1px solid color-mix(in srgb, var(--zz-home-border) 86%, transparent);
  border-radius: 999px;

  font: inherit;
  font-size: 0.82rem;
  font-weight: 900;
  line-height: 1.2;
  color: var(--zz-home-soft);

  background: color-mix(in srgb, var(--zz-surface) 72%, transparent);

  transition: transform 0.18s ease, border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
}

.zz-blog-filter__chip small {
  font-family: var(--vp-font-family-mono);
  font-size: 0.64rem;
  color: inherit;
  opacity: 0.72;
}

.zz-blog-filter__chip:hover,
.zz-blog-filter__chip.is-active {
  transform: translateY(-1px);
  border-color: var(--zz-border-strong);
  color: var(--zz-cinnabar);
  background: color-mix(in srgb, var(--zz-cinnabar) 10%, var(--zz-surface));
}

@media (width < 680px) {
  .zz-blog-filter {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .zz-blog-filter__title {
    padding-top: 0;
  }
}
</style>
