<script setup lang="ts">
interface FieldNote {
  kicker: string
  title: string
  text: string
}

defineProps<{
  items: FieldNote[]
}>()

function formatNoteIndex(index: number) {
  return String(index + 1).padStart(2, '0')
}
</script>

<template>
  <section class="zz-rivers-field" aria-labelledby="zz-home-field-title">
    <div class="zz-rivers-field__header">
      <div class="zz-rivers-section-heading zz-rivers-section-heading--vertical">
        <p>NOTEBOARD</p>
        <h2 id="zz-home-field-title">
          速查台
        </h2>
        <span>把常见问题、配置步骤和验证样例，整理成下一次可直接取用的线索。</span>
      </div>

      <aside class="zz-rivers-field__tagline" aria-label="整理原则">
        <strong>先能复用，再谈成文。</strong>
        <span>每条记录尽量留下场景、命令、结论和校验方式。</span>
      </aside>
    </div>

    <div class="zz-rivers-field__body">
      <div class="zz-rivers-field__grid">
        <article v-for="(item, index) in items" :key="item.title" class="zz-rivers-note">
          <span class="zz-rivers-note__index" aria-hidden="true">{{ formatNoteIndex(index) }}</span>
          <span class="zz-rivers-note__kicker">{{ item.kicker }}</span>
          <strong>{{ item.title }}</strong>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
