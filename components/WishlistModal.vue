<script setup lang="ts">
import type { Guest } from '~/types'

const props = defineProps<{ sessionId: string; guest: Guest }>()
const emit = defineEmits<{ close: [] }>()

const store = useSessionsStore()
const { t } = useI18n()

const title = ref('')
const link = ref('')
const error = ref('')

async function addItem() {
  const trimmedTitle = title.value.trim()
  const trimmedLink = link.value.trim()

  if (!trimmedTitle || !trimmedLink) {
    error.value = t('wishlist.error')
    return
  }

  await store.addWishlistItem(props.sessionId, props.guest.id, trimmedTitle, trimmedLink)
  title.value = ''
  link.value = ''
  error.value = ''
}

async function removeItem(itemId: string) {
  await store.removeWishlistItem(props.sessionId, props.guest.id, itemId)
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <h2 class="card-title">{{ t('wishlist.title', { name: guest.name }) }}</h2>
      <p class="modal-subtitle">{{ t('wishlist.subtitle') }}</p>

      <ul v-if="guest.wishlist.length" class="wishlist-items wishlist-items--editable">
        <li v-for="item in guest.wishlist" :key="item.id" class="wishlist-item">
          <a :href="item.link" target="_blank" rel="noopener noreferrer">{{ item.title }} ↗</a>
          <button class="icon-btn" :title="t('common.remove')" @click="removeItem(item.id)">✕</button>
        </li>
      </ul>
      <p v-else class="empty-state">{{ t('wishlist.empty') }}</p>

      <form class="form" @submit.prevent="addItem">
        <label class="field">
          <span class="field-label">{{ t('wishlist.fieldTitle') }}</span>
          <input v-model="title" type="text" class="input" :placeholder="t('wishlist.placeholderTitle')" />
        </label>
        <label class="field">
          <span class="field-label">{{ t('wishlist.fieldLink') }}</span>
          <input v-model="link" type="url" class="input" :placeholder="t('wishlist.placeholderLink')" />
        </label>
        <p v-if="error" class="form-error">{{ error }}</p>
        <button type="submit" class="btn btn-primary">{{ t('wishlist.addButton') }}</button>
      </form>

      <div class="modal-actions">
        <button class="btn btn-ghost" @click="emit('close')">{{ t('common.done') }}</button>
      </div>
    </div>
  </div>
</template>