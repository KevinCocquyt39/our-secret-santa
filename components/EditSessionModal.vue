<script setup lang="ts">
import type { SecretSantaSession } from '~/types'

interface GuestRow {
  id?: string
  name: string
}

const props = defineProps<{ session: SecretSantaSession }>()
const emit = defineEmits<{ close: [] }>()

const store = useSessionsStore()
const { t } = useI18n()

const name = ref(props.session.name)
const guestRows = ref<GuestRow[]>(props.session.guests.map((g) => ({ id: g.id, name: g.name })))
const error = ref('')

function addRow() {
  guestRows.value.push({ name: '' })
}

function removeRow(index: number) {
  if (guestRows.value.length <= 2) return
  guestRows.value.splice(index, 1)
}

async function save() {
  const trimmedName = name.value.trim()
  const validGuests = guestRows.value.filter((r) => r.name.trim())

  if (!trimmedName) {
    error.value = t('index.errorName')
    return
  }
  if (validGuests.length < 2) {
    error.value = t('editSession.errorGuests')
    return
  }

  await store.updateSession(props.session.id, trimmedName, guestRows.value)
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <h2 class="card-title">{{ t('editSession.title') }}</h2>
      <p class="modal-warning">{{ t('editSession.warning') }}</p>

      <label class="field">
        <span class="field-label">{{ t('index.fieldExchangeName') }}</span>
        <input v-model="name" type="text" class="input" />
      </label>

      <div class="field">
        <span class="field-label">{{ t('index.fieldGuests') }}</span>
        <div v-for="(row, i) in guestRows" :key="row.id ?? `new-${i}`" class="guest-input-row">
          <input v-model="row.name" type="text" class="input"
            :placeholder="t('index.placeholderGuestName', { n: i + 1 })" />
          <button v-if="guestRows.length > 2" type="button" class="icon-btn" :title="t('common.remove')"
            @click="removeRow(i)">
            ✕
          </button>
        </div>
        <button type="button" class="btn btn-ghost" @click="addRow">{{ t('editSession.addGuest') }}</button>
      </div>

      <p v-if="error" class="form-error">{{ error }}</p>

      <div class="modal-actions">
        <button class="btn btn-ghost" @click="emit('close')">{{ t('common.cancel') }}</button>
        <button class="btn btn-primary" @click="save">{{ t('editSession.save') }}</button>
      </div>
    </div>
  </div>
</template>