<template>
  <div class="min-h-screen pt-16 px-4">
    <div class="max-w-7xl mx-auto py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Sites Touristiques</h1>
      
      <div v-if="loading" class="text-center py-12">
        <p>Chargement...</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="site in sites"
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
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'

interface TouristSite {
  id: string
  name: string
  description: string
  location: string
  price: number
  image_url: string
}

const supabase = useSupabaseClient()
const sites = ref<TouristSite[]>([])
const loading = ref(true)
const selectedSite = ref<TouristSite | null>(null)

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
    .order('name')
  
  if (error) {
    console.error('Error fetching sites:', error)
  } else {
    sites.value = data || []
  }
  loading.value = false
}

onMounted(() => {
  fetchSites()
})
</script>