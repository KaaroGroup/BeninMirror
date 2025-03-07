<template>
  <div class="min-h-screen pt-16">
    <div v-if="serviceInfo" class="relative h-[400px]">
      <img
        :src="serviceInfo.image"
        :alt="serviceInfo.title"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <h1 class="text-4xl font-bold text-white">{{ serviceInfo.title }}</h1>
      </div>
    </div>

    <div v-if="serviceInfo" class="max-w-7xl mx-auto px-4 py-12">
      <NuxtLink to="/" class="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8">
        <ArrowLeft class="h-5 w-5 mr-2" />
        Retour à l'accueil
      </NuxtLink>

      <div class="prose prose-lg max-w-none">
        <p class="text-xl text-gray-600 mb-8">{{ serviceInfo.description }}</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-6">Ce que nous proposons</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div v-for="(feature, index) in serviceInfo.features" :key="index" class="flex items-start">
            <div class="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <span class="text-emerald-600 text-sm">✓</span>
            </div>
            <p class="ml-3 text-lg text-gray-600">{{ feature }}</p>
          </div>
        </div>

        <div class="text-center">
          <NuxtLink
            :to="serviceInfo.link"
            class="inline-block bg-emerald-600 text-white px-8 py-3 rounded-md hover:bg-emerald-700 transition-colors"
          >
            {{ serviceInfo.linkText }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 py-12">
      <p>Service non trouvé</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const serviceSlug = computed(() => route.params.service as string)

interface ServiceInfo {
  title: string
  description: string
  image: string
  features: string[]
  link: string
  linkText: string
}

const services: Record<string, ServiceInfo> = {
  'sites-touristiques': {
    title: 'Sites Touristiques',
    description: 'Découvrez les merveilles historiques et culturelles du Bénin. De la Route des Esclaves à la cité lacustre de Ganvié, en passant par les palais royaux d\'Abomey, chaque site raconte une histoire unique de notre patrimoine.',
    image: 'https://mediapartbenin.com/upload/thumbnails/0572264001655899649.jpeg',
    features: [
      'Visites guidées des sites historiques',
      'Exploration des parcs nationaux',
      'Découverte des villages traditionnels',
      'Participation aux cérémonies culturelles',
      'Photographie des paysages uniques'
    ],
    link: '/sites-touristiques',
    linkText: 'Voir tous les sites touristiques'
  },
  'hebergements': {
    title: 'Hébergements',
    description: 'Du luxe moderne aux écolodges authentiques, trouvez l\'hébergement parfait pour votre séjour au Bénin. Nous sélectionnons les meilleurs établissements pour garantir votre confort.',
    image: 'https://www.ahstatic.com/photos/b845_ho_00_p_1024x768.jpg',
    features: [
      'Hôtels de luxe en ville',
      'Écolodges en pleine nature',
      'Maisons d\'hôtes traditionnelles',
      'Complexes balnéaires',
      'Hébergements écologiques'
    ],
    link: '/hotels',
    linkText: 'Explorer les hébergements'
  },
  'restaurants': {
    title: 'Restaurants',
    description: 'Savourez la richesse de la cuisine béninoise et internationale. Nos restaurants partenaires vous proposent une expérience gastronomique unique, des plats traditionnels aux créations modernes.',
    image: 'https://q-xx.bstatic.com/xdata/images/hotel/max500/489269107.jpg?k=6bdeb2e56df565d6d83442ffc3acf35d4af08709fc511e8e9b0ec0d33480b157&o=',
    features: [
      'Cuisine traditionnelle béninoise',
      'Restaurants gastronomiques',
      'Cafés et bars branchés',
      'Street food locale',
      'Expériences culinaires uniques'
    ],
    link: '/restaurants',
    linkText: 'Découvrir les restaurants'
  },
  'transport': {
    title: 'Transport',
    description: 'Voyagez en toute sérénité avec nos services de transport. De l\'aéroport à votre hôtel, en passant par les excursions, nous assurons vos déplacements en tout confort.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuHj1nDMoMONG45xL3uMSViQE3nt1-W7UVfQ&s',
    features: [
      'Transferts aéroport',
      'Location de véhicules',
      'Chauffeurs professionnels',
      'Excursions organisées',
      ' Transport personnalisé'
    ],
    link: '/guides',
    linkText: 'Réserver un transport'
  }
};

const serviceInfo = computed(() => {
  return serviceSlug.value ? services[serviceSlug.value] : null;
});
</script>