<script setup lang="ts">
interface StatItem {
  value: string | number
  label: string
  caption: string
}

defineProps<{
  statItems: StatItem[]
}>()
</script>

<template>
  <section class="zz-rivers-hero">
    <div class="zz-rivers-hero__copy">
      <span class="zz-rivers-hero__seal">争逐</span>
      <p class="zz-rivers-hero__eyebrow">
        技术札记 · 工具教程 · 页面示例
      </p>
      <h1 id="zz-home-title">
        代码入卷，<span>山河作序。</span>
      </h1>
      <p class="zz-rivers-hero__summary">
        这里整理前端、Node.js、Linux、数据库和日常工具配置，按博客、教程、示例与测试入口快速进入。
      </p>

      <dl class="zz-rivers-hero__stats" aria-label="站点概览">
        <div v-for="item in statItems" :key="item.label">
          <dt>{{ item.value }}</dt>
          <dd>{{ item.label }}</dd>
          <small>{{ item.caption }}</small>
        </div>
      </dl>
    </div>

    <aside class="zz-rivers-hero__scene" aria-label="山河卷轴视觉">
      <div class="zz-rivers-scene__moon" />
      <div class="zz-rivers-scene__mountain zz-rivers-scene__mountain--back" />
      <div class="zz-rivers-scene__mountain zz-rivers-scene__mountain--front" />
      <div class="zz-rivers-scene__river" />
    </aside>
  </section>
</template>
