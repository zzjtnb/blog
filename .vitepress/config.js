import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'

const root = process.cwd()
const sourceDirectory = path.resolve(root, 'src')
const siteUrl = 'https://blog.zzjtnb.com'
const siteTitle = '争逐'
const siteDescription = '以墨写代码，以山河铺开个人文库。'
const siteKeywords = '争逐,编程,博客,政治,经济,军事,历史,天文,地理,人文,哲学'
const siteThemeColor = '#a93a2d'
const siteLogo = '/images/icons/logo.svg'
const mode = process.env.NODE_ENV || 'development'
const ignoredEntries = new Set(['components', 'public'])
const sectionLabels = new Map([
  ['博客', '博客'],
  ['教程', '教程'],
  ['examples', '示例'],
  ['测试', '测试'],
])
const navSections = [
  { text: '博客', directory: '博客' },
  { text: '教程', directory: '教程' },
  { text: '示例', directory: 'examples' },
  { text: '测试', directory: '测试' },
]
const collator = new Intl.Collator('zh-Hans-CN', { numeric: true, sensitivity: 'base' })
const dateFormatter = new Intl.DateTimeFormat('zh-Hans-CN', { dateStyle: 'medium' })

function labelFor(name) {
  return sectionLabels.get(name) ?? name.replace(/[-_]+/g, ' ')
}

function isMarkdownFile(name) {
  return name.endsWith('.md')
}

function isIndexPage(name) {
  return name === 'index.md' || name === 'README.md'
}

function listEntries(directory) {
  if (!fs.existsSync(directory))
    return []

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter(entry => !ignoredEntries.has(entry.name))
    .filter(entry => entry.isDirectory() || isMarkdownFile(entry.name))
    .sort((left, right) => {
      if (left.isDirectory() !== right.isDirectory())
        return left.isDirectory() ? -1 : 1

      return collator.compare(left.name, right.name)
    })
}

function cleanTitle(title) {
  const trimmed = title.trim()

  if (trimmed.startsWith('\'') && trimmed.endsWith('\''))
    return trimmed.slice(1, -1).replace(/''/g, '\'')

  if (trimmed.startsWith('"') && trimmed.endsWith('"'))
    return trimmed.slice(1, -1)

  return trimmed
}

function fallbackTitle(filePath) {
  const basename = path.basename(filePath, '.md')

  if (basename === 'index' || basename === 'README')
    return labelFor(path.basename(path.dirname(filePath)))

  return labelFor(basename)
}

function normalizeLine(line) {
  return line.endsWith('\r') ? line.slice(0, -1) : line
}

function titleFromFile(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').map(normalizeLine)
  let isFrontmatter = lines[0] === '---'

  for (const line of lines.slice(isFrontmatter ? 1 : 0)) {
    if (isFrontmatter) {
      if (line === '---') {
        isFrontmatter = false
        continue
      }

      if (line.startsWith('title:'))
        return cleanTitle(line.slice(6))

      continue
    }

    if (line.startsWith('# '))
      return cleanTitle(line.slice(2))
  }

  return fallbackTitle(filePath)
}

function cleanPagePath(relativePath) {
  const relative = relativePath.replace(/\.md$/, '')

  if (relative === 'index')
    return '/'

  if (relative.endsWith('/index'))
    return `/${relative.slice(0, -6)}/`

  return `/${relative}`
}

function pageLink(filePath) {
  const relative = path.relative(sourceDirectory, filePath).split(path.sep).join('/')
  return cleanPagePath(relative)
}

function absoluteSiteUrl(pagePath) {
  return new URL(pagePath, `${siteUrl}/`).href
}

function findIndexFile(directory) {
  for (const fileName of ['index.md', 'README.md']) {
    const filePath = path.join(directory, fileName)

    if (fs.existsSync(filePath))
      return filePath
  }

  return undefined
}

function firstPageIn(directory) {
  const indexFile = findIndexFile(directory)

  if (indexFile)
    return indexFile

  for (const entry of listEntries(directory)) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      const nestedPage = firstPageIn(entryPath)

      if (nestedPage)
        return nestedPage
    }

    if (entry.isFile() && !isIndexPage(entry.name))
      return entryPath
  }

  return undefined
}

function directoryLink(directory) {
  const page = firstPageIn(directory)
  return page ? pageLink(page) : undefined
}

