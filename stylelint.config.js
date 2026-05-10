/**
 * Stylelint 配置文件
 *
 * ⚠️ 重要说明：文件类型控制策略
 *
 * ❌ 问题：Stylelint 配置文件不支持"白名单"（没有类似 ESLint 的 files 选项）
 *         如果在 ignoreFiles 中用黑名单排除文件，新增的文件格式仍会被检查
 *
 * ✅ 解决方案：通过命令行和 VS Code 配置控制文件类型（白名单模式）
 *
 * 文件类型控制分工：
 * ├─ stylelint.config.js（本文件）
 * │  └─ 只排除目录和特殊文件（如 dist, node_modules）
 * │     ⚠️ 不要在这里排除文件扩展名（.js, .ts 等）
 * │        原因：无法实现白名单，新增格式仍会被检查
 * │
 * ├─ package.json 脚本（推荐）⭐
 * │  └─ 通过 glob 明确指定要检查的文件类型（白名单）
 * │     当前：stylelint 使用单个 brace glob，同时覆盖普通目录与点目录
 * │     效果：只检查 .css, .scss, .vue, .html 中的样式，并覆盖所有点目录
 * │     优点：命令行执行时确保只检查指定类型
 * │
 * └─ .vscode/settings.json（必需）⭐
 *    └─ stylelint.validate: ["css", "scss", "vue", "html"]
 *       效果：VS Code 只在这些文件类型中启用 Stylelint
 *       优点：编辑器不会尝试检查其他文件类型
 *
 * 💡 最佳实践：
 * 1. 本文件：只排除目录和明确不需要的路径
 * 2. package.json：用 glob 明确指定文件类型（白名单）
 * 3. .vscode/settings.json：指定 validate 列表（白名单）
 *
 * 与 .vscode/settings.json 中的 stylelint.validate 对应
 */
export default {
  extends: ['stylelint-config-zzjtnb'],
  rules: {
    // 自定义规则
    // 允许 UnoCSS 特有的 at-rules
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'custom-variant', // UnoCSS @custom-variant
          'theme', // UnoCSS @theme
          'apply', // Tailwind/UnoCSS @apply
          'layer', // Tailwind/UnoCSS @layer
          'screen', // Tailwind @screen
          'variants', // Tailwind @variants
          'responsive', // Tailwind @responsive
        ],
      },
    ],
    // 允许 uni-app 的 rpx 单位
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['rpx'],
      },
    ],
  },
  ignoreFiles: [
    // Git 与缓存目录
    '**/.git/**',
    '**/.cache/**',
    // 构建产物
    '**/dist/**',
    '**/stats.html',
    // Tauri 相关
    '**/src-tauri/**',
    // 依赖目录
    '**/node_modules/**',
    // 备份目录
    '**/backup/**/{*,.*}/**',
    // 字体文件（样式检查不适用于字体资源）
    '**/fonts/**',
    '**/coverage/**',
  ],
}
