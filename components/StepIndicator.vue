<script setup lang="ts">
defineProps<{ current: 1 | 2 | 3 }>()

const steps = [
  { n: 1, label: 'Sessions' },
  { n: 2, label: 'Who are you?' },
  { n: 3, label: 'Gift exchange' }
] as const
</script>

<template>
  <ol class="step-indicator">
    <li
      v-for="step in steps"
      :key="step.n"
      class="step-indicator__item"
      :class="{
        'is-active': step.n === current,
        'is-done': step.n < current
      }"
    >
      <span class="step-indicator__bullet">{{ step.n < current ? '✓' : step.n }}</span>
      <span class="step-indicator__label">{{ step.label }}</span>
    </li>
  </ol>
</template>