function buildSidebarItems(directory) {
  return listEntries(directory).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      const children = buildSidebarItems(entryPath)
      const indexFile = findIndexFile(entryPath)
      const item = {
        text: labelFor(entry.name),
        collapsed: true,
      }

      if (indexFile)
        item.link = pageLink(indexFile)

      if (children.length)
        item.items = children

      return item.link || item.items ? [item] : []
    }

    if (isIndexPage(entry.name))
      return []

    return [{ text: titleFromFile(entryPath), link: pageLink(entryPath) }]
  })
}

function buildSidebar(directoryName) {
  const directory = path.join(sourceDirectory, directoryName)
  const indexFile = findIndexFile(directory)
  const rootItem = indexFile
    ? [{ text: labelFor(directoryName), link: pageLink(indexFile) }]
    : []

  return [...rootItem, ...buildSidebarItems(directory)]
}

function markdownFilesIn(directory) {
  return listEntries(directory).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory())
      return markdownFilesIn(entryPath)

    return isIndexPage(entry.name) ? [] : [entryPath]
  })
}

function isFrontmatterKey(key) {
  const first = key.charCodeAt(0)

  if (!((first >= 65 && first <= 90) || (first >= 97 && first <= 122)))
    return false

  return [...key.slice(1)].every((char) => {
    const code = char.charCodeAt(0)
    return char === '-' || char === '_' || (code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122)
  })
}

function parseFrontmatter(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').map(normalizeLine)

  if (lines[0] !== '---')
    return {}

  const data = {}
  let arrayKey = ''

  for (const line of lines.slice(1)) {
    if (line === '---')
      break

    const trimmedStart = line.trimStart()
    if (arrayKey && trimmedStart.startsWith('-')) {
      data[arrayKey].push(cleanTitle(trimmedStart.slice(1).trimStart()))
      continue
    }

    arrayKey = ''

    const colonIndex = line.indexOf(':')
    if (colonIndex <= 0)
      continue

    const key = line.slice(0, colonIndex)
    if (!isFrontmatterKey(key))
      continue

    const rawValue = line.slice(colonIndex + 1).trimStart()
    const value = cleanTitle(rawValue)

    if (rawValue === '' || value === '[]') {
      data[key] = []
      arrayKey = key
      continue
    }

    data[key] = value
  }

  return data
}

