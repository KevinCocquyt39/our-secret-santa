<script setup lang="ts">
const route = useRoute()
const store = useSessionsStore()
const { t } = useI18n()

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
const lightboxImage = ref<string | null>(null)

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

async function draw() {
  if (!activeGuestId.value) return
  const result = await store.drawRecipient(sessionId.value, activeGuestId.value)
  drawError.value = result.ok ? '' : result.message
}

function toggleReveal() {
  revealRecipient.value = !revealRecipient.value
}

useHead(() => ({
  title: session.value ? `${session.value.name} — Our Secret Santa` : t('session.notFoundTitle')
}))
</script>

<template>
  <section v-if="session" class="page">
    <StepIndicator :current="activeGuest ? 3 : 2" />

    <div class="session-header">
      <div>
        <h1 class="session-title">{{ session.name }}</h1>
        <p class="session-meta">{{ t('common.guestsCount', { n: session.guests.length }) }}</p>
      </div>
      <button class="btn btn-ghost" @click="showEditModal = true">{{ t('session.editGuests') }}</button>
    </div>

    <!-- Step 2: who are you -->
    <div v-if="!activeGuest" class="card">
      <h2 class="card-title">{{ t('session.whoAreYouTitle') }}</h2>
      <p class="card-subtitle">{{ t('session.whoAreYouSubtitle') }}</p>
      <div class="guest-picker-grid">
        <button v-for="guest in session.guests" :key="guest.id" class="guest-pick-btn" @click="chooseGuest(guest.id)">
          {{ guest.name }}
        </button>
      </div>
    </div>

    <!-- Step 3: draw & wishlist -->
    <div v-else class="step-three">
      <div class="active-guest-bar">
        <p>{{ t('session.signedInAs', { name: activeGuest.name }) }}</p>
        <button class="btn btn-link" @click="switchGuest">{{ t('session.switchGuest') }}</button>
      </div>

      <div class="card draw-card">
        <h2 class="card-title">{{ t('session.drawTitle') }}</h2>

        <div v-if="!recipient" class="draw-empty">
          <p>{{ t('session.drawPrompt') }}</p>
          <button class="btn btn-primary" @click="draw">{{ t('session.drawButton') }}</button>
          <p v-if="drawError" class="form-error">{{ drawError }}</p>
        </div>

        <div v-else class="draw-result">
          <button class="recipient-reveal-btn" @click="toggleReveal">
            <span v-if="!revealRecipient">{{ t('session.revealPrompt') }}</span>
            <span v-else>{{ t('session.buyingFor', { name: recipient.name }) }}</span>
          </button>

          <div v-if="revealRecipient" class="wishlist-viewer">
            <h3>{{ t('session.wishlistOf', { name: recipient.name }) }}</h3>
            <ul v-if="recipient.wishlist.length" class="wishlist-items">
              <li v-for="item in recipient.wishlist" :key="item.id" class="wishlist-item">
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
              </li>
            </ul>
            <p v-else class="empty-state">{{ t('session.noWishlist') }}</p>
          </div>
        </div>
      </div>

      <button class="btn btn-secondary" @click="showWishlistModal = true">{{ t('session.manageWishlist') }}</button>
    </div>

    <EditSessionModal v-if="showEditModal" :session="session" @close="showEditModal = false" />

    <WishlistModal v-if="showWishlistModal && activeGuest" :session-id="sessionId" :guest="activeGuest"
      @close="showWishlistModal = false" />

    <ImageLightbox v-if="lightboxImage" :src="lightboxImage" @close="lightboxImage = null" />
  </section>

  <section v-else class="page">
    <div class="card">
      <h2 class="card-title">{{ t('session.notFoundTitle') }}</h2>
      <p class="card-subtitle">{{ t('session.notFoundSubtitle') }}</p>
      <NuxtLink to="/" class="btn btn-primary">{{ t('session.backToSessions') }}</NuxtLink>
    </div>
  </section>
</template>