# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Progressive Web App (PWA)** for Islamic prayer counting (tasbih) built with:
- **Vue 3** with Composition API (`<script setup>` syntax)
- **Vite** for build tooling and development server
- **Pinia** for state management (Composition API style)
- **Tailwind CSS v4** with shadcn-vue UI components
- **@vueuse/core** for composition utilities
- **vite-plugin-pwa** for PWA functionality
- **pnpm** as the package manager

**Key Features:**
- Single-page application (no router)
- Multiple tasbih counters with history tracking
- Mobile-optimized with vibration, sound, and screen wake features
- Dual reminder system (target reached + periodic)
- Dark mode by default
- Offline-capable PWA
- Data persistence via localStorage

## Development Commands

**Package manager**: This project uses `pnpm`. Do not use `npm` or `yarn`.

```bash
# Install dependencies
pnpm install

# Development server with hot reload
pnpm dev

# Development server exposed to network (for mobile testing)
pnpm dev --host

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

```
src/
├── main.js              # Entry point (initializes Vue app + Pinia, no router)
├── App.vue              # Single-page root component
├── stores/              # Pinia stores (Composition API style)
│   ├── tasbih.js       # Main tasbih logic (CRUD, counter, history)
│   ├── settings.js     # User preferences (theme, vibration, sound, etc.)
│   └── notifications.js # Reminder system (target reached + periodic)
├── composables/         # Vue composables for mobile features
│   ├── useHaptics.js   # Vibration API wrapper
│   ├── useSounds.js    # Web Audio API for sound effects
│   └── useWakeLock.js  # Screen Wake Lock API
├── components/          # Vue components
│   ├── TasbihHeader.vue
│   ├── TasbihSelector.vue
│   ├── TasbihCounter.vue
│   ├── CounterDisplay.vue
│   ├── CounterButton.vue
│   ├── TargetProgress.vue
│   ├── TasbihActions.vue
│   ├── TasbihHistory.vue
│   └── TasbihSettings.vue
├── lib/
│   └── utils.js        # Tailwind utility functions (cn)
└── assets/
    └── main.css        # Tailwind imports + CSS variables
```

### Path Alias

The `@` alias points to the `src/` directory (configured in vite.config.js):
```javascript
import Component from '@/components/Component.vue'
```

### State Management Pattern

Pinia stores use **Composition API style** with `defineStore`:
```javascript
export const useTasbihStore = defineStore('tasbih', () => {
  const state = ref(initialValue)
  const getter = computed(() => /* ... */)
  function action() { /* ... */ }
  return { state, getter, action }
})
```

**Data Persistence:** Uses `@vueuse/core`'s `useStorage` for reactive localStorage:
```javascript
const tasbihs = useStorage('tasbihs', [], localStorage, {
  serializer: { read: (v) => v ? JSON.parse(v) : [], write: (v) => JSON.stringify(v) }
})
```

### Styling

**Tailwind CSS v4** with PostCSS:
- Configuration: `tailwind.config.js`
- PostCSS uses `@tailwindcss/postcss` plugin
- CSS variables for theming (light/dark mode)
- Import style: `@import "tailwindcss";` in main.css

**Important:** Use inline styles with CSS variables for dynamic colors:
```vue
style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground))"
```

### PWA Configuration

- **Plugin:** `vite-plugin-pwa` (configured in vite.config.js)
- **Service Worker:** Auto-generated with workbox
- **Manifest:** Defined inline in vite config
- **Icons needed:** `pwa-192x192.png`, `pwa-512x512.png`, `apple-touch-icon.png` in `/public`
- **Install:** App can be installed to home screen on mobile devices

### Mobile Features

**Vibration (Android only):**
- Uses Navigator Vibration API
- Controlled via `useHaptics()` composable
- Patterns: `lightTap()`, `successPattern()`, etc.

**Sound Effects:**
- Uses Web Audio API (generated beeps, no audio files)
- Controlled via `useSounds()` composable
- Plays on count increment and target reached

**Screen Wake Lock:**
- Uses Screen Wake Lock API
- Controlled via `useWakeLock()` composable
- Keeps screen on while app is active (if enabled in settings)

**Notification System:**
- Target reached: Shows when count >= target
- Periodic reminders: Configurable interval (minutes)
- Requires permission request on first use

### Data Structure

**Tasbih Object:**
```javascript
{
  id: string,
  name: string,
  targetCount: number,
  currentCount: number,
  createdAt: timestamp,
  updatedAt: timestamp,
  history: [
    {
      id: string,
      count: number,
      targetCount: number,
      completedAt: timestamp,
      completed: boolean
    }
  ]
}
```

**Settings Object:**
```javascript
{
  vibrationEnabled: boolean,
  soundEnabled: boolean,
  keepScreenAwake: boolean,
  notificationsEnabled: boolean,
  reminderInterval: number, // minutes
  reminderEnabled: boolean,
  theme: 'dark' | 'light'  // default: 'dark'
}
```

### Theme System

- **Default:** Dark mode
- **Class-based:** Adds/removes `.dark` class on `document.documentElement`
- **Watcher:** Watches `settings.theme` and applies class dynamically
- **CSS Variables:** Defined in `src/assets/main.css` for both light and dark modes

### Code Quality Tools

- **ESLint**: Configured with Vue plugin, Vitest plugin, and Prettier integration
- **Prettier**: Handles code formatting (config in .prettierrc.json)
- The lint command includes `--fix` and `--cache` flags for automatic fixes and faster subsequent runs

## Common Development Patterns

### Adding a New Store Action

```javascript
// In src/stores/tasbih.js
function newAction(id) {
  const tasbih = tasbihs.value.find(t => t.id === id)
  if (tasbih) {
    // Modify tasbih
    tasbih.updatedAt = Date.now()
  }
}

// Return it
return {
  // ... other exports
  newAction
}
```

### Using Store in Component

```vue
<script setup>
import { useTasbihStore } from '@/stores/tasbih'

const tasbihStore = useTasbihStore()

function handleClick() {
  tasbihStore.increment(tasbihStore.activeTasbih.id)
}
</script>
```

### Styling Components

Use inline styles for dynamic colors to ensure proper theming:
```vue
<div :style="{ backgroundColor: 'hsl(var(--background))' }">
  <!-- Content -->
</div>
```

Or use Tailwind classes for static styles:
```vue
<div class="p-4 rounded-lg flex items-center gap-3">
  <!-- Content -->
</div>
```

## Testing

- Tests are located in `src/components/__tests__/` (co-located with components)
- Uses Vitest with `@vue/test-utils` for Vue component testing
- Environment: jsdom (configured in vitest.config.js)
- Test files use `.spec.js` naming convention

## Important Notes

- **No Router:** This is a single-page app. Do not add Vue Router.
- **Mobile First:** All designs should be mobile-optimized (max-width: 28rem container)
- **Touch Targets:** Minimum 44x44px for all interactive elements
- **iOS Limitations:** Vibration API doesn't work on iOS Safari (Android only)
- **Wake Lock:** Requires HTTPS in production (localhost works for dev)
- **localStorage:** All data stored locally, no backend/API
