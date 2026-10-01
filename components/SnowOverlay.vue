<script setup lang="ts">
interface Flake {
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  opacity: number
}

const flakes: Flake[] = Array.from({ length: 45 }, () => ({
  left: Math.random() * 100,
  size: 4 + Math.random() * 8,
  duration: 10 + Math.random() * 14,
  delay: Math.random() * -20,
  drift: (Math.random() - 0.5) * 120,
  opacity: 0.35 + Math.random() * 0.5
}))
</script>

<template>
  <div class="snow-overlay" aria-hidden="true">
    <span
      v-for="(flake, i) in flakes"
      :key="i"
      class="snowflake"
      :style="{
        left: flake.left + '%',
        width: flake.size + 'px',
        height: flake.size + 'px',
        opacity: flake.opacity,
        animationDuration: flake.duration + 's',
        animationDelay: flake.delay + 's',
        '--drift': flake.drift + 'px'
      }"
    />
  </div>
</template>
