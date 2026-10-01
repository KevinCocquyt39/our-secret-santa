import { defineStore } from "pinia";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  runTransaction,
  setDoc,
  updateDoc,
  type Firestore,
} from "firebase/firestore";
import type { SecretSantaSession, Guest } from "~/types";

export const useSessionsStore = defineStore("sessions", () => {
  const sessions = ref<SecretSantaSession[]>([]);
  // Who you are in each session is a per-browser preference, not shared data.
  const activeGuestBySession = useLocalStorage<Record<string, string>>(
    "oss-active-guest",
    {},
  );

  let db: Firestore | null = null;
  let unsubscribe: (() => void) | null = null;

  function getDb(): Firestore {
    if (!db) {
      const { $firestore } = useNuxtApp();
      db = $firestore as Firestore;
    }
    return db;
  }

  function ensureSubscription() {
    if (unsubscribe) return;
    unsubscribe = onSnapshot(collection(getDb(), "sessions"), (snapshot) => {
      sessions.value = snapshot.docs.map((d) => d.data() as SecretSantaSession);
    });
  }

  if (import.meta.client) {
    ensureSubscription();
  }

  function findSession(id: string): SecretSantaSession | undefined {
    return sessions.value.find((s) => s.id === id);
  }

  async function createSession(
    name: string,
    guestNames: string[],
  ): Promise<string> {
    const guests: Guest[] = guestNames
      .map((n) => n.trim())
      .filter(Boolean)
      .map((n) => ({ id: createId(), name: n, wishlist: [] }));

    const session: SecretSantaSession = {
      id: createId(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      guests,
      draws: {},
    };

    await setDoc(doc(getDb(), "sessions", session.id), session);
    return session.id;
  }

  async function deleteSession(id: string) {
    await deleteDoc(doc(getDb(), "sessions", id));
    delete activeGuestBySession.value[id];
  }

  async function updateSession(
    id: string,
    name: string,
    guestEntries: { id?: string; name: string }[],
  ) {
    const session = findSession(id);
    if (!session) return;

    const existingById = new Map(session.guests.map((g) => [g.id, g]));
    const nextGuests: Guest[] = [];

    for (const entry of guestEntries) {
      const trimmed = entry.name.trim();
      if (!trimmed) continue;

      const existing = entry.id ? existingById.get(entry.id) : undefined;
      nextGuests.push(
        existing
          ? { ...existing, name: trimmed }
          : { id: createId(), name: trimmed, wishlist: [] },
      );
    }

    // Editing the guest list invalidates any in-progress draw.
    await updateDoc(doc(getDb(), "sessions", id), {
      name: name.trim(),
      guests: nextGuests,
      draws: {},
    });

    const activeId = activeGuestBySession.value[id];
    if (activeId && !nextGuests.some((g) => g.id === activeId)) {
      delete activeGuestBySession.value[id];
    }
  }

  function setActiveGuest(sessionId: string, guestId: string | null) {
    if (guestId) {
      activeGuestBySession.value[sessionId] = guestId;
    } else {
      delete activeGuestBySession.value[sessionId];
    }
  }

  async function drawRecipient(
    sessionId: string,
    guestId: string,
  ): Promise<
    { ok: true; recipientId: string } | { ok: false; message: string }
  > {
    const ref = doc(getDb(), "sessions", sessionId);

    try {
      // Runs as a transaction so two guests drawing at once can't get the same recipient.
      const recipientId = await runTransaction(getDb(), async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists())
          throw new Error(useI18n().t("store.sessionNotFound"));
        const session = snap.data() as SecretSantaSession;

        if (session.draws[guestId]) {
          return session.draws[guestId];
        }

        const taken = new Set(Object.values(session.draws));
        const candidates = session.guests.filter(
          (g) => g.id !== guestId && !taken.has(g.id),
        );

        if (candidates.length === 0) {
          throw new Error(useI18n().t("store.noCandidates"));
        }

        const picked =
          candidates[Math.floor(Math.random() * candidates.length)];
        tx.update(ref, { [`draws.${guestId}`]: picked.id });
        return picked.id;
      });

      return { ok: true, recipientId };
    } catch (err) {
      return {
        ok: false,
        message:
          err instanceof Error ? err.message : useI18n().t("store.drawFailed"),
      };
    }
  }

  async function addWishlistItem(
    sessionId: string,
    guestId: string,
    title: string,
    link: string,
    imageUrl?: string,
  ) {
    const session = findSession(sessionId);
    const guest = session?.guests.find((g) => g.id === guestId);
    if (!session || !guest) return;

    const item: Guest["wishlist"][number] = {
      id: createId(),
      title: title.trim(),
      link: link.trim(),
    };
    // Firestore rejects `undefined` field values, so only attach imageUrl when present.
    if (imageUrl) item.imageUrl = imageUrl;

    const nextGuests = session.guests.map((g) =>
      g.id === guestId ? { ...g, wishlist: [...g.wishlist, item] } : g,
    );

    await updateDoc(doc(getDb(), "sessions", sessionId), {
      guests: nextGuests,
    });
  }

  async function removeWishlistItem(
    sessionId: string,
    guestId: string,
    itemId: string,
  ) {
    const session = findSession(sessionId);
    const guest = session?.guests.find((g) => g.id === guestId);
    if (!session || !guest) return;

    const nextGuests = session.guests.map((g) =>
      g.id === guestId
        ? { ...g, wishlist: g.wishlist.filter((i) => i.id !== itemId) }
        : g,
    );

    await updateDoc(doc(getDb(), "sessions", sessionId), {
      guests: nextGuests,
    });
  }

  return {
    sessions,
    activeGuestBySession,
    findSession,
    createSession,
    deleteSession,
    updateSession,
    setActiveGuest,
    drawRecipient,
    addWishlistItem,
    removeWishlistItem,
  };
});
