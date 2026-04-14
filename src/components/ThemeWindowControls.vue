<script setup lang="ts">
import type { Theme } from '@/composables/useTheme'

interface ThemeDot {
  id: Theme
  label: string
  color: string
  ringColor: string
}

const THEME_DOTS: ThemeDot[] = [
  { id: 'phosphor', label: 'Switch to phosphor theme', color: '#c7d95a', ringColor: '#4f6f13' },
  { id: 'ivory',    label: 'Switch to ivory theme',    color: '#e8e5dd', ringColor: '#5f7488' },
  { id: 'bigblue',  label: 'Switch to bigblue theme',  color: '#4ea0e8', ringColor: '#0f66b8' },
]

defineProps<{ activeTheme: Theme }>()
const emit = defineEmits<{ 'update:activeTheme': [theme: Theme] }>()
</script>

<template>
  <div class="rt-window__controls rt-theme-controls" role="group" aria-label="Theme selector">
    <button
      v-for="dot in THEME_DOTS"
      :key="dot.id"
      type="button"
      :class="['rt-theme-control', { 'is-active': activeTheme === dot.id }]"
      :aria-label="dot.label"
      :aria-pressed="activeTheme === dot.id"
      :title="dot.label"
      :style="{ '--rt-theme-dot-color': dot.color, '--rt-theme-dot-ring': dot.ringColor }"
      @click="emit('update:activeTheme', dot.id)"
    >
      <span class="rt-theme-control__dot" aria-hidden="true" />
    </button>
  </div>
</template>
