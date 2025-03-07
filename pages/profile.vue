<template>
  <div class="min-h-screen pt-16 px-4">
    <div class="max-w-4xl mx-auto py-12">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-bold">Mon Profil</h1>
          <button
            @click="handleSignOut"
            class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            Se déconnecter
          </button>
        </div>
        
        <div class="mb-8">
          <h2 class="text-lg font-semibold mb-2">Informations personnelles</h2>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-gray-600">Email: {{ user?.email }}</p>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-4">Mes Réservations</h2>
          <div v-if="loading" class="text-center py-4">
            <p>Chargement des réservations...</p>
          </div>
          <p v-else-if="bookings.length === 0" class="text-gray-600">
            Aucune réservation pour le moment.
          </p>
          <div v-else class="space-y-4">
            <div
              v-for="booking in bookings"
              :key="booking.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium">{{ getBookingTitle(booking) }}</h3>
                  <p class="text-sm text-gray-600">
                    Du {{ formatDate(booking.start_date) }}
                    <template v-if="booking.end_date && booking.end_date !== booking.start_date">
                      au {{ formatDate(booking.end_date) }}
                    </template>
                  </p>
                </div>
                <div class="text-right">
                  <span class="text-emerald-600 font-medium">
                    {{ formatPrice(booking.total_price) }} FCFA
                  </span>
                  <p class="text-sm text-gray-500 mt-1">
                    Status: {{ booking.status }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSupabaseClient, useRouter } from '#imports'

const { user, signOut } = useAuth()
const router = useRouter()
const supabase = useSupabaseClient()
const bookings = ref<Booking[]>([])
const loading = ref(true)

interface Booking {
  id: string
  start_date: string
  end_date: string
  total_price: number
  status: string
  tourist_site?: { name: string }
  hotel?: { name: string }
  restaurant?: { name: string }
  guide?: { name: string }
}

const handleSignOut = async () => {
  await signOut()
  router.push('/')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatPrice = (price: number) => {
  return price.toLocaleString('fr-FR')
}

const getBookingTitle = (booking: Booking) => {
  if (booking.tourist_site) return booking.tourist_site.name
  if (booking.hotel) return booking.hotel.name
  if (booking.restaurant) return booking.restaurant.name
  if (booking.guide) return booking.guide.name
  return 'Réservation'
}

const fetchBookings = async () => {
  if (!user.value) return

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      start_date,
      end_date,
      total_price,
      status,
      tourist_site:tourist_site_id(name),
      hotel:hotel_id(name),
      restaurant:restaurant_id(name),
      guide:guide_id(name)
    `)
    .eq('user_id', user.value.id)
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
  } else {
    bookings.value = data || []
  }
  loading.value = false
}

onMounted(() => {
  fetchBookings()
})
</script>