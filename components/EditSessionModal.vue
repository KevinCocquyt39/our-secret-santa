<script setup lang="ts">
import type { SecretSantaSession } from '~/types'

interface GuestRow {
  id?: string
  name: string
}

const props = defineProps<{ session: SecretSantaSession }>()
const emit = defineEmits<{ close: [] }>()

const store = useSessionsStore()

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

function save() {
  const trimmedName = name.value.trim()
  const validGuests = guestRows.value.filter((r) => r.name.trim())

  if (!trimmedName) {
    error.value = 'Give your gift exchange a name.'
    return
  }
  if (validGuests.length < 2) {
    error.value = 'Keep at least two guests.'
    return
  }

  store.updateSession(props.session.id, trimmedName, guestRows.value)
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <h2 class="card-title">✏️ Edit session</h2>
      <p class="modal-warning">⚠️ Saving will reset everyone's Secret Santa draw. Wishlists are kept.</p>

      <label class="field">
        <span class="field-label">Exchange name</span>
        <input v-model="name" type="text" class="input" />
      </label>

      <div class="field">
        <span class="field-label">Guests</span>
        <div v-for="(row, i) in guestRows" :key="row.id ?? `new-${i}`" class="guest-input-row">
          <input v-model="row.name" type="text" class="input" :placeholder="`Guest ${i + 1} name`" />
          <button v-if="guestRows.length > 2" type="button" class="icon-btn" title="Remove" @click="removeRow(i)">
            ✕
          </button>
        </div>
        <button type="button" class="btn btn-ghost" @click="addRow">+ Add guest</button>
      </div>

      <p v-if="error" class="form-error">{{ error }}</p>

      <div class="modal-actions">
        <button class="btn btn-ghost" @click="emit('close')">Cancel</button>
        <button class="btn btn-primary" @click="save">Save changes</button>
      </div>
    </div>
  </div>
</template>
