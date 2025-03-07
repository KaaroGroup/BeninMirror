<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">À propos</h3>
          <p class="text-gray-400">
            Bénin Mirror est votre guide touristique complet pour découvrir les merveilles du Bénin.
            Nous vous aidons à planifier votre voyage parfait.
          </p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Liens rapides</h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.to">
              <NuxtLink :to="link.to" class="text-gray-400 hover:text-white">
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Contact</h3>
          <ul class="space-y-2">
            <li v-for="(contact, index) in contactInfo" :key="index" class="flex items-center text-gray-400">
              <component :is="contact.icon" class="h-5 w-5 mr-2" />
              {{ contact.text }}
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Suivez-nous</h3>
          <div class="flex space-x-4">
            <a 
              v-for="social in socialLinks" 
              :key="social.url"
              :href="social.url" 
              class="text-gray-400 hover:text-white"
            >
              <component :is="social.icon" class="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      
      <div class="mt-8 pt-8 border-t border-gray-800">
        <p class="text-center text-gray-400">
          © {{ new Date().getFullYear() }} Bénin Mirror. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-vue-next'

const quickLinks = [
  { to: '/sites-touristiques', text: 'Sites Touristiques' },
  { to: '/hotels', text: 'Hôtels' },
  { to: '/restaurants', text: 'Restaurants' },
  { to: '/guides', text: 'Guides' }
]

const contactInfo = [
  { icon: Phone, text: '+229016732576 / +2290166672622' },
  { icon: Mail, text: 'kaarogroupsarl@gmail.com' },
  { icon: MapPin, text: 'Akonaboè, Porto-Novo (Bénin)' }
]

const socialLinks = [
  { icon: Facebook, url: 'https://www.facebook.com/kaarogroupsarl' },
  { icon: Instagram, url: 'https://www.instagram.com/kaarogroupsarl' },
  { icon: Twitter, url: 'https://x.com/kaarogroupsarl' }
]
</script>