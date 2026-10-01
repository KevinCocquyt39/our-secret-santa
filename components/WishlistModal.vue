<script setup lang="ts">
import type { Guest } from '~/types'

const props = defineProps<{ sessionId: string; guest: Guest }>()
const emit = defineEmits<{ close: [] }>()

const store = useSessionsStore()

const title = ref('')
const link = ref('')
const error = ref('')

function addItem() {
  const trimmedTitle = title.value.trim()
  const trimmedLink = link.value.trim()

  if (!trimmedTitle || !trimmedLink) {
    error.value = 'Add both a title and a link.'
    return
  }

  store.addWishlistItem(props.sessionId, props.guest.id, trimmedTitle, trimmedLink)
  title.value = ''
  link.value = ''
  error.value = ''
}

function removeItem(itemId: string) {
  store.removeWishlistItem(props.sessionId, props.guest.id, itemId)
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <h2 class="card-title">🎀 {{ guest.name }}'s wishlist</h2>
      <p class="modal-subtitle">Add presents you'd love to receive, with a link to the shop.</p>

      <ul v-if="guest.wishlist.length" class="wishlist-items wishlist-items--editable">
        <li v-for="item in guest.wishlist" :key="item.id" class="wishlist-item">
          <a :href="item.link" target="_blank" rel="noopener noreferrer">{{ item.title }} ↗</a>
          <button class="icon-btn" title="Remove" @click="removeItem(item.id)">✕</button>
        </li>
      </ul>
      <p v-else class="empty-state">Your wishlist is empty — add your first present below.</p>

      <form class="form" @submit.prevent="addItem">
        <label class="field">
          <span class="field-label">Present title</span>
          <input v-model="title" type="text" class="input" placeholder="e.g. Cozy knit sweater" />
        </label>
        <label class="field">
          <span class="field-label">Shop link</span>
          <input v-model="link" type="url" class="input" placeholder="https://..." />
        </label>
        <p v-if="error" class="form-error">{{ error }}</p>
        <button type="submit" class="btn btn-primary">+ Add to wishlist</button>
      </form>

      <div class="modal-actions">
        <button class="btn btn-ghost" @click="emit('close')">Done</button>
      </div>
    </div>
  </div>
</template>
