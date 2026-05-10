<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import FieldNotes from './FieldNotes.vue'
import GateGrid from './GateGrid.vue'
import Hero from './Hero.vue'

interface SiteStats {
  articles: number
  categories: number
  sections: number
  latest: string
}

interface GateEntry {
  title: string
  seal: string
  eyebrow: string
  description: string
  link: string
  meta: string
  tone: 'cinnabar' | 'jade' | 'gold' | 'ink'
}

const fallbackStats: SiteStats = {
  articles: 298,
  categories: 21,
  sections: 5,
  latest: '持续更新',
}

const { theme } = useData()

const stats = computed<SiteStats>(() => (theme.value as { blogStats?: SiteStats }).blogStats ?? fallbackStats)

const statItems = computed(() => [
  { value: stats.value.articles, label: '篇札记', caption: '散入诸卷' },
  { value: stats.value.categories, label: '类目', caption: '分门别派' },
  { value: stats.value.sections, label: '入口', caption: '循径可达' },
  { value: compactDate(stats.value.latest), label: '新墨', caption: '最近落笔' },
])

function compactDate(value: string) {
  return value.replace(/年|月/g, '/').replace(/日$/, '')
}

const gates: GateEntry[] = [
  {
    title: '博客',
    seal: '博',
    eyebrow: 'BLOG ARCHIVE',
    description: '零散经验与问题复盘先落到这里，方便日后重新检索和修订。',
    link: '/博客/',
    meta: '记录 · 复盘 · 索引',
    tone: 'cinnabar',
  },
  {
    title: '教程',
    seal: '程',
    eyebrow: 'GUIDE ROUTE',
    description: '把可复用的操作过程写成步骤，给下一次同类问题留一条路。',
    link: '/教程/如何更好地向 AI 助手提问',
    meta: '步骤 · 校验 · 复用',
    tone: 'jade',
  },
  {
    title: '示例',
    seal: '例',
    eyebrow: 'LIVE EXAMPLE',
    description: '用小页面验证语法、组件和排版效果，比口头说明更直接。',
    link: '/examples/markdown',
    meta: '语法 · 组件 · 对照',
    tone: 'gold',
  },
  {
    title: '测试',
    seal: '试',
    eyebrow: 'DESIGN LAB',
    description: '未定稿的想法先在这里试笔，留下可取之处，也留下取舍痕迹。',
    link: '/测试/',
    meta: '试验 · 取舍 · 留痕',
    tone: 'ink',
  },
]

const fieldNotes = [
  {
    kicker: 'DEBUG',
    title: '问题复盘',
    text: '把报错、触发场景、定位路径和最终修复写清楚，下一次能直接沿线排查。',
  },
  {
    kicker: 'CONFIG',
    title: '配置清单',
    text: '记录环境变量、构建脚本、依赖版本和系统设置，减少重复踩坑。',
  },
  {
    kicker: 'SNIPPET',
    title: '代码片段',
    text: '沉淀可以直接拿来改的 CSS、Node.js、Shell 和数据库操作片段。',
  },
  {
    kicker: 'VERIFY',
    title: '验证方法',
    text: '给教程和示例补上运行命令、检查点和回滚思路，让结论更可信。',
  },
]
</script>

<template>
  <main class="zz-rivers-home" aria-labelledby="zz-home-title">
    <Hero :stat-items="statItems" />
    <GateGrid :entries="gates" />
    <FieldNotes :items="fieldNotes" />
  </main>
</template>
