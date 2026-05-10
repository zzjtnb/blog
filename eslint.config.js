import antfu from '@antfu/eslint-config'

/**
 * ESLint 配置文件 - 基于 @antfu/eslint-config
 *
 * @antfu/eslint-config 特点：
 * - 自动格式化（无需 Prettier）
 * - 开箱即用支持 TypeScript, JSX, Vue, JSON, YAML, Markdown 等
 * - 使用 ESLint Flat Config（新格式）
 * - 默认遵循 .gitignore
 * - 需要 ESLint v9.5.0+
 *
 * 官方文档：https://github.com/antfu/eslint-config
 */

// 全局忽略规则：这些路径会被所有 ESLint 规则跳过。
const ignores = [
  'backup',
  '**/node_modules',
  '**/dist',
  '**/.next',
  '**/.turbo',
  '**/.output',
  '**/stats.html',
  'pnpm-workspace.yaml',
]

export default antfu(
  // ==================== 第一个参数：@antfu/eslint-config 预设配置（控制预设行为）====================
  //
  // ⚠️ 重要说明：这个参数 VS 第二个参数的区别
  //
  // 📌 第一个参数（这里）：
  // - 类型：PresetOptions（@antfu/eslint-config 特有的配置接口）
  // - 作用：控制预设的行为（启用/禁用 Vue、TypeScript、UnoCSS 等）
  // - 可用选项：typescript, vue, react, unocss, formatters, ignores, stylistic 等
  // - ❌ 不能直接写：rules, files, plugins, languageOptions 等标准 ESLint 选项
  //
  // 📌 第二个参数及之后（下面）：
  // - 类型：ESLint Flat Config（标准 ESLint 配置对象）
  // - 作用：自定义 ESLint 规则、文件匹配、插件等
  // - 可用选项：rules, files, ignores, plugins, languageOptions 等
  // - ✅ 可以写：任何标准 ESLint Flat Config 选项
  //
  // 🔍 能否互换？
  // ❌ 不能！第一个参数只接受 PresetOptions，不接受 rules 等标准选项
  // ❌ 不能在第一个参数中写 rules: { 'no-console': 'off' }
  // ✅ 必须在第二个参数中写自定义规则
  {
    // 全局忽略规则
    ignores,
    /**
     * 启用 UnoCSS 支持
     * - 自动修复 UnoCSS 类名顺序
     * - 需要安装：@unocss/eslint-plugin
     */
    unocss: true,

    /**
     * 启用 TypeScript 支持（自动检测）
     * - 启用 TypeScript 相关规则
     * - 支持 .ts, .tsx, .mts, .cts 文件
     * - 自动检测 tsconfig.json
     */
    typescript: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
    },

    /**
     * 启用 Vue 支持（自动检测）
     * - 支持 Vue 3 Composition API
     * - 支持 <script setup> 语法
     * - 支持 .vue 文件
     * - 自动检测 vue 依赖
     */
    vue: true,

    /**
     * 禁用 Markdown 支持
     * - false: 不检查 Markdown 文件中的代码块
     * - true: 检查 Markdown 文件中的代码块
     * 默认值：true
     * 我们使用 markdownlint-cli 来检查 Markdown
     */
    markdown: false,

    /**
     * 禁用编辑器模式
     * - false: 所有规则都生效（适合 CI/CD）
     * - true: 编辑器中某些规则会被禁用（适合开发）
     * 默认值：false
     */
    isInEditor: false,

    /**
     * 格式化器配置
     * 用于格式化 ESLint 无法处理的文件（.css, .html 等）
     * 需要安装：eslint-plugin-format
     *
     * ⚠️ 重要区别：
     * - formatters 只控制格式化（Formatting），不影响检查（Linting）
     * - 要完全禁用某类型文件的检查，需要在顶级配置中设置（如 markdown: false）
     *
     * 每个格式化器的可选值：'prettier' | 'dprint' | true | false
     * 默认值：false（不启用任何格式化器）
     */
    formatters: {
      /**
       * CSS/LESS/SCSS/Sass 格式化
       * - 默认值：false
       * - 当前设置：false（我们使用 Stylelint）
       */
      // css: false,

      /**
       * HTML 格式化
       * - 默认值：false
       * - 当前设置：true
       */
      html: true,

      /**
       * XML 格式化
       * - 默认值：false
       * - 当前设置：false（未使用 XML）
       */
      // xml: false,

      /**
       * SVG 格式化
       * - 默认值：false
       * - 当前设置：false（未使用 SVG）
       */
      // svg: false,

      /**
       * Markdown 格式化
       * - 可选值：'prettier' | 'dprint' | true | false
       * - 默认值：false
       * - 当前设置：false（我们使用 markdownlint-cli）
       * ⚠️ 注意：formatters.markdown: false 只禁用格式化，不影响代码块检查
       *         要完全禁用 Markdown 检查，需在顶级设置 markdown: false
       */
      // markdown: false,

      /**
       * GraphQL 格式化
       * - 默认值：false
       * - 当前设置：false（未使用 GraphQL）
       */
      // graphql: false,

      // 格式化器自定义选项（可选）
      // prettierOptions: {},  // 自定义 Prettier 配置
      // dprintOptions: {},    // 自定义 dprint 配置
      // 忽略规则已经在全局设置
    },

    // ========== 其他可用选项（未使用） ==========
    //
    // type: 'app' | 'lib'
    // - 项目类型
    // - 默认值：'app'
    //
    // stylistic: boolean | object
    // - 启用代码风格规则（缩进、引号等）
    // - 默认值：false
    // - 示例：{ indent: 2, quotes: 'single' }
    //
    // jsonc: boolean
    // - 启用 JSON/JSONC 支持
    // - 默认值：true
    //
    // yaml: boolean
    // - 启用 YAML 支持
    // - 默认值：true
    //
    // react: boolean
    // - 启用 React 支持
    // - 默认值：false
    //
    // ignores: string[] ⚠️ 全局忽略
    // - 在 antfu() 第一个参数中设置
    // - 作用域：全局，完全跳过这些文件
    // - 相当于传统的 .eslintignore 文件
    // - ESLint 不会对这些文件执行任何检查
    // - 示例：['build/**', 'dist/**', 'node_modules/**']
    // - 优先级：最高（这些文件会被所有规则忽略）
    //
    // ⚠️ 配置层级说明：
    // - 顶级选项（如 typescript, vue, markdown）控制是否检查该类型文件
    // - formatters 选项只控制格式化，不影响检查
    // - 例：markdown: false → 不检查 Markdown
    //      formatters.markdown: false → 不格式化 Markdown（但仍会检查）
  },

  // ==================== 第二个参数及之后：自定义 ESLint Flat Config ====================
  {
    /**
     * 指定要检查的文件类型
     * - 命令行和 VS Code 都会遵循这个配置
     * - 与 .vscode/settings.json 中的 eslint.validate 对应
     */
    files: [
      // JavaScript
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      // TypeScript
      '**/*.ts',
      '**/*.cts',
      '**/*.mts',
      // Vue
      '**/*.vue',
      // HTML
      '**/*.html',
      // JSON
      '**/*.json',
      '**/*.json5',
      '**/*.jsonc',
      // YAML
      '**/*.yaml',
      '**/*.yml',
      // TOML
      '**/*.toml',
      // XML
      '**/*.xml',
    ],

    /**
     * ESLint 插件设置
     * - 用于配置第三方插件的行为
     */
    settings: {
      /**
       * UnoCSS 配置
       * - 明确指定配置文件路径
       * - 确保命令行和 VS Code 都能正确加载
       * - 相对于项目根目录
       * - 与 .vscode/settings.json 中的 eslint.options.settings.unocss 对应
       */
      // unocss: {
      //   configPath: 'uno.config.ts',
      // },
    },

    /**
     * 自定义规则
     * 覆盖或添加 ESLint 规则
     */
    rules: {
      /**
       * 允许使用 console
       * - 可选值：'off' | 'warn' | 'error'
       * - 默认值：'error'
       * - 当前设置：'off'
       */
      'no-console': 'off',
    },
    // ignores: string[] 当前配置链中
  },

  // 如后续有特定文件需要覆盖规则，可在这里追加标准 ESLint Flat Config 对象。
  // 💡 记忆口诀：
  // - 第一个参数 = "预设开关" - 控制 @antfu/eslint-config 的行为
  // - 第二个参数 = "自定义规则" - 标准 ESLint Flat Config
)
