export type Locale = "nl" | "en";

const messages: Record<Locale, Record<string, string>> = {
  nl: {
    "header.subtitle": "gezellige cadeau-uitwisselingen, voor jouw groep",

    "steps.sessions": "Sessies",
    "steps.whoAreYou": "Wie ben jij?",
    "steps.giftExchange": "Cadeau-uitwisseling",

    "index.createTitle": "🎁 Start een nieuwe uitwisseling",
    "index.createSubtitle":
      "Geef je uitwisseling een naam en voeg iedereen toe die meedoet.",
    "index.fieldExchangeName": "Naam van de uitwisseling",
    "index.placeholderExchangeName": "bijv. Kerst 2026 bij familie",
    "index.fieldGuests": "Deelnemers",
    "index.placeholderGuestName": "Naam deelnemer {n}",
    "index.addGuest": "+ Nog een deelnemer toevoegen",
    "index.createButton": "Sessie aanmaken 🎄",
    "index.errorName": "Geef je cadeau-uitwisseling een naam.",
    "index.errorGuests":
      "Voeg minstens twee deelnemers toe om namen te trekken.",
    "index.sessionsTitle": "🔔 Jouw sessies",
    "index.noSessions": "Nog geen sessies — maak je eerste om te beginnen!",
    "index.confirmDelete":
      'Weet je zeker dat je "{name}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.',

    "common.remove": "Verwijderen",
    "common.guestsCount": "{n} deelnemers",
    "common.createdOn": "Aangemaakt op {date}",
    "common.deleteSession": "Sessie verwijderen",
    "common.cancel": "Annuleren",
    "common.done": "Klaar",

    "session.editGuests": "✏️ Deelnemers & naam bewerken",
    "session.whoAreYouTitle": "🙋 Wie ben jij?",
    "session.whoAreYouSubtitle":
      "Kies je naam om verder te gaan naar de cadeau-uitwisseling.",
    "session.signedInAs": "Je bent ingelogd als {name}",
    "session.switchGuest": "Niet jou? Wisselen",
    "session.drawTitle": "🎁 Jouw Secret Santa trekking",
    "session.drawPrompt": "Klaar om te ontdekken voor wie je cadeautjes koopt?",
    "session.drawButton": "🎲 Trek mijn Secret Santa",
    "session.revealPrompt": "🎁 Klik om te onthullen voor wie je koopt",
    "session.buyingFor": "Je koopt voor {name} 🎉",
    "session.wishlistOf": "Verlanglijstje van {name}",
    "session.noWishlist":
      "Nog geen verlanglijstje — verras diegene met iets gezelligs!",
    "session.manageWishlist": "🎀 Mijn verlanglijstje beheren",
    "session.notFoundTitle": "Sessie niet gevonden",
    "session.notFoundSubtitle": "Deze cadeau-uitwisseling bestaat niet (meer).",
    "session.backToSessions": "Terug naar sessies",

    "editSession.title": "✏️ Sessie bewerken",
    "editSession.warning":
      "⚠️ Opslaan reset de trekking van iedereen. Verlanglijstjes blijven behouden.",
    "editSession.addGuest": "+ Deelnemer toevoegen",
    "editSession.errorGuests": "Houd minstens twee deelnemers over.",
    "editSession.save": "Wijzigingen opslaan",

    "wishlist.title": "🎀 Verlanglijstje van {name}",
    "wishlist.subtitle":
      "Voeg cadeaus toe die je graag zou willen krijgen, met een link naar de winkel.",
    "wishlist.empty":
      "Je verlanglijstje is leeg — voeg hieronder je eerste cadeau toe.",
    "wishlist.fieldTitle": "Naam cadeau",
    "wishlist.placeholderTitle": "bijv. Warme trui",
    "wishlist.fieldLink": "Winkellink",
    "wishlist.placeholderLink": "https://...",
    "wishlist.error": "Voeg zowel een naam als een link toe.",
    "wishlist.addButton": "+ Toevoegen aan verlanglijstje",
    "wishlist.fieldImage": "Foto (optioneel)",
    "wishlist.imageError":
      "Kon deze afbeelding niet verwerken. Probeer een andere foto.",
    "wishlist.viewLarger": "Klik om te vergroten",

    "footer.tagline":
      "Gemaakt met 🎄 & 🍪 voor jouw favoriete cadeau-uitwisseling.",

    "store.sessionNotFound": "Sessie niet gevonden.",
    "store.noCandidates":
      "Geen deelnemers meer over om te trekken. Vraag de organisator om de sessie te resetten.",
    "store.drawFailed": "Kon geen ontvanger trekken.",
  },
  en: {
    "header.subtitle": "cozy gift exchanges, just for your crew",

    "steps.sessions": "Sessions",
    "steps.whoAreYou": "Who are you?",
    "steps.giftExchange": "Gift exchange",

    "index.createTitle": "🎁 Start a new exchange",
    "index.createSubtitle":
      "Name your exchange and list everyone who's joining.",
    "index.fieldExchangeName": "Exchange name",
    "index.placeholderExchangeName": "e.g. Family Christmas 2026",
    "index.fieldGuests": "Guests",
    "index.placeholderGuestName": "Guest {n} name",
    "index.addGuest": "+ Add another guest",
    "index.createButton": "Create session 🎄",
    "index.errorName": "Give your gift exchange a name.",
    "index.errorGuests": "Add at least two guests to draw names.",
    "index.sessionsTitle": "🔔 Your sessions",
    "index.noSessions":
      "No sessions yet — create your first one to get started!",
    "index.confirmDelete": 'Delete "{name}"? This cannot be undone.',

    "common.remove": "Remove",
    "common.guestsCount": "{n} guests",
    "common.createdOn": "Created {date}",
    "common.deleteSession": "Delete session",
    "common.cancel": "Cancel",
    "common.done": "Done",

    "session.editGuests": "✏️ Edit guests & name",
    "session.whoAreYouTitle": "🙋 Which one are you?",
    "session.whoAreYouSubtitle":
      "Pick your name to continue to the gift exchange.",
    "session.signedInAs": "You're signed in as {name}",
    "session.switchGuest": "Not you? Switch",
    "session.drawTitle": "🎁 Your Secret Santa draw",
    "session.drawPrompt": "Ready to find out who you're buying for?",
    "session.drawButton": "🎲 Draw my Secret Santa",
    "session.revealPrompt": "🎁 Click to reveal who you're buying for",
    "session.buyingFor": "You're buying for {name} 🎉",
    "session.wishlistOf": "{name}'s wishlist",
    "session.noWishlist":
      "No wishlist yet — surprise them with something cozy!",
    "session.manageWishlist": "🎀 Manage my wishlist",
    "session.notFoundTitle": "Session not found",
    "session.notFoundSubtitle": "This gift exchange doesn't exist (anymore).",
    "session.backToSessions": "Back to sessions",

    "editSession.title": "✏️ Edit session",
    "editSession.warning":
      "⚠️ Saving will reset everyone's Secret Santa draw. Wishlists are kept.",
    "editSession.addGuest": "+ Add guest",
    "editSession.errorGuests": "Keep at least two guests.",
    "editSession.save": "Save changes",

    "wishlist.title": "🎀 {name}'s wishlist",
    "wishlist.subtitle":
      "Add presents you'd love to receive, with a link to the shop.",
    "wishlist.empty": "Your wishlist is empty — add your first present below.",
    "wishlist.fieldTitle": "Present title",
    "wishlist.placeholderTitle": "e.g. Cozy knit sweater",
    "wishlist.fieldLink": "Shop link",
    "wishlist.placeholderLink": "https://...",
    "wishlist.error": "Add both a title and a link.",
    "wishlist.addButton": "+ Add to wishlist",
    "wishlist.fieldImage": "Photo (optional)",
    "wishlist.imageError":
      "Couldn't process that image. Try a different photo.",
    "wishlist.viewLarger": "Click to view larger",

    "footer.tagline": "Made with 🎄 & 🍪 for your favorite gift exchange.",

    "store.sessionNotFound": "Session not found.",
    "store.noCandidates":
      "No more guests left to draw. Ask the organizer to reset the session.",
    "store.drawFailed": "Could not draw a recipient.",
  },
};

// Module-level singleton so every caller shares the same persisted locale.
const locale = useLocalStorage<Locale>("oss-locale", "nl");

function t(key: string, params?: Record<string, string | number>): string {
  let str = messages[locale.value][key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
  }
  return str;
}

export function useI18n() {
  return { locale, locales: ["nl", "en"] as const, t };
}
