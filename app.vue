<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="app-shell">
    <SnowOverlay />
    <AppHeader />
    <main class="app-main">
      <NuxtPage />
    </main>
    <footer class="app-footer">
      <p>{{ t('footer.tagline') }}</p>
    </footer>
  </div>
</template>