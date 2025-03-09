<template>
  <div class="min-h-screen pt-16 px-4">
    <div class="max-w-7xl mx-auto py-12">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Sites Touristiques</h1>
        
        <div class="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un site..."
              v-model="searchTerm"
              class="pl-10 pr-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <select
            v-model="priceRange"
            class="px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">Tous les prix</option>
            <option value="low">{"< 5,000 FCFA"}</option>
            <option value="medium">5,000 - 15,000 FCFA</option>
            <option value="high">{"> 15,000 FCFA"}</option>
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
      
      <div v-else-if="filteredSites.length === 0" class="text-center py-12">
        <p class="text-gray-600">Aucun site ne correspond à vos critères.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="site in filteredSites"
          :key="site.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img
            :src="site.image_url"
            :alt="site.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ site.name }}</h2>
            <p class="text-gray-600 mb-4">{{ site.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-emerald-600 font-semibold">
                {{ formatPrice(site.price) }} FCFA
              </span>
              <button
                @click="selectedSite = site"
                class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
              >
                Réserver
              </button>
            </div>
          </div>
        </div>
      </div>

      <BookingForm
        v-if="selectedSite"
        type="tourist_site"
        :itemId="selectedSite.id"
        :price="selectedSite.price"
        :onSuccess="handleBookingSuccess"
        :onCancel="() => selectedSite = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSupabaseClient, useRoute } from '#imports'
import { Search } from 'lucide-vue-next'

interface TouristSite {
  id: string
  name: string
  description: string
  location: string
  price: number
  image_url: string
}

const route = useRoute()
const supabase = useSupabaseClient()
const sites = ref<TouristSite[]>([])
const loading = ref(true)
const selectedSite = ref<TouristSite | null>(null)
const searchTerm = ref(route.query.search?.toString() || '')
const priceRange = ref('all')
const sortBy = ref('name')

const filteredSites = computed(() => {
  let filtered = [...sites.value]

  // Filtre par recherche
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(site => 
      site.name.toLowerCase().includes(search) ||
      site.description.toLowerCase().includes(search) ||
      site.location.toLowerCase().includes(search)
    )
  }

  // Filtre par prix
  switch (priceRange.value) {
    case 'low':
      filtered = filtered.filter(site => site.price < 5000)
      break
    case 'medium':
      filtered = filtered.filter(site => site.price >= 5000 && site.price <= 15000)
      break
    case 'high':
      filtered = filtered.filter(site => site.price > 15000)
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
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
  }

  return filtered
})

const formatPrice = (price: number) => {
  return price.toLocaleString('fr-FR')
}

const handleBookingSuccess = () => {
  selectedSite.value = null
  alert('Réservation effectuée avec succès !')
}

const fetchSites = async () => {
  const { data, error } = await supabase
    .from('tourist_sites')
    .select('*')
  
  if (error) {
    console.error('Error fetching sites:', error)
  } else {
    sites.value = data || []
  }
  loading.value = false
}

watch([searchTerm, priceRange, sortBy], () => {
  // Mettre à jour l'URL avec les paramètres de recherche
  const query: Record<string, string> = {}
  if (searchTerm.value) query.search = searchTerm.value
  if (priceRange.value !== 'all') query.price = priceRange.value
  if (sortBy.value !== 'name') query.sort = sortBy.value
})

onMounted(() => {
  fetchSites()
})
</script>