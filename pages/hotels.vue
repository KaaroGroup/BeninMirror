<template>
  <div class="min-h-screen pt-16 px-4">
    <div class="max-w-7xl mx-auto py-12">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Hôtels</h1>
        
        <div class="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un hôtel..."
              v-model="searchTerm"
              class="pl-10 pr-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <select
            v-model="priceRange"
            class="px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">Tous les prix</option>
            <option value="low">{"< 50,000 FCFA"}</option>
            <option value="medium">50,000 - 100,000 FCFA</option>
            <option value="high">{"> 100,000 FCFA"}</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p>Chargement...</p>
      </div>

      <p v-else-if="filteredHotels.length === 0" class="text-center text-gray-600">
        Aucun hôtel ne correspond à vos critères.
      </p>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="hotel in filteredHotels"
          :key="hotel.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img
            :src="hotel.image_url"
            :alt="hotel.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ hotel.name }}</h2>
            <p class="text-gray-600 mb-4">{{ hotel.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-emerald-600 font-semibold">
                {{ formatPrice(hotel.price_per_night) }} FCFA / nuit
              </span>
              <button
                @click="selectedHotel = hotel"
                class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
              >
                Réserver
              </button>
            </div>
          </div>
        </div>
      </div>

      <BookingForm
        v-if="selectedHotel"
        type="hotel"
        :itemId="selectedHotel.id"
        :price="selectedHotel.price_per_night"
        @success="handleBookingSuccess"
        @cancel="selectedHotel = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from 'lucide-vue-next'
import { useSupabaseClient } from '#imports'

interface Hotel {
  id: string
  name: string
  description: string
  location: string
  price_per_night: number
  image_url: string
}

const supabase = useSupabaseClient()
const hotels = ref<Hotel[]>([])
const loading = ref(true)
const selectedHotel = ref<Hotel | null>(null)
const searchTerm = ref('')
const priceRange = ref('all')

const filteredHotels = computed(() => {
  let filtered = hotels.value

  if (searchTerm.value) {
    filtered = filtered.filter(hotel => 
      hotel.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  switch (priceRange.value) {
    case 'low':
      filtered = filtered.filter(hotel => hotel.price_per_night <= 50000)
      break
    case 'medium':
      filtered = filtered.filter(hotel => 
        hotel.price_per_night > 50000 && hotel.price_per_night <= 100000
      )
      break
    case 'high':
      filtered = filtered.filter(hotel => hotel.price_per_night > 100000)
      break
  }

  return filtered
})

const formatPrice = (price: number) => {
  return price.toLocaleString('fr-FR')
}

const handleBookingSuccess = () => {
  selectedHotel.value = null
  alert('Réservation effectuée avec succès !')
}

const fetchHotels = async () => {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching hotels:', error)
  } else {
    hotels.value = data || []
  }
  loading.value = false
}

onMounted(() => {
  fetchHotels()
})
</script>