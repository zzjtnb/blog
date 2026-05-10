/**
 * UnoCSS 独立配置（不使用插件）
 * 基于 backup 目录的 shadcn-vue 主题数据
 * 用于验证配置正确性，后续再封装为插件
 *
 * Iconify 图标集合预览  https://icones.js.org
 * UnoCSS 官方教程  https://tutorial.unocss.dev/
 * UnoCSS 官方 Playground https://unocss.dev/playground
 */
import {
  defineConfig,
  presetIcons,
  presetWind4,
  transformerDirectives,
} from 'unocss'
import presetAnimations from 'unocss-preset-animations'

export default defineConfig({
  // 默认情况下，`.ts` 和 `.js` 文件不会被提取。
  // 这里显式包含 src 下的 ts/js/vue，兼容 shadcn-vue 在 cva 中声明的类名。
  // ⚠️ 修改后如样式异常，可清理缓存：rm -rf node_modules/.cache/unocss node_modules/.vite
  content: {
    pipeline: {
      include: [
        /index\.html$/,
        /src\/.*\.(vue|[jt]sx?)($|\?)/,
      ],
    },
  },

  // 预设配置
  presets: [
    // Wind4 预设 - Tailwind CSS v4 兼容层
    // ✅ 支持现代 CSS 特性（color-mix()、@property 声明等）
    // ✅ reset/property 使用官方默认行为
    // ✅ theme 使用默认 on-demand（更轻量）
    //    对于在 CSS 中直接使用的字体变量（如 --font-serif），在变量文件中手动声明兜底
    presetWind4(),

    // 图标预设 - 支持纯 CSS 图标
    // 优先使用本地安装的 @iconify-json/* 包，无需网络请求
    // 使用方式：<div class="i-ri-github-fill" /> 或 <div class="i-ri-heart-fill" />
    // 图标搜索：https://icon-sets.iconify.design/
    presetIcons({
      scale: 1.2, // 图标缩放比例
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),

    // Animations 预设 - 支持动画工具类
    presetAnimations(),
  ],

  // 启用 CSS @layer 输出（推荐开启）
  // ✅ 更好的样式隔离 - CSS @layer 提供标准的层叠控制，避免样式冲突
  // ✅ 便于第三方样式集成 - 可以精确控制不同来源样式的优先级
  // 层级顺序由 src/assets/styles/index.css 中的 @layer 声明控制
  outputToCssLayers: true,

  // 转换器 - 支持 @apply、@screen 等指令
  transformers: [transformerDirectives()],

})
