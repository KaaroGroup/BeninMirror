<template>
  <div class="min-h-screen pt-16 px-4">
    <div class="max-w-7xl mx-auto py-12">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Guides de tourisme</h1>
        
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

          <select
            v-model="sortBy"
            class="px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="name">Nom (A-Z)</option>
            <option value="name-desc">Nom (Z-A)</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p>Chargement...</p>
      </div>

      <div v-else-if="filteredGuides.length === 0" class="text-center text-gray-600">
        <p>Aucun guide ne correspond à vos critères.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="guide in filteredGuides"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useSupabaseClient, useRoute } from '#imports'
import { Search } from 'lucide-vue-next'

interface Guide {
  id: string
  name: string
  description: string
  languages: string[]
  price_per_day: number
  image_url: string
}

const route = useRoute()
const supabase = useSupabaseClient()
const guides = ref<Guide[]>([])
const loading = ref(true)
const selectedGuide = ref<Guide | null>(null)
const searchTerm = ref(route.query.search?.toString() || '')
const selectedLanguage = ref('all')
const priceRange = ref('all')
const sortBy = ref('name')

const filteredGuides = computed(() => {
  let filtered = [...guides.value]

  // Filtre par recherche
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(guide => 
      guide.name.toLowerCase().includes(search) ||
      guide.description.toLowerCase().includes(search)
    )
  }

  // Filtre par langue
  if (selectedLanguage.value !== 'all') {
    filtered = filtered.filter(guide => 
      guide.languages.includes(selectedLanguage.value)
    )
  }

  // Filtre par prix
  switch (priceRange.value) {
    case 'low':
      filtered = filtered.filter(guide => guide.price_per_day < 25000)
      break
    case 'medium':
      filtered = filtered.filter(guide => 
        guide.price_per_day >= 25000 && guide.price_per_day <= 50000
      )
      break
    case 'high':
      filtered = filtered.filter(guide => guide.price_per_day > 50000)
      break
  }

  // Tri
  switch (sortBy.value) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'price-asc':
      filtered.sort((a, b) => a.price_per_day - b.price_per_day)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price_per_day - a.price_per_day)
      break
  }

  return filtered
})

const formatPrice = (price: number) => {
  return price.toLocaleString('fr-FR')
}

const handleBookingSuccess = () => {
  selectedGuide.value = null
  alert('Réservation effectuée avec succès !')
}

const fetchGuides = async () => {
  const { data, error } = await supabase
    .from('guides')
    .select('*')
  
  if (error) {
    console.error('Error fetching guides:', error)
  } else {
    guides.value = data || []
  }
  loading.value = false
}

watch([searchTerm, selectedLanguage, priceRange, sortBy], () => {
  // Mettre à jour l'URL avec les paramètres de recherche
  const query: Record<string, string> = {}
  if (searchTerm.value) query.search = searchTerm.value
  if (selectedLanguage.value !== 'all') query.language = selectedLanguage.value
  if (priceRange.value !== 'all') query.price = priceRange.value
  if (sortBy.value !== 'name') query.sort = sortBy.value
})

onMounted(() => {
  fetchGuides()
})
</script>