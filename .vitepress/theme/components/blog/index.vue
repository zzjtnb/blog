<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, onMounted, shallowRef, watch } from 'vue'
import FilterGroup from './FilterGroup.vue'
import PostCard from './PostCard.vue'

interface BlogOption {
  name: string
  count: number
}

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

interface BlogIndexData {
  posts: BlogPost[]
  categories: BlogOption[]
  tags: BlogOption[]
}

const ALL_FILTER = '全部'
const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 60
const PAGE_SIZE_OPTIONS = [8, 12, 16, 24, 32]
const fallbackBlog: BlogIndexData = {
  posts: [],
  categories: [],
  tags: [],
}

const { theme } = useData()
const activeCategory = shallowRef(ALL_FILTER)
const activeTag = shallowRef(ALL_FILTER)
const currentPage = shallowRef(1)
const pageSize = shallowRef(DEFAULT_PAGE_SIZE)
const isRouteStateReady = shallowRef(false)

const blog = computed<BlogIndexData>(() => (theme.value as { blogIndex?: BlogIndexData }).blogIndex ?? fallbackBlog)
const posts = computed(() => blog.value.posts)
const categoryPosts = computed(() => activeCategory.value === ALL_FILTER
  ? posts.value
  : posts.value.filter(post => post.category === activeCategory.value))
const visiblePosts = computed(() => {
  if (activeCategory.value !== ALL_FILTER)
    return categoryPosts.value

  if (activeTag.value !== ALL_FILTER)
    return posts.value.filter(post => post.tags.includes(activeTag.value))

  return posts.value
})
const tagOptions = computed(() => {
  if (activeCategory.value === ALL_FILTER)
    return blog.value.tags

  const counts = new Map<string, number>()

  for (const post of categoryPosts.value) {
    for (const tag of post.tags)
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], 'zh-Hans-CN'))
    .map(([name, count]) => ({ name, count }))
})
const tagTotal = computed(() => categoryPosts.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(visiblePosts.value.length / pageSize.value)))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value

  return visiblePosts.value.slice(start, start + pageSize.value)
})
const pageNumbers = computed(() => {
  const pages = totalPages.value
  const current = currentPage.value

  if (pages <= 7)
    return Array.from({ length: pages }, (_, index) => index + 1)

  const start = Math.max(1, Math.min(current - 2, pages - 4))
  return Array.from({ length: 5 }, (_, index) => start + index)
})
watch(totalPages, (pages) => {
  if (currentPage.value > pages)
    setPage(pages)
})

watch(
  [activeCategory, activeTag, currentPage, pageSize],
  () => {
    if (isRouteStateReady.value)
      syncRouteState()
  },
)

onMounted(() => {
  restoreRouteState()
  isRouteStateReady.value = true
  syncRouteState()
})

function selectedOption(options: BlogOption[], value: string) {
  return options.some(option => option.name === value) ? value : ALL_FILTER
}

function setPage(page: number) {
  const normalizedPage = Math.min(Math.max(Math.floor(page) || 1, 1), totalPages.value)

  if (currentPage.value !== normalizedPage)
    currentPage.value = normalizedPage
}

function resetPage() {
  setPage(1)
}

