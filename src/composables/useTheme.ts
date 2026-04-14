import { ref } from 'vue'

export type Theme = 'phosphor' | 'ivory' | 'bigblue'

const STORAGE_KEY = 'rt-theme'
const DEFAULT_THEME: Theme = 'phosphor'

function isValidTheme(value: unknown): value is Theme {
  return value === 'phosphor' || value === 'ivory' || value === 'bigblue'
}

export function useTheme() {
  const stored = localStorage.getItem(STORAGE_KEY)
  const initial: Theme = isValidTheme(stored) ? stored : DEFAULT_THEME

  const activeTheme = ref<Theme>(initial)
  document.documentElement.setAttribute('data-rt-theme', initial)

  function setTheme(theme: Theme): void {
    activeTheme.value = theme
    document.documentElement.setAttribute('data-rt-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }

  return { activeTheme, setTheme }
}
