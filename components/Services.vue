<template>
  <div class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Nos Services
        </h2>
        <p class="mt-4 text-lg text-gray-600">
          Tout ce dont vous avez besoin pour un séjour inoubliable au Bénin
        </p>
      </div>
      <div class="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="service in services"
          :key="service.title"
          class="pt-6 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div class="p-6">
            <div class="w-12 h-12 rounded-md bg-emerald-600 flex items-center justify-center">
              <component :is="service.icon" class="h-6 w-6 text-white" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">{{ service.title }}</h3>
            <p class="mt-2 text-base text-gray-500">{{ service.description }}</p>
          </div>
          <div class="px-6 pb-6">
            <NuxtLink 
              :to="service.link"
              class="block w-full text-center bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-100 transition-colors"
            >
              En savoir plus
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Compass, 
  Hotel, 
  Utensils, 
  Car 
} from 'lucide-vue-next'

const services = [
  {
    icon: Compass,
    title: 'Sites Touristiques',
    description: 'Découvrez les sites historiques et culturels emblématiques du Bénin',
    link: '/service/sites-touristiques'
  },
  {
    icon: Hotel,
    title: 'Hébergements',
    description: 'Trouvez le meilleur hébergement pour votre séjour',
    link: '/service/hebergements'
  },
  {
    icon: Utensils,
    title: 'Restaurants',
    description: 'Savourez la délicieuse cuisine béninoise',
    link: '/service/restaurants'
  },
  {
    icon: Car,
    title: 'Transport',
    description: 'Réservez un chauffeur pour vos visites guidées',
    link: '/service/transport'
  }
]
</script>