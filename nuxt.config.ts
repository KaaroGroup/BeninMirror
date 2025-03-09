// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase'
  ],

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
    redirectOptions: {
      login: '/auth',
      callback: '/confirm',
      exclude: ['/'],
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      secure: true
    }
  },

  app: {
  head: {
    title: 'Benin Mirror - La vitrine du Bénin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      
      // Métadonnées Open Graph (Facebook, WhatsApp, LinkedIn, etc.)
      { property: 'og:title', content: 'Benin Mirror - La vitrine du Bénin' },
      { property: 'og:description', content: 'Explorez les merveilles culturelles, historiques et naturelles du Bénin. Réservez vos visites guidées, hôtels et restaurants en quelques clics.' },
      { property: 'og:image', content: '/img/ogmeta.png' },
      { property: 'og:url', content: 'https://beninmirror.netlify.app/' },
      { property: 'og:type', content: 'website' },

      // Métadonnées Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Benin Mirror - La vitrine du Bénin' },
      { name: 'twitter:description', content: 'Explorez les merveilles culturelles, historiques et naturelles du Bénin. Réservez vos visites guidées, hôtels et restaurants en quelques clics.' },
      { name: 'twitter:image', content: '/img/ogmeta.png' } 
    ]
  }
}

})