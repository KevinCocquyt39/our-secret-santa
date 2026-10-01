<script setup lang="ts">
const store = useSessionsStore()
const { t, locale } = useI18n()

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

async function createSession() {
  const name = newSessionName.value.trim()
  const guests = guestNameInputs.value.map((n) => n.trim()).filter(Boolean)

  if (!name) {
    formError.value = t('index.errorName')
    return
  }
  if (guests.length < 2) {
    formError.value = t('index.errorGuests')
    return
  }

  formError.value = ''
  const id = await store.createSession(name, guests)
  newSessionName.value = ''
  guestNameInputs.value = ['', '']
  navigateTo(`/sessions/${id}`)
}

async function confirmDelete(id: string, name: string) {
  if (confirm(t('index.confirmDelete', { name }))) {
    await store.deleteSession(id)
  }
}
</script>

<template>
  <section class="page">
    <StepIndicator :current="1" />

    <div class="page-grid">
      <div class="card create-card">
        <h2 class="card-title">{{ t('index.createTitle') }}</h2>
        <p class="card-subtitle">{{ t('index.createSubtitle') }}</p>

        <form class="form" @submit.prevent="createSession">
          <label class="field">
            <span class="field-label">{{ t('index.fieldExchangeName') }}</span>
            <input v-model="newSessionName" type="text" class="input"
              :placeholder="t('index.placeholderExchangeName')" />
          </label>

          <div class="field">
            <span class="field-label">{{ t('index.fieldGuests') }}</span>
            <div v-for="(_, i) in guestNameInputs" :key="i" class="guest-input-row">
              <input v-model="guestNameInputs[i]" type="text" class="input"
                :placeholder="t('index.placeholderGuestName', { n: i + 1 })" />
              <button v-if="guestNameInputs.length > 2" type="button" class="icon-btn" :title="t('common.remove')"
                @click="removeGuestInput(i)">
                ✕
              </button>
            </div>
            <button type="button" class="btn btn-ghost" @click="addGuestInput">{{ t('index.addGuest') }}</button>
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <button type="submit" class="btn btn-primary">{{ t('index.createButton') }}</button>
        </form>
      </div>

      <div class="sessions-list">
        <h2 class="card-title">{{ t('index.sessionsTitle') }}</h2>
        <p v-if="!sessions.length" class="empty-state">{{ t('index.noSessions') }}</p>

        <ul v-else class="session-cards">
          <li v-for="session in sessions" :key="session.id" class="session-card">
            <NuxtLink :to="`/sessions/${session.id}`" class="session-card-link">
              <h3>{{ session.name }}</h3>
              <p>{{ t('common.guestsCount', { n: session.guests.length }) }}</p>
              <p class="session-card-date">
                {{ t('common.createdOn', { date: new Date(session.createdAt).toLocaleDateString(locale) }) }}
              </p>
            </NuxtLink>
            <button class="icon-btn" :title="t('common.deleteSession')"
              @click="confirmDelete(session.id, session.name)">
              🗑
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>