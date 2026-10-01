<script setup lang="ts">
const { locale, locales, t } = useI18n()
</script>

<template>
  <header class="app-header">
    <NuxtLink to="/" class="brand">
      <span class="brand-icon">🎄</span>
      <span class="brand-text">
        <span class="brand-title">Our Secret Santa</span>
        <span class="brand-subtitle">{{ t('header.subtitle') }}</span>
      </span>
    </NuxtLink>

    <div class="lang-switcher" role="group" aria-label="Language">
      <button v-for="code in locales" :key="code" type="button" class="lang-switcher__btn"
        :class="{ 'is-active': locale === code }" @click="locale = code">
        {{ code.toUpperCase() }}
      </button>
    </div>
  </header>
</template>