<script setup lang="ts">
import { computed } from 'vue'

interface BlogPost {
  title: string
  description: string
  date: string
  updated: string
  dateLabel: string
  updatedLabel: string
  category: string
  tags: string[]
  cover: string
  hot: boolean
  link: string
  tone: number
}

const props = defineProps<{
  post: BlogPost
}>()

const visibleTags = computed(() => props.post.tags.slice(0, 3))
const hiddenTagCount = computed(() => Math.max(props.post.tags.length - visibleTags.value.length, 0))
const displayDate = computed(() => props.post.updatedLabel || props.post.dateLabel)
const dateTime = computed(() => props.post.updated || props.post.date)
const description = computed(() => props.post.description || '暂无摘要，打开文章查看完整内容。')

function hideBrokenCover(event: Event) {
  const image = event.currentTarget as HTMLImageElement
  image.style.display = 'none'
}
</script>

<template>
  <a class="zz-blog-card" :class="`zz-blog-card--tone-${post.tone}`" :href="post.link">
    <div class="zz-blog-card__cover">
      <img v-if="post.cover" :src="post.cover" :alt="post.title" loading="lazy" @error="hideBrokenCover">
    </div>

    <div class="zz-blog-card__body">
      <div class="zz-blog-card__meta">
        <time v-if="dateTime" :datetime="dateTime">{{ displayDate }}</time>
        <em>{{ post.category }}</em>
      </div>

      <h3 class="zz-blog-card__title">{{ post.title }}</h3>
      <p class="zz-blog-card__description">{{ description }}</p>

      <div class="zz-blog-card__tags" aria-label="文章标签">
        <span v-for="tag in visibleTags" :key="tag">#{{ tag }}</span>
        <span v-if="hiddenTagCount">+{{ hiddenTagCount }}</span>
      </div>

      <strong v-if="post.hot" class="zz-blog-card__badge">热门</strong>
    </div>
  </a>
</template>

<style scoped>
.zz-blog-card {
  --card-tone: var(--zz-jade);

  isolation: isolate;
  position: relative;

  overflow: hidden;
  display: flex;
  flex-direction: column;

  min-height: 372px;
  border: 1px solid var(--zz-home-border);
  border-radius: 24px;

  color: var(--zz-home-ink);
  text-decoration: none;

  background:
    linear-gradient(180deg, color-mix(in srgb, var(--zz-surface) 80%, transparent), color-mix(in srgb, var(--zz-paper) 70%, transparent)),
    radial-gradient(circle at 90% 10%, color-mix(in srgb, var(--card-tone) 12%, transparent), transparent 14rem);

  transition: border-color 0.22s ease;
}

.zz-blog-card--tone-1 {
  --card-tone: var(--zz-cinnabar);
}

.zz-blog-card--tone-2 {
  --card-tone: var(--zz-gold);
}

.zz-blog-card--tone-3 {
  --card-tone: var(--zz-jade);
}

.zz-blog-card--tone-4 {
  --card-tone: var(--zz-indigo);
}

.zz-blog-card--tone-5 {
  --card-tone: var(--zz-cinnabar-2);
}

.zz-blog-card:hover {
  border-color: color-mix(in srgb, var(--card-tone) 46%, var(--zz-home-border));
}

.zz-blog-card__cover {
  position: relative;

  overflow: hidden;
  flex: 0 0 auto;

  height: 148px;

  background:
    linear-gradient(135deg, color-mix(in srgb, var(--card-tone) 22%, transparent), transparent 52%),
    linear-gradient(180deg, color-mix(in srgb, var(--zz-paper-deep) 70%, transparent), color-mix(in srgb, var(--zz-surface) 82%, transparent));
}

.zz-blog-card__cover::after {
  content: "";

  position: absolute;
  inset: auto -10% -32px;

  height: 96px;

  opacity: 0.26;
  background: color-mix(in srgb, var(--zz-ink) 28%, transparent);
  clip-path: polygon(0 100%, 16% 46%, 30% 72%, 44% 22%, 62% 78%, 78% 34%, 100% 68%, 100% 100%);
}

.zz-blog-card__cover img {
  position: absolute;
  z-index: 1;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform 0.34s ease;
}

.zz-blog-card:hover .zz-blog-card__cover img {
  transform: scale(1.03);
}

.zz-blog-card__body {
  position: relative;

  display: flex;
  flex: 1;
  flex-direction: column;

  padding: 16px;
}

.zz-blog-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;

  margin-bottom: 10px;

  font-family: var(--vp-font-family-mono);
  font-size: 0.62rem;
  font-weight: 850;
  color: var(--zz-home-soft);
  letter-spacing: 0.04em;
}

.zz-blog-card__meta em {
  padding: 3px 8px;
  border-radius: 999px;

  font-style: normal;
  color: color-mix(in srgb, var(--card-tone) 82%, var(--zz-home-ink));

  background: color-mix(in srgb, var(--card-tone) 13%, transparent);
}

.zz-blog-card__title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  margin: 0;

  font-family: "Noto Serif SC", "Noto Sans SC", serif;
  font-size: 1.16rem;
  font-weight: 900;
  line-height: 1.34;
  letter-spacing: -0.02em;
}

.zz-blog-card__description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;

  margin: 10px 0 0;

  font-size: 0.86rem;
  line-height: 1.72;
  color: var(--zz-home-soft);
}

.zz-blog-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  margin-top: auto;
  padding-top: 14px;
}

.zz-blog-card__tags span {
  padding: 4px 8px;
  border: 1px solid color-mix(in srgb, var(--zz-home-border) 82%, transparent);
  border-radius: 999px;

  font-size: 0.64rem;
  font-weight: 850;
  color: var(--zz-home-soft);

  background: color-mix(in srgb, var(--zz-surface) 66%, transparent);
}

.zz-blog-card__badge {
  position: absolute;
  z-index: 2;
  top: 12px;
  right: 12px;

  padding: 5px 8px;
  border-radius: 999px;

  font-size: 0.6rem;
  color: var(--zz-paper-soft);

  background: var(--zz-cinnabar);
}

@media (width < 560px) {
  .zz-blog-card {
    min-height: auto;
    border-radius: 20px;
  }
}
</style>