function normalizedPageSize(value: number | string | null) {
  if (value === null || value === '')
    return DEFAULT_PAGE_SIZE

  const size = Number(value)

  return Number.isFinite(size)
    ? Math.min(Math.max(Math.floor(size), 1), MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE
}

function restoreRouteState() {
  const params = new URLSearchParams(window.location.search)
  const category = selectedOption(blog.value.categories, params.get('category') ?? ALL_FILTER)
  const tag = selectedOption(blog.value.tags, params.get('tag') ?? ALL_FILTER)

  const restoredPageSize = normalizedPageSize(params.get('pageSize'))

  if (pageSize.value !== restoredPageSize)
    pageSize.value = restoredPageSize

  if (category !== ALL_FILTER) {
    if (activeCategory.value !== category)
      activeCategory.value = category

    if (activeTag.value !== ALL_FILTER)
      activeTag.value = ALL_FILTER
  }
  else {
    if (activeCategory.value !== ALL_FILTER)
      activeCategory.value = ALL_FILTER

    if (activeTag.value !== tag)
      activeTag.value = tag
  }

  setPage(Number(params.get('page')))
}

function syncRouteState() {
  const url = new URL(window.location.href)

  url.searchParams.delete('category')
  url.searchParams.delete('tag')
  url.searchParams.delete('page')
  url.searchParams.delete('pageSize')

  if (activeCategory.value !== ALL_FILTER)
    url.searchParams.set('category', activeCategory.value)

  if (activeTag.value !== ALL_FILTER)
    url.searchParams.set('tag', activeTag.value)

  if (currentPage.value > 1)
    url.searchParams.set('page', String(currentPage.value))

  if (pageSize.value !== DEFAULT_PAGE_SIZE)
    url.searchParams.set('pageSize', String(pageSize.value))

  const nextUrl = `${url.pathname}${url.search}${url.hash}`
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`

  if (nextUrl !== currentUrl)
    window.history.replaceState(window.history.state, '', nextUrl)
}

function setPageSize(size: number) {
  const normalizedSize = normalizedPageSize(size)

  if (pageSize.value !== normalizedSize)
    pageSize.value = normalizedSize

  resetPage()
}

function selectCategory(value: string) {
  if (activeCategory.value !== value)
    activeCategory.value = value

  if (activeTag.value !== ALL_FILTER)
    activeTag.value = ALL_FILTER

  resetPage()
}

function selectTag(value: string) {
  if (activeCategory.value !== ALL_FILTER)
    activeCategory.value = ALL_FILTER

  if (activeTag.value !== value)
    activeTag.value = value

  resetPage()
}

function handlePageSizeChange(event: Event) {
  const input = event.currentTarget as HTMLInputElement
  setPageSize(Number(input.value))
  input.value = String(pageSize.value)
}

function handlePageJump(event: Event) {
  const input = event.currentTarget as HTMLInputElement
  setPage(Number(input.value))
  input.value = String(currentPage.value)
}
</script>

<template>
  <main class="zz-blog-index" aria-label="博客文章列表">
    <section class="zz-blog-filters" aria-label="文章筛选器">
      <FilterGroup
        title="分类"
        :options="blog.categories"
        :active="activeCategory"
        :total="posts.length"
        :all-value="ALL_FILTER"
        @select="selectCategory"
      />
      <FilterGroup
        title="标签"
        :options="tagOptions"
        :active="activeTag"
        :total="tagTotal"
        :all-value="ALL_FILTER"
        @select="selectTag"
      />
    </section>

    <section class="zz-blog-feed" aria-label="文章列表">
      <div v-if="paginatedPosts.length" class="zz-blog-feed__list">
        <PostCard v-for="post in paginatedPosts" :key="post.link" :post="post" />
      </div>

      <div v-else class="zz-blog-feed__empty">
        当前组合没有文章，换一个分类或标签试试。
      </div>

      <nav v-if="totalPages > 1" class="zz-blog-pagination" aria-label="文章分页">
        <div class="zz-blog-pagination__pages">
          <button type="button" :disabled="currentPage === 1" @click="setPage(currentPage - 1)">
            上一页
          </button>
          <button
            v-for="page in pageNumbers"
            :key="page"
            type="button"
            :class="{ 'is-active': page === currentPage }"
            :aria-current="page === currentPage ? 'page' : undefined"
            @click="setPage(page)"
          >
            {{ page }}
          </button>
          <button type="button" :disabled="currentPage === totalPages" @click="setPage(currentPage + 1)">
            下一页
          </button>
        </div>

        <div class="zz-blog-pagination__controls">
          <label>
            每页
            <input
              :value="pageSize"
              list="zz-page-size-options"
              type="number"
              min="1"
              :max="MAX_PAGE_SIZE"
              inputmode="numeric"
              @change="handlePageSizeChange"
              @keyup.enter="handlePageSizeChange"
            >
          </label>
          <datalist id="zz-page-size-options">
            <option v-for="option in PAGE_SIZE_OPTIONS" :key="option" :value="option" />
          </datalist>

          <label>
            跳到
            <input
              :value="currentPage"
              type="number"
              min="1"
              :max="totalPages"
              inputmode="numeric"
              @change="handlePageJump"
              @keyup.enter="handlePageJump"
            >
          </label>

          <span>共 {{ totalPages }} 页</span>
        </div>
      </nav>
    </section>
  </main>
</template>

<style scoped>
.zz-blog-index {
  position: relative;

  overflow: hidden;

  max-width: 1240px;
  margin: 0 auto;
  padding: 14px 18px 72px;

  color: var(--zz-home-ink);
}

.zz-blog-filters,
.zz-blog-feed {
  position: relative;
  z-index: 1;
}

.zz-blog-filters {
  display: grid;
  gap: 0;
}

.zz-blog-feed {
  margin-top: 18px;
}

.zz-blog-feed__list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.zz-blog-feed__empty {
  padding: 30px;
  border: 1px dashed var(--zz-home-border);
  border-radius: 22px;

  color: var(--zz-home-soft);
  text-align: center;

  background: color-mix(in srgb, var(--zz-home-card) 72%, transparent);
}

.zz-blog-pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  justify-content: space-between;

  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid var(--zz-home-border);
}

.zz-blog-pagination__pages,
.zz-blog-pagination__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.zz-blog-pagination button,
.zz-blog-pagination input {
  border: 1px solid var(--zz-home-border);
  border-radius: 999px;

  font: inherit;
  font-size: 0.82rem;
  font-weight: 900;
  color: var(--zz-home-ink);

  background: transparent;
}

.zz-blog-pagination button {
  cursor: pointer;
  min-width: 36px;
  padding: 7px 11px;
}

.zz-blog-pagination input {
  width: 70px;
  margin-left: 6px;
  padding: 7px 10px;
}

.zz-blog-pagination label,
.zz-blog-pagination span {
  font-size: 0.82rem;
  font-weight: 900;
  color: var(--zz-home-soft);
}

.zz-blog-pagination button:hover:not(:disabled),
.zz-blog-pagination button.is-active,
.zz-blog-pagination input:focus {
  border-color: var(--zz-border-strong);
  color: var(--zz-cinnabar);
  background: color-mix(in srgb, var(--zz-cinnabar) 8%, transparent);
  outline: none;
}

.zz-blog-pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

@media (width < 1080px) {
  .zz-blog-feed__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (width < 780px) {
  .zz-blog-feed__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (width < 560px) {
  .zz-blog-index {
    padding: 16px 12px 48px;
  }

  .zz-blog-feed__list {
    grid-template-columns: 1fr;
  }

  .zz-blog-pagination {
    justify-content: center;
    padding-top: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .zz-blog-index *,
  .zz-blog-index *::before,
  .zz-blog-index *::after {
    transition-duration: 0.01ms !important;
  }
}
</style>
