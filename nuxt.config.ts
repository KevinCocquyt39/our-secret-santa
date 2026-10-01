// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  // Pure client-side app for now: all data lives in localStorage (phase 1).
  // Re-enable SSR once a real backend (Firebase + Drizzle) is in place.
  ssr: false,

  modules: ["@pinia/nuxt", "@vueuse/nuxt"],

  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      firebaseApiKey: "",
      firebaseAuthDomain: "",
      firebaseProjectId: "",
      firebaseStorageBucket: "",
      firebaseMessagingSenderId: "",
      firebaseAppId: "",
    },
  },
  app: {
    head: {
      title: "Our Secret Santa 🎄",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Organize a cozy, festive Secret Santa gift exchange with friends and family.",
        },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Quicksand:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
});
