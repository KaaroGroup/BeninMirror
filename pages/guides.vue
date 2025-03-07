<template>
  <div class="min-h-screen pt-16 px-4">
    <div class="max-w-7xl mx-auto py-12">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Guides Touristiques</h1>
        
        <div class="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un guide..."
              v-model="searchTerm"
              class="pl-10 pr-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <select
            v-model="selectedLanguage"
            class="px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">Toutes les langues</option>
            <option value="Français">Français</option>
            <option value="Anglais">Anglais</option>
            <option value="Fon">Fon</option>
            <option value="Yoruba">Yoruba</option>
          </select>

          <select
            v-model="priceRange"
            class="px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">Tous les prix</option>
            <option value="low">{"< 25,000 FCFA/jour"}</option>
            <option value="medium">25,000 - 50,000 FCFA/jour</option>
            <option value="high">{"> 50,000 FCFA/jour"}</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p>Chargement...</p>
      </div>

      <div v-else-if="guides.length === 0" class="text-center text-gray-600">
        <p>Aucun guide ne correspond à vos critères.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="guide in guides"
          :key="guide.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img
            :src="guide.image_url"
            :alt="guide.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ guide.name }}</h2>
            <p class="text-gray-600 mb-4">{{ guide.description }}</p>
            <div class="mb-4">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Langues parlées:</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(language, index) in guide.languages"
                  :key="index"
                  class="px-2 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
                >
                  {{ language }}
                </span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-emerald-600 font-semibold">
                {{ formatPrice(guide.price_per_day) }} FCFA / jour
              </span>
              <button
                @click="selectedGuide = guide"
                class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
              >
                Réserver
              </button>
            </div>
          </div>
        </div>
      </div>

      <BookingForm
        v-if="selectedGuide"
        type="guide"
        :itemId="selectedGuide.id"
        :price="selectedGuide.price_per_day"
        @success="handleBookingSuccess"
        @cancel="selectedGuide = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSupabaseClient } from '#imports'
import { Search } from 'lucide-vue-next'

interface Guide {
  id: string
  name: string
  description: string
  languages: string[]
  price_per_day: number
  image_url: string
}

const supabase = useSupabaseClient()
const guides = ref<Guide[]>([])
const loading = ref(true)
const selectedGuide = ref<Guide | null>(null)
const searchTerm = ref('')
const selectedLanguage = ref('all')
const priceRange = ref<'all' | 'low' | 'medium' | 'high'>('all')

const fetchGuides = async () => {
  let query = supabase
    .from('guides')
    .select('*')
    .order('name')

  if (searchTerm.value) {
    query = query.ilike('name', `%${searchTerm.value}%`)
  }

  if (selectedLanguage.value !== 'all') {
    query = query.contains('languages', [selectedLanguage.value])
  }

  switch (priceRange.value) {
    case 'low':
      query = query.lte('price_per_day', 25000)
      break
    case 'medium':
      query = query.gt('price_per_day', 25000).lte('price_per_day', 50000)
      break
    case 'high':
      query = query.gt('price_per_day', 50000)
      break
  }

  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching guides:', error)
  } else {
    guides.value = data || []
  }
  loading.value = false
}

const formatPrice = (price: number) => {
  return price.toLocaleString('fr-FR')
}

const handleBookingSuccess = () => {
  selectedGuide.value = null
  alert('Réservation effectuée avec succès !')
}

watch([searchTerm, selectedLanguage, priceRange], () => {
  fetchGuides()
})

onMounted(() => {
  fetchGuides()
})
</script>
```

Je viens de migrer la page Guides. Voulez-vous que je continue avec la migration des autres pages ? Les pages restantes sont :

1. Hotels.vue
2. PartnerDashboard.vue
3. PartnerRegistration.vue
4. Profile.vue
5. Restaurants.vue
6. ServiceDetails.vue
7. TouristSites.vue

Souhaitez-vous que je continue avec ces