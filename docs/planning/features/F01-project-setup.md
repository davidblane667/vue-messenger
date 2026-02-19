# F01 — Инициализация проекта

**Фаза:** 1
**Зависит от:** —
**Блокирует:** F02, F03, F04, F05

---

## Цель

Создать рабочее окружение: Vite + Vue 3 + TS + Pinia + Vue Router + SCSS + ESLint + Prettier. После этой фичи: `npm run dev` запускает пустое приложение без ошибок, `npm run lint` проходит чисто.

---

## Шаги

### 1. Создание проекта

```bash
npm create vite@latest vue-messenger -- --template vue-ts
cd vue-messenger
npm install
npm install pinia@^3 vue-router@4
npm install pinia-plugin-persistedstate  # требует pinia@^3
npm install -D sass
npm install -D eslint prettier
npm install -D @eslint/js typescript-eslint eslint-plugin-vue
npm install -D eslint-config-prettier eslint-plugin-prettier
```

### 2. tsconfig.json — строгие правила

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

### 3. vite.config.ts

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Автоимпорт переменных и миксинов в каждый .scss
        additionalData: `
          @use "@/styles/variables" as *;
          @use "@/styles/mixins" as *;
        `,
      },
    },
  },
})
```

### 4. Структура папок

```bash
mkdir -p src/{types,constants,services,utils,stores,composables,router,views,styles}
mkdir -p src/components/{ui,layout,chat-list,chat-window}
mkdir -p src/__tests__/{services,stores,composables,utils}
```

### 5. Базовые стили

**`src/styles/_variables.scss`**
```scss
// Цвета
$color-primary: #4f86f7;
$color-primary-hover: #3a6fd8;
$color-bg: #f0f2f5;
$color-surface: #ffffff;
$color-border: #e0e0e0;
$color-text: #1a1a1a;
$color-text-secondary: #666666;
$color-online: #4caf50;
$color-offline: #bdbdbd;
$color-msg-out: #dcf8c6;
$color-msg-in: #ffffff;
$color-badge: #ef5350;

// Размеры
$chat-list-width: 320px;
$header-height: 60px;
$input-area-height: 72px;
$avatar-size-md: 42px;
$avatar-size-sm: 32px;

// Прочее
$border-radius-bubble: 16px;
$transition-fast: 0.15s ease;
$mobile-breakpoint: 768px;
```

**`src/styles/_mixins.scss`**
```scss
@mixin mobile {
  @media (max-width: $mobile-breakpoint) { @content; }
}

@mixin desktop {
  @media (min-width: calc($mobile-breakpoint + 1px)) { @content; }
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@mixin scrollbar-thin {
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: $color-border; border-radius: 2px; }
}
```

**`src/styles/_reset.scss`**
```scss
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }
html, body { height: 100%; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
a { text-decoration: none; color: inherit; }
button { cursor: pointer; border: none; background: none; font: inherit; }
ul, ol { list-style: none; }
```

**`src/styles/main.scss`**
```scss
@use 'reset';

body {
  background: $color-bg;
  color: $color-text;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

#app {
  height: 100%;
  display: flex;
}
```

### 6. ESLint — eslint.config.ts

```ts
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },

  // JS base
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,

  // Vue 3
  ...pluginVue.configs['flat/recommended'],

  // Prettier (отключает конфликтующие ESLint-правила, добавляет prettier как правило)
  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: { 'prettier/prettier': 'error' },
  },

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
      // Запрет any — дублируем из tsconfig для уверенности
      '@typescript-eslint/no-explicit-any': 'error',

      // Обязательный import type для типов
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],

      // Vue: один компонент на файл
      'vue/one-component-per-file': 'error',

      // Vue: порядок атрибутов (стандартный)
      'vue/attributes-order': 'error',

      // Vue: self-closing для компонентов без слотов
      'vue/html-self-closing': ['error', { html: { void: 'always' } }],
    },
  },
)
```

### 7. Prettier — .prettierrc

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "vueIndentScriptAndStyle": true
}
```

### 8. .prettierignore

```
dist
node_modules
*.md
```

### 9. Скрипты в package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit",
    "lint": "eslint . --ext .ts,.vue",
    "lint:fix": "eslint . --ext .ts,.vue --fix",
    "format": "prettier --write \"src/**/*.{ts,vue,scss}\"",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

### 10. main.ts

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import '@/styles/main.scss'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
```

### 11. App.vue (минимальный)

```vue
<template>
  <RouterView />
</template>
```

---

## Критерий готовности

- [ ] `npm run dev` — без ошибок, пустая страница
- [ ] `npm run type-check` — без ошибок TypeScript
- [ ] `npm run lint` — без ошибок ESLint
- [ ] `npm run format` — Prettier не делает изменений (код уже отформатирован)
- [ ] Алиас `@/` работает
- [ ] SCSS-переменные доступны во всех компонентах без явного импорта
- [ ] `pinia-plugin-persistedstate` подключён в `main.ts`
- [ ] `eslint.config.ts` и `.prettierrc` в корне проекта
