<template>
  <nav class="bg-white shadow-sm fixed w-full z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <NuxtLink to="/" class="flex items-center">
          <Compass class="h-8 w-8 text-emerald-600" />
          <span class="ml-2 text-xl font-bold text-gray-900">Bénin Mirror</span>
        </NuxtLink>

        <!-- Menu mobile -->
        <button
          class="md:hidden"
          @click="isMenuOpen = !isMenuOpen"
        >
          <XIcon v-if="isMenuOpen" class="h-6 w-6 text-gray-600" />
          <MenuIcon v-else class="h-6 w-6 text-gray-600" />
        </button>

        <!-- Menu desktop -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/sites-touristiques" class="text-gray-700 hover:text-emerald-600">
            Sites Touristiques
          </NuxtLink>
          <NuxtLink to="/hotels" class="text-gray-700 hover:text-emerald-600">
            Hôtels
          </NuxtLink>
          <NuxtLink to="/restaurants" class="text-gray-700 hover:text-emerald-600">
            Restaurants
          </NuxtLink>
          <NuxtLink to="/guides" class="text-gray-700 hover:text-emerald-600">
            Guides
          </NuxtLink>
          <NuxtLink to="/partner/register" class="text-gray-700 hover:text-emerald-600">
            <Building2 class="h-5 w-5 inline-block mr-1" />
            Devenir Partenaire
          </NuxtLink>
          
          <div v-if="user" class="relative group">
            <button class="flex items-center text-emerald-600 hover:text-emerald-700">
              <User class="h-5 w-5 mr-1" />
              <span>Mon Compte</span>
            </button>
            <div class="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl hidden group-hover:block">
              <NuxtLink
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mon Profil
              </NuxtLink>
              <NuxtLink
                to="/partner/dashboard"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Dashboard Partenaire
              </NuxtLink>
            </div>
          </div>
          <button
            v-else
            @click="navigateTo('/auth')"
            class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>

    <!-- Menu mobile overlay -->
    <div v-if="isMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
        <NuxtLink
          v-for="link in mobileLinks"
          :key="link.to"
          :to="link.to"
          class="block px-3 py-2 text-gray-700 hover:text-emerald-600"
          @click="isMenuOpen = false"
        >
          <component 
            v-if="link.icon" 
            :is="link.icon" 
            class="h-5 w-5 inline-block mr-1"
          />
          {{ link.text }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Compass, 
  Menu as MenuIcon, 
  X as XIcon,
  User,
  Building2
} from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const { user } = useAuth()
const isMenuOpen = ref(false)

const mobileLinks = [
  { to: '/sites-touristiques', text: 'Sites Touristiques' },
  { to: '/hotels', text: 'Hôtels' },
  { to: '/restaurants', text: 'Restaurants' },
  { to: '/guides', text: 'Guides' },
  { to: '/partner/register', text: 'Devenir Partenaire', icon: Building2 },
  ...(user.value
    ? [
        { to: '/profile', text: 'Mon Profil', icon: User },
        { to: '/partner/dashboard', text: 'Dashboard Partenaire' }
      ]
    : [{ to: '/auth', text: 'Se connecter' }]
  )
]
</script>