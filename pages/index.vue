<script setup lang="ts">
const store = useSessionsStore()

const newSessionName = ref('')
const guestNameInputs = ref<string[]>(['', ''])
const formError = ref('')

const sessions = computed(() =>
  [...store.sessions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
)

function addGuestInput() {
  guestNameInputs.value.push('')
}

function removeGuestInput(index: number) {
  if (guestNameInputs.value.length <= 2) return
  guestNameInputs.value.splice(index, 1)
}

function createSession() {
  const name = newSessionName.value.trim()
  const guests = guestNameInputs.value.map((n) => n.trim()).filter(Boolean)

  if (!name) {
    formError.value = 'Give your gift exchange a name.'
    return
  }
  if (guests.length < 2) {
    formError.value = 'Add at least two guests to draw names.'
    return
  }

  formError.value = ''
  const id = store.createSession(name, guests)
  newSessionName.value = ''
  guestNameInputs.value = ['', '']
  navigateTo(`/sessions/${id}`)
}

function confirmDelete(id: string, name: string) {
  if (confirm(`Delete "${name}"? This cannot be undone.`)) {
    store.deleteSession(id)
  }
}
</script>

<template>
  <section class="page">
    <StepIndicator :current="1" />

    <div class="page-grid">
      <div class="card create-card">
        <h2 class="card-title">🎁 Start a new exchange</h2>
        <p class="card-subtitle">Name your exchange and list everyone who's joining.</p>

        <form class="form" @submit.prevent="createSession">
          <label class="field">
            <span class="field-label">Exchange name</span>
            <input v-model="newSessionName" type="text" class="input" placeholder="e.g. Family Christmas 2026" />
          </label>

          <div class="field">
            <span class="field-label">Guests</span>
            <div v-for="(_, i) in guestNameInputs" :key="i" class="guest-input-row">
              <input v-model="guestNameInputs[i]" type="text" class="input" :placeholder="`Guest ${i + 1} name`" />
              <button
                v-if="guestNameInputs.length > 2"
                type="button"
                class="icon-btn"
                title="Remove"
                @click="removeGuestInput(i)"
              >
                ✕
              </button>
            </div>
            <button type="button" class="btn btn-ghost" @click="addGuestInput">+ Add another guest</button>
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <button type="submit" class="btn btn-primary">Create session 🎄</button>
        </form>
      </div>

      <div class="sessions-list">
        <h2 class="card-title">🔔 Your sessions</h2>
        <p v-if="!sessions.length" class="empty-state">No sessions yet — create your first one to get started!</p>

        <ul v-else class="session-cards">
          <li v-for="session in sessions" :key="session.id" class="session-card">
            <NuxtLink :to="`/sessions/${session.id}`" class="session-card-link">
              <h3>{{ session.name }}</h3>
              <p>{{ session.guests.length }} guests</p>
              <p class="session-card-date">Created {{ new Date(session.createdAt).toLocaleDateString() }}</p>
            </NuxtLink>
            <button class="icon-btn" title="Delete session" @click="confirmDelete(session.id, session.name)">🗑</button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
