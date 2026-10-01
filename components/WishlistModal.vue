<script setup lang="ts">
import type { Guest } from '~/types'

const props = defineProps<{ sessionId: string; guest: Guest }>()
const emit = defineEmits<{ close: [] }>()

const store = useSessionsStore()
const { t } = useI18n()

const title = ref('')
const link = ref('')
const imageDataUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const error = ref('')
const lightboxImage = ref<string | null>(null)

async function onImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    imageDataUrl.value = await resizeImageToDataUrl(file)
  } catch {
    error.value = t('wishlist.imageError')
    imageDataUrl.value = null
  }
}

async function addItem() {
  const trimmedTitle = title.value.trim()
  const trimmedLink = link.value.trim()

  if (!trimmedTitle || !trimmedLink) {
    error.value = t('wishlist.error')
    return
  }

  await store.addWishlistItem(props.sessionId, props.guest.id, trimmedTitle, trimmedLink, imageDataUrl.value ?? undefined)
  title.value = ''
  link.value = ''
  imageDataUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
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
          <button
            v-if="item.imageUrl"
            type="button"
            class="wishlist-item-thumb"
            :title="t('wishlist.viewLarger')"
            @click="lightboxImage = item.imageUrl!"
          >
            <img :src="item.imageUrl" alt="" />
          </button>
          <a :href="item.link" target="_blank" rel="noopener noreferrer" class="wishlist-item-link">{{ item.title }} ↗</a>
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
        <label class="field">
          <span class="field-label">{{ t('wishlist.fieldImage') }}</span>
          <input ref="fileInput" type="file" accept="image/*" class="file-input" @change="onImageChange" />
          <img v-if="imageDataUrl" :src="imageDataUrl" class="image-preview" alt="" />
        </label>
        <p v-if="error" class="form-error">{{ error }}</p>
        <button type="submit" class="btn btn-primary">{{ t('wishlist.addButton') }}</button>
      </form>

      <div class="modal-actions">
        <button class="btn btn-ghost" @click="emit('close')">{{ t('common.done') }}</button>
      </div>
    </div>
  </div>

  <ImageLightbox v-if="lightboxImage" :src="lightboxImage" @close="lightboxImage = null" />
</template>