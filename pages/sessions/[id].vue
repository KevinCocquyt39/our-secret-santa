<script setup lang="ts">
const route = useRoute()
const store = useSessionsStore()

const sessionId = computed(() => route.params.id as string)
const session = computed(() => store.findSession(sessionId.value))

const activeGuestId = computed(() => store.activeGuestBySession[sessionId.value] ?? null)
const activeGuest = computed(() => session.value?.guests.find((g) => g.id === activeGuestId.value) ?? null)

const recipient = computed(() => {
  if (!session.value || !activeGuestId.value) return null
  const recipientId = session.value.draws[activeGuestId.value]
  if (!recipientId) return null
  return session.value.guests.find((g) => g.id === recipientId) ?? null
})

const showEditModal = ref(false)
const showWishlistModal = ref(false)
const revealRecipient = ref(false)
const drawError = ref('')

function chooseGuest(guestId: string) {
  store.setActiveGuest(sessionId.value, guestId)
  revealRecipient.value = false
  drawError.value = ''
}

function switchGuest() {
  store.setActiveGuest(sessionId.value, null)
  revealRecipient.value = false
  drawError.value = ''
}

function draw() {
  if (!activeGuestId.value) return
  const result = store.drawRecipient(sessionId.value, activeGuestId.value)
  drawError.value = result.ok ? '' : result.message
}

function toggleReveal() {
  revealRecipient.value = !revealRecipient.value
}

useHead(() => ({
  title: session.value ? `${session.value.name} — Our Secret Santa` : 'Session not found'
}))
</script>

<template>
  <section v-if="session" class="page">
    <StepIndicator :current="activeGuest ? 3 : 2" />

    <div class="session-header">
      <div>
        <h1 class="session-title">{{ session.name }}</h1>
        <p class="session-meta">{{ session.guests.length }} guests</p>
      </div>
      <button class="btn btn-ghost" @click="showEditModal = true">✏️ Edit guests &amp; name</button>
    </div>

    <!-- Step 2: who are you -->
    <div v-if="!activeGuest" class="card">
      <h2 class="card-title">🙋 Which one are you?</h2>
      <p class="card-subtitle">Pick your name to continue to the gift exchange.</p>
      <div class="guest-picker-grid">
        <button v-for="guest in session.guests" :key="guest.id" class="guest-pick-btn" @click="chooseGuest(guest.id)">
          {{ guest.name }}
        </button>
      </div>
    </div>

    <!-- Step 3: draw & wishlist -->
    <div v-else class="step-three">
      <div class="active-guest-bar">
        <p>You're signed in as <strong>{{ activeGuest.name }}</strong></p>
        <button class="btn btn-link" @click="switchGuest">Not you? Switch</button>
      </div>

      <div class="card draw-card">
        <h2 class="card-title">🎁 Your Secret Santa draw</h2>

        <div v-if="!recipient" class="draw-empty">
          <p>Ready to find out who you're buying for?</p>
          <button class="btn btn-primary" @click="draw">🎲 Draw my Secret Santa</button>
          <p v-if="drawError" class="form-error">{{ drawError }}</p>
        </div>

        <div v-else class="draw-result">
          <button class="recipient-reveal-btn" @click="toggleReveal">
            <span v-if="!revealRecipient">🎁 Click to reveal who you're buying for</span>
            <span v-else>You're buying for <strong>{{ recipient.name }}</strong> 🎉</span>
          </button>

          <div v-if="revealRecipient" class="wishlist-viewer">
            <h3>{{ recipient.name }}'s wishlist</h3>
            <ul v-if="recipient.wishlist.length" class="wishlist-items">
              <li v-for="item in recipient.wishlist" :key="item.id" class="wishlist-item">
                <a :href="item.link" target="_blank" rel="noopener noreferrer">{{ item.title }} ↗</a>
              </li>
            </ul>
            <p v-else class="empty-state">No wishlist yet — surprise them with something cozy!</p>
          </div>
        </div>
      </div>

      <button class="btn btn-secondary" @click="showWishlistModal = true">🎀 Manage my wishlist</button>
    </div>

    <EditSessionModal v-if="showEditModal" :session="session" @close="showEditModal = false" />

    <WishlistModal
      v-if="showWishlistModal && activeGuest"
      :session-id="sessionId"
      :guest="activeGuest"
      @close="showWishlistModal = false"
    />
  </section>

  <section v-else class="page">
    <div class="card">
      <h2 class="card-title">Session not found</h2>
      <p class="card-subtitle">This gift exchange doesn't exist (anymore).</p>
      <NuxtLink to="/" class="btn btn-primary">Back to sessions</NuxtLink>
    </div>
  </section>
</template>
