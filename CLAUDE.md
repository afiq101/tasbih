# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 web application named "tasbih" using:
- **Vue 3** with Composition API
- **Vite** for build tooling and development server
- **Pinia** for state management
- **Vue Router** for client-side routing
- **Vitest** for unit testing (jsdom environment)
- **pnpm** as the package manager

## Development Commands

**Package manager**: This project uses `pnpm`. Do not use `npm` or `yarn`.

```bash
# Install dependencies
pnpm install

# Development server with hot reload
pnpm dev

# Production build
pnpm build

# Preview production build locally
pnpm preview

# Run all unit tests
pnpm test:unit

# Lint and auto-fix
pnpm lint

# Format code
pnpm format
```

**Node version requirement**: Node.js ^20.19.0 or >=22.12.0 (specified in package.json engines)

## Architecture

### Project Structure

- **`src/main.js`**: Application entry point that initializes Vue app, Pinia, and Vue Router
- **`src/App.vue`**: Root component
- **`src/views/`**: Route-level components (pages)
- **`src/components/`**: Reusable components
- **`src/router/index.js`**: Route definitions using Vue Router
- **`src/stores/`**: Pinia stores for global state management
- **`src/assets/`**: Static assets (CSS, images, etc.)

### Path Alias

The `@` alias points to the `src/` directory (configured in vite.config.js):
```javascript
import Component from '@/components/Component.vue'
```

### Routing Pattern

Routes are defined in `src/router/index.js`:
- Home page component is imported directly
- Other routes use lazy loading with dynamic imports for code splitting:
  ```javascript
  component: () => import('../views/AboutView.vue')
  ```

### State Management Pattern

Pinia stores use the **Composition API style** with `defineStore`:
```javascript
export const useCounterStore = defineStore('counter', () => {
  const state = ref(initialValue)
  const getter = computed(() => /* ... */)
  function action() { /* ... */ }
  return { state, getter, action }
})
```

### Testing

- Tests are located in `src/components/__tests__/` (co-located with components)
- Uses Vitest with `@vue/test-utils` for Vue component testing
- Environment: jsdom (configured in vitest.config.js)
- Test files use `.spec.js` naming convention

### Code Quality Tools

- **ESLint**: Configured with Vue plugin, Vitest plugin, and Prettier integration
- **Prettier**: Handles code formatting (config in .prettierrc.json)
- The lint command includes `--fix` and `--cache` flags for automatic fixes and faster subsequent runs
