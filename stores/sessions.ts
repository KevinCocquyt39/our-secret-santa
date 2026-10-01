import { defineStore } from "pinia";
import type { SecretSantaSession, Guest } from "~/types";

export const useSessionsStore = defineStore("sessions", () => {
  const sessions = useLocalStorage<SecretSantaSession[]>("oss-sessions", []);
  const activeGuestBySession = useLocalStorage<Record<string, string>>(
    "oss-active-guest",
    {},
  );

  function findSession(id: string): SecretSantaSession | undefined {
    return sessions.value.find((s) => s.id === id);
  }

  function createSession(name: string, guestNames: string[]): string {
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

    sessions.value.push(session);
    return session.id;
  }

  function deleteSession(id: string) {
    sessions.value = sessions.value.filter((s) => s.id !== id);
    delete activeGuestBySession.value[id];
  }

  function updateSession(
    id: string,
    name: string,
    guestEntries: { id?: string; name: string }[],
  ) {
    const session = findSession(id);
    if (!session) return;

    session.name = name.trim();

    const existingById = new Map(session.guests.map((g) => [g.id, g]));
    const nextGuests: Guest[] = [];

    for (const entry of guestEntries) {
      const trimmed = entry.name.trim();
      if (!trimmed) continue;

      const existing = entry.id ? existingById.get(entry.id) : undefined;
      if (existing) {
        existing.name = trimmed;
        nextGuests.push(existing);
      } else {
        nextGuests.push({ id: createId(), name: trimmed, wishlist: [] });
      }
    }

    session.guests = nextGuests;
    // Editing the guest list invalidates any in-progress draw.
    session.draws = {};

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

  function drawRecipient(
    sessionId: string,
    guestId: string,
  ): { ok: true; recipientId: string } | { ok: false; message: string } {
    const session = findSession(sessionId);
    if (!session) return { ok: false, message: "Session not found." };

    if (session.draws[guestId]) {
      return { ok: true, recipientId: session.draws[guestId] };
    }

    const taken = new Set(Object.values(session.draws));
    const candidates = session.guests.filter(
      (g) => g.id !== guestId && !taken.has(g.id),
    );

    if (candidates.length === 0) {
      return {
        ok: false,
        message:
          "No more guests left to draw. Ask the organizer to reset the session.",
      };
    }

    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    session.draws[guestId] = picked.id;
    return { ok: true, recipientId: picked.id };
  }

  function addWishlistItem(
    sessionId: string,
    guestId: string,
    title: string,
    link: string,
  ) {
    const guest = findSession(sessionId)?.guests.find((g) => g.id === guestId);
    if (!guest) return;
    guest.wishlist.push({
      id: createId(),
      title: title.trim(),
      link: link.trim(),
    });
  }

  function removeWishlistItem(
    sessionId: string,
    guestId: string,
    itemId: string,
  ) {
    const guest = findSession(sessionId)?.guests.find((g) => g.id === guestId);
    if (!guest) return;
    guest.wishlist = guest.wishlist.filter((i) => i.id !== itemId);
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
