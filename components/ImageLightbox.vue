<script setup lang="ts">
defineProps<{ src: string }>()
const emit = defineEmits<{ close: [] }>()

onKeyStroke('Escape', () => emit('close'))
</script>

<template>
  <div class="lightbox-overlay" @click.self="emit('close')">
    <button class="lightbox-close" type="button" @click="emit('close')" aria-label="Close">✕</button>
    <img :src="src" class="lightbox-image" alt="" />
  </div>
</template>
