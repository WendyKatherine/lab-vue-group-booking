<script setup lang="ts">
import ThemeWindowControls from '@/components/ThemeWindowControls.vue'
import { useTheme } from '@/composables/useTheme'

const { activeTheme, setTheme } = useTheme()
</script>

<template>
  <div class="rt-app-shell flex flex-col h-screen overflow-hidden">

    <div class="rt-toolbar rt-window__titlebar shrink-0 mb-6">
      <div class="rt-toolbar__group flex items-center gap-3">
        <span class="rt-badge">Laboratory #2</span>
      </div>
      <ThemeWindowControls :activeTheme="activeTheme" @update:activeTheme="setTheme" />
    </div>
    <div class="flex flex-col gap-0.5 mb-6">
      <h1 id="theme-title"
          className="m-3 text-4xl font-semibold tracking-tight text-[var(--rt-text)]">
        group-booking
      </h1>
      <p 
        style=" 
          margin: 0;
          color: var(--rt-text-muted);
          font-size: var(--rt-text-sm);
          padding-inline: var(--rt-space-1);
      ">
        Group creation · participant management · stay assignment
      </p>
    </div>

    <div class="flex-1 overflow-hidden min-h-0">
      <RouterView />
    </div>

  </div>
</template>