function cleanDescription(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s*/, '')
    .replace(/^\s{0,3}[-*+]\s+/, '')
    .replace(/^\s{0,3}>\s?/, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncateText(text, length = 118) {
  const cleaned = cleanDescription(text)

  return cleaned.length > length ? `${cleaned.slice(0, length)}…` : cleaned
}

function excerptFromFile(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').map(normalizeLine)
  let isFrontmatter = lines[0] === '---'
  let isCodeBlock = false
  const parts = []

  for (const line of lines.slice(isFrontmatter ? 1 : 0)) {
    const trimmed = line.trim()

    if (isFrontmatter) {
      if (line === '---')
        isFrontmatter = false

      continue
    }

    if (trimmed.startsWith('```')) {
      isCodeBlock = !isCodeBlock
      continue
    }

    if (isCodeBlock)
      continue

    const text = cleanDescription(line)
    if (text)
      parts.push(text)

    if (parts.join('').length > 140)
      break
  }

  return truncateText(parts.join(' '))
}

function timestampFor(value) {
  if (!value)
    return 0

  if (value instanceof Date)
    return +value

  const timestamp = Date.parse(String(value).replace(' ', 'T'))

  return Number.isNaN(timestamp) ? 0 : timestamp
}

function dateLabel(value) {
  const timestamp = timestampFor(value)

  if (!timestamp)
    return value || '未注明日期'

  return dateFormatter.format(new Date(timestamp))
}

function latestDateLabel(posts) {
  let latest = 0

  for (const post of posts) {
    if (post.sortTime > latest)
      latest = post.sortTime
  }

  if (!latest)
    return '持续更新'

  return dateFormatter.format(new Date(latest))
}

function buildBlogPosts(files) {
  return files
    .map((filePath) => {
      const metadata = parseFrontmatter(filePath)
      const category = metadata.category || labelFor(path.basename(path.dirname(filePath)))
      const tags = Array.isArray(metadata.tags)
        ? metadata.tags.filter(Boolean)
        : metadata.tags ? [metadata.tags] : []
      const date = metadata.date || ''
      const updated = metadata.updated || ''
      const activeDate = updated || date

      return {
        title: metadata.title || titleFromFile(filePath),
        description: truncateText(metadata.description || excerptFromFile(filePath)),
        date,
        updated,
        dateLabel: dateLabel(date),
        updatedLabel: updated ? dateLabel(updated) : '',
        category,
        tags,
        cover: metadata.cover || '',
        hot: metadata.hot === 'true',
        link: pageLink(filePath),
        sortTime: timestampFor(activeDate),
      }
    })
    .sort((left, right) => right.sortTime - left.sortTime || collator.compare(left.title, right.title))
    .map((post, index) => ({ ...post, tone: index % 6 }))
}

function countOptions(values) {
  const counts = new Map()

  for (const value of values) {
    if (value)
      counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || collator.compare(left[0], right[0]))
    .map(([name, count]) => ({ name, count }))
}

function pageSeoTitle(pageData) {
  return pageData.title && pageData.title !== siteTitle
    ? `${siteTitle} - ${pageData.title}`
    : siteTitle
}

function pageSeoHead(pageData) {
  const pagePath = cleanPagePath(pageData.relativePath)
  const canonical = absoluteSiteUrl(pagePath)
  const title = pageSeoTitle(pageData)
  const description = pageData.description || pageData.frontmatter.description || siteDescription

  return [
    ['link', { rel: 'canonical', href: canonical }],
    ['meta', { property: 'og:type', content: pagePath === '/' ? 'website' : 'article' }],
    ['meta', { property: 'og:site_name', content: siteTitle }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: canonical }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
  ]
}

const blogDirectory = path.join(sourceDirectory, '博客')
const blogFiles = markdownFilesIn(blogDirectory)
const blogPosts = buildBlogPosts(blogFiles)
const blogCategories = countOptions(blogPosts.map(post => post.category))
const blogTags = countOptions(blogPosts.flatMap(post => post.tags))
const blogCategoryNav = listEntries(blogDirectory)
  .filter(entry => entry.isDirectory())
  .map((entry) => {
    const link = directoryLink(path.join(blogDirectory, entry.name))
    return link ? { text: labelFor(entry.name), link } : undefined
  })
  .filter(Boolean)

const blogStats = {
  articles: blogFiles.length,
  categories: blogCategoryNav.length,
  sections: navSections.length + 1,
  latest: latestDateLabel(blogPosts),
}

const nav = [
  { text: '首页', link: '/' },
  ...navSections.map(section => ({
    text: section.text,
    link: directoryLink(path.join(sourceDirectory, section.directory)) ?? `/${section.directory}/`,
  })),
]
const sidebar = Object.fromEntries(
  navSections
    .filter(section => section.directory !== '博客')
    .map(section => [`/${section.directory}/`, buildSidebar(section.directory)]),
)

export default defineConfig({
  base: '/',
  sitemap: {
    hostname: siteUrl,
  },
  srcDir: 'src',
  outDir: 'dist',
  cacheDir: 'node_modules/.cache/vitepress',
  title: siteTitle,
  description: siteDescription,
  titleTemplate: `${siteTitle} - :title`,
  cleanUrls: true,
  lastUpdated: true,
  transformPageData(pageData) {
    const timestamp = timestampFor(pageData.frontmatter.updated || pageData.frontmatter.date)

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(...pageSeoHead(pageData))

    return timestamp ? { lastUpdated: timestamp } : undefined
  },
  ignoreDeadLinks: true,
  locales: {
    root: { label: '简体中文', lang: 'zh-Hans-CN' },
  },
  markdown: {
    theme: { light: 'monokai', dark: 'monokai' },
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': sourceDirectory,
      },
    },
    server: {
      strictPort: true,
      host: '0.0.0.0',
      port: 3000,
      cors: true,
    },
    plugins: [UnoCSS()],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 2500,
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
  },
  themeConfig: {
    logo: '/images/icons/logo.svg',
    nav,
    sidebar,
    blogStats,
    blogIndex: {
      posts: blogPosts,
      categories: blogCategories,
      tags: blogTags,
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/zzjtnb' }],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索',
          },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '重置搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '输入',
              navigateText: '导航',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'esc',
            },
          },
        },
      },
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outline: {
      label: '页面导航',
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容',
  },
  head: [
    ['link', { rel: 'icon', href: siteLogo, type: 'image/svg+xml' }],
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'author', content: siteTitle }],
    ['meta', { name: 'keywords', content: siteKeywords }],
    ['meta', { name: 'Copyright', content: '争逐版权所有' }],
    ['meta', { name: 'robots', content: 'index,follow' }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'application-name', content: siteTitle }],
    ['meta', { name: 'apple-mobile-web-app-title', content: siteTitle }],
    ['meta', { name: 'theme-color', content: siteThemeColor }],
    ['meta', { name: 'msapplication-navbutton-color', content: siteThemeColor }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    ['meta', { name: 'msapplication-starturl', content: '/' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  ],
})
