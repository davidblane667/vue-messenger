import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '*.config.js'] },

  // JS base
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,

  // Vue 3
  ...pluginVue.configs['flat/recommended'],

  // Prettier: отключает конфликтующие ESLint-правила
  prettierConfig,

  // Prettier как ESLint-правило
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // Общие правила проекта
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    rules: {
      // Запрет any — ключевое правило проекта
      '@typescript-eslint/no-explicit-any': 'error',

      // Обязательный import type для типов
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Не разрешать неиспользуемые переменные (кроме _ префикса)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Vue: self-closing для компонентов без слотов
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'never', component: 'always' },
          svg: 'always',
          math: 'always',
        },
      ],

      // Vue: порядок атрибутов компонента
      'vue/attributes-order': 'error',

      // Vue: один компонент на файл
      'vue/one-component-per-file': 'error',

      // Vue: block-order в SFC (script → template → style)
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
    },
  },
)
