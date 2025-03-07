<template>
  <div class="min-h-screen pt-16 px-4">
    <div class="max-w-7xl mx-auto py-12">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Restaurants</h1>
        
        <div class="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un restaurant..."
              v-model="searchTerm"
              class="pl-10 pr-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <select
            v-model="selectedCuisine"
            class="px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">Toutes les cuisines</option>
            <option value="Béninoise">Béninoise</option>
            <option value="Africaine">Africaine</option>
            <option value="Internationale">Internationale</option>
          </select>

          <select
            v-model="selectedPriceRange"
            class="px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">Tous les prix</option>
            <option value="€">€ - Économique</option>
            <option value="€€">€€ - Intermédiaire</option>
            <option value="€€€">€€€ - Haut de gamme</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p>Chargement...</p>
      </div>

      <p v-else-if="restaurants.length === 0" class="text-center text-gray-600">
        Aucun restaurant ne correspond à vos critères.
      </p>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="restaurant in filteredRestaurants"
          :key="restaurant.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img
            :src="restaurant.image_url"
            :alt="restaurant.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <div class="flex justify-between items-start mb-2">
              <h2 class="text-xl font-semibold text-gray-900">{{ restaurant.name }}</h2>
              <span class="text-emerald-600">{{ restaurant.price_range }}</span>
            </div>
            <p class="text-gray-600 mb-2">{{ restaurant.description }}</p>
            <p class="text-sm text-emerald-600 mb-4">
              Cuisine: {{ restaurant.cuisine_type }}
            </p>
            <div class="flex justify-end">
              <button
                @click="selectedRestaurant = restaurant"
                class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
              >
                Réserver
              </button>
            </div>
          </div>
        </div>
      </div>

      <BookingForm
        v-if="selectedRestaurant"
        type="restaurant"
        :itemId="selectedRestaurant.id"
        :price="5000"
        @success="handleBookingSuccess"
        @cancel="selectedRestaurant = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from 'lucide-vue-next'
import { useSupabaseClient } from '#imports'

interface Restaurant {
  id: string
  name: string
  description: string
  location: string
  cuisine_type: string
  price_range: string
  image_url: string
}

const supabase = useSupabaseClient()
const restaurants = ref<Restaurant[]>([])
const loading = ref(true)
const selectedRestaurant = ref<Restaurant | null>(null)
const searchTerm = ref('')
const selectedCuisine = ref('all')
const selectedPriceRange = ref('all')

const filteredRestaurants = computed(() => {
  let filtered = restaurants.value

  if (searchTerm.value) {
    filtered = filtered.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (selectedCuisine.value !== 'all') {
    filtered = filtered.filter(restaurant => 
      restaurant.cuisine_type === selectedCuisine.value
    )
  }

  if (selectedPriceRange.value !== 'all') {
    filtered = filtered.filter(restaurant => 
      restaurant.price_range === selectedPriceRange.value
    )
  }

  return filtered
})

const handleBookingSuccess = () => {
  selectedRestaurant.value = null
  alert('Réservation effectuée avec succès !')
}

const fetchRestaurants = async () => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching restaurants:', error)
  } else {
    restaurants.value = data || []
  }
  loading.value = false
}

onMounted(() => {
  fetchRestaurants()
})
</script>