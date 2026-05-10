import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFile = fileURLToPath(import.meta.url)
const projectDirectory = path.resolve(path.dirname(currentFile), '..')
const backupDirectory = path.join(projectDirectory, 'backup')
const sqlFile = path.join(backupDirectory, 'zzjtnb.sql')
const outputDirectory = path.join(projectDirectory, 'src', '博客')
const columns = [
  'id',
  'path',
  'title',
  'sort',
  'tags',
  'img',
  'content',
  'hot',
  'pageviews',
  'created',
  'updated',
]

function readSql() {
  return fs.readFileSync(sqlFile, 'utf8')
}

function isWhitespace(char) {
  return /\s/.test(char)
}

function parseString(input, index) {
  let value = ''
  let i = index + 1

  while (i < input.length) {
    const char = input[i]
    const next = input[i + 1]

    if (char === '\\') {
      if (next === undefined)
        break

      const escapeMap = {
        0: '\0',
        b: '\b',
        n: '\n',
        r: '\r',
        t: '\t',
        Z: '\x1A',
      }

      value += escapeMap[next] ?? next
      i += 2
      continue
    }

    if (char === '\'') {
      if (next === '\'') {
        value += '\''
        i += 2
        continue
      }

      return { value, index: i + 1 }
    }

    value += char
    i += 1
  }

  throw new Error(`Unclosed SQL string near ${index}`)
}

function parseRawValue(input, index) {
  let i = index

  while (i < input.length && input[i] !== ',' && input[i] !== ')')
    i += 1

  const raw = input.slice(index, i).trim()

  if (raw.toUpperCase() === 'NULL')
    return { value: null, index: i }

  if (/^-?\d+(?:\.\d+)?$/.test(raw))
    return { value: Number(raw), index: i }

  return { value: raw, index: i }
}

function parseValue(input, index) {
  let i = index

  while (isWhitespace(input[i]))
    i += 1

  if (input[i] === '\'')
    return parseString(input, i)

  return parseRawValue(input, i)
}

function parseTuple(input, index) {
  let i = index
  const values = []

  if (input[i] !== '(')
    throw new Error(`Expected tuple at ${index}`)

  i += 1

  while (i < input.length) {
    while (isWhitespace(input[i]))
      i += 1

    if (input[i] === ')')
      return { values, index: i + 1 }

    const parsed = parseValue(input, i)
    values.push(parsed.value)
    i = parsed.index

    while (isWhitespace(input[i]))
      i += 1

    if (input[i] === ',') {
      i += 1
      continue
    }

    if (input[i] === ')')
      return { values, index: i + 1 }

    throw new Error(`Expected tuple delimiter at ${i}`)
  }

  throw new Error(`Unclosed tuple near ${index}`)
}

function statementEnd(input, index) {
  let i = index
  let inString = false

  while (i < input.length) {
    const char = input[i]
    const next = input[i + 1]

    if (inString) {
      if (char === '\\') {
        i += 2
        continue
      }

      if (char === '\'') {
        if (next === '\'') {
          i += 2
          continue
        }

        inString = false
      }

      i += 1
      continue
    }

    if (char === '\'') {
      inString = true
      i += 1
      continue
    }

    if (char === ';')
      return i

    i += 1
  }

  return input.length
}

function blogRows(sql) {
  const rows = []
  const matcher = /INSERT INTO `blogs` VALUES\s*/g
  let match = matcher.exec(sql)

  while (match) {
    const start = match.index + match[0].length
    const end = statementEnd(sql, start)
    const valuesSql = sql.slice(start, end)
    let i = 0

    while (i < valuesSql.length) {
      while (isWhitespace(valuesSql[i]) || valuesSql[i] === ',')
        i += 1

      if (i >= valuesSql.length)
        break

      const tuple = parseTuple(valuesSql, i)
      const row = Object.fromEntries(columns.map((column, index) => [column, tuple.values[index]]))
      rows.push(row)
      i = tuple.index
    }

    matcher.lastIndex = end + 1
    match = matcher.exec(sql)
  }

  return rows
}

function yamlString(value) {
  if (value === null || value === undefined || value === '')
    return ''

  return String(value).replace(/\r?\n/g, ' ').trim()
}

function yamlQuotedString(value) {
  return `'${yamlString(value).replace(/'/g, '\'\'')}'`
}

function splitTags(tags) {
  if (!tags)
    return []

  return String(tags)
    .split(/[，,、|/]+/)
    .map(tag => tag.trim())
    .filter(Boolean)
}

function frontmatterList(name, items) {
  if (!items.length)
    return `${name}: []`

  return [
    `${name}:`,
    ...items.map(item => `  - ${yamlQuotedString(item)}`),
  ].join('\n')
}

function plainDescription(content) {
  return String(content ?? '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*_`\-[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120)
}

function safeSegment(value, fallback, sanitize) {
  return sanitize(String(value || fallback).normalize('NFKC'))
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[. ]+$/g, '')
    .slice(0, 120) || String(fallback)
}

function safeDirectorySegment(value, fallback) {
  return safeSegment(value, fallback, text => text
    .replace(/[%#]/g, '')
    .replace(/[\\/:*?"<>|]/g, ' '))
}

function safeFileSegment(value, fallback) {
  return safeSegment(value, fallback, text => text.replace(/[\p{P}\p{S}]+/gu, ' '))
}

const languageAliases = new Map([
  ['babsh', 'bash'],
  ['bash', 'bash'],
  ['bat', 'bat'],
  ['cmd', 'bat'],
  ['dart', 'dart'],
  ['html', 'html'],
  ['java', 'java'],
  ['javascript', 'js'],
  ['js', 'js'],
  ['json', 'json'],
  ['jsonc', 'jsonc'],
  ['lua', 'lua'],
  ['mysql', 'sql'],
  ['php', 'php'],
  ['powershell', 'powershell'],
  ['ps1', 'powershell'],
  ['shell', 'sh'],
  ['sh', 'sh'],
  ['sql', 'sql'],
  ['ts', 'ts'],
  ['typescript', 'ts'],
  ['xml', 'xml'],
])

const supportedLanguages = new Set([
  'bash',
  'bat',
  'c',
  'cpp',
  'css',
  'dart',
  'diff',
  'dockerfile',
  'go',
  'html',
  'ini',
  'java',
  'js',
  'json',
  'jsonc',
  'jsx',
  'lua',
  'markdown',
  'md',
  'nginx',
  'php',
  'powershell',
  'python',
  'rust',
  'scss',
  'sh',
  'sql',
  'ts',
  'tsx',
  'txt',
  'vue',
  'xml',
  'yaml',
  'yml',
])

function normalizeLanguage(language) {
  const normalized = String(language || '').trim().toLowerCase()
  const aliased = languageAliases.get(normalized) ?? normalized

  return supportedLanguages.has(aliased) ? aliased : 'txt'
}

function normalizeFenceInfo(info) {
  const trimmed = info.trim()

  if (!trimmed)
    return { info: '' }

  if (trimmed.startsWith('<?php'))
    return { info: 'php', extraLine: trimmed, fenceLength: 4, allowShortClose: true }

  if (trimmed.startsWith('<'))
    return { info: 'html', extraLine: trimmed, fenceLength: 4, allowShortClose: true }

  if (/^\{=html\}$/i.test(trimmed))
    return { info: 'html' }

  const withoutBackticks = trimmed.replace(/^`+/, '')
  const token = withoutBackticks.split(/\s+/, 1)[0]
  const languageMatch = token.match(/^[\w#+.-]+/)

  if (!languageMatch)
    return { info: 'txt' }

  const language = normalizeLanguage(languageMatch[0])
  const trailingToken = token.slice(languageMatch[0].length)
  const trailingInfo = withoutBackticks.slice(token.length)

  if (trailingToken && !/^\{.*\}$/.test(trailingToken))
    return { info: language, extraLine: trailingToken }

  return { info: `${language}${trailingToken}${trailingInfo}`.trim() }
}

function nextMeaningfulLine(lines, index) {
  for (let i = index + 1; i < lines.length; i += 1) {
    const line = lines[i].trim()

    if (line)
      return line
  }

  return ''
}

function shouldCloseShortFence(lines, index) {
  const next = nextMeaningfulLine(lines, index)
  return !next.startsWith('<')
}

function parseFenceLine(line) {
  let index = 0

  while (index < line.length && index < 3 && line[index] === ' ')
    index += 1

  const char = line[index]

  if (char !== '`' && char !== '~')
    return undefined

  let end = index

  while (line[end] === char)
    end += 1

  if (end - index < 3)
    return undefined

  return {
    indent: line.slice(0, index),
    info: line.slice(end),
    marker: line.slice(index, end),
  }
}

function normalizeCodeFences(content) {
  const lines = String(content ?? '').split('\n')
  const normalized = []
  let fence

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const parsedFence = parseFenceLine(line)

    if (!parsedFence) {
      normalized.push(line)
      continue
    }

    const { indent, info, marker } = parsedFence

    if (fence) {
      const isClosingFence = marker[0] === fence.char && !info.trim()
      const closesCurrentFence = isClosingFence
        && (marker.length >= fence.length || (fence.allowShortClose && shouldCloseShortFence(lines, index)))

      if (closesCurrentFence) {
        normalized.push(`${indent}${fence.char.repeat(fence.length)}`)
        fence = undefined
        continue
      }

      normalized.push(line)
      continue
    }

    const normalizedInfo = normalizeFenceInfo(info)
    const fenceLength = Math.max(marker.length, normalizedInfo.fenceLength ?? marker.length)

    normalized.push(`${indent}${marker[0].repeat(fenceLength)}${normalizedInfo.info}`)

    if (normalizedInfo.extraLine)
      normalized.push(normalizedInfo.extraLine)

    fence = {
      allowShortClose: normalizedInfo.allowShortClose,
      char: marker[0],
      length: fenceLength,
    }
  }

  return normalized.join('\n')
}

function normalizeContent(content) {
  return normalizeCodeFences(content)
}

function markdownFor(blog) {
  const tags = splitTags(blog.tags)
  const content = normalizeContent(String(blog.content ?? '').trim())
  const description = plainDescription(content)
  const frontmatter = [
    '---',
    `title: ${yamlQuotedString(blog.title)}`,
    `description: ${yamlQuotedString(description)}`,
    `date: ${yamlQuotedString(blog.created)}`,
    `updated: ${yamlQuotedString(blog.updated)}`,
    `category: ${yamlQuotedString(blog.sort)}`,
    frontmatterList('tags', tags),
    `cover: ${yamlQuotedString(blog.img)}`,
    `hot: ${Boolean(blog.hot)}`,
    `sourceId: ${Number(blog.id)}`,
    `sourcePath: ${yamlQuotedString(blog.path)}`,
    '---',
    '',
  ].join('\n')

  return `${frontmatter}${content}\n`
}

function writeBlogIndex() {
  const frontmatter = [
    '---',
    'layout: page',
    'title: 博客',
    'pageClass: zz-blog-page',
    'sidebar: false',
    'aside: false',
    '---',
    '',
    '<BlogIndex />',
    '',
  ].join('\n')

  fs.writeFileSync(path.join(outputDirectory, 'index.md'), frontmatter, 'utf8')
}

function writeBlogs(blogs) {
  const seen = new Map()
  const createdDirectories = new Set()

  fs.rmSync(outputDirectory, { force: true, recursive: true })
  fs.mkdirSync(outputDirectory, { recursive: true })
  writeBlogIndex()

  for (const blog of blogs) {
    const category = safeDirectorySegment(blog.sort, '未分类')
    const title = safeFileSegment(blog.title || blog.path, `blog-${blog.id}`)
    const categoryDirectory = path.join(outputDirectory, category)
    const key = `${category}/${title}`
    const count = seen.get(key) ?? 0
    const fileName = count ? `${title}-${blog.id}.md` : `${title}.md`

    seen.set(key, count + 1)

    if (!createdDirectories.has(categoryDirectory)) {
      fs.mkdirSync(categoryDirectory, { recursive: true })
      createdDirectories.add(categoryDirectory)
    }

    fs.writeFileSync(path.join(categoryDirectory, fileName), markdownFor(blog), 'utf8')
  }
}

const blogs = blogRows(readSql()).sort((left, right) => {
  const leftTime = Date.parse(left.created ?? '') || 0
  const rightTime = Date.parse(right.created ?? '') || 0
  return leftTime - rightTime || Number(left.id) - Number(right.id)
})

writeBlogs(blogs)

const categories = new Set(blogs.map(blog => blog.sort || '未分类'))
const withCover = blogs.filter(blog => blog.img).length
const withTags = blogs.filter(blog => splitTags(blog.tags).length).length

console.log(`生成 ${blogs.length} 篇 Markdown`)
console.log(`输出目录: ${outputDirectory}`)
console.log(`分类数量: ${categories.size}`)
console.log(`带封面: ${withCover}`)
console.log(`带标签: ${withTags}`)
