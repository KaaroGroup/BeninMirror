<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4">Réservation</h2>
      
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Date de début
          </label>
          <input
            type="date"
            v-model="startDate"
            :min="minDate"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div v-if="type !== 'restaurant' && type !== 'tourist_site'">
          <label class="block text-sm font-medium text-gray-700">
            Date de fin
          </label>
          <input
            type="date"
            v-model="endDate"
            :min="startDate || minDate"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="onCancel"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            :disabled="loading"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? 'Réservation...' : 'Confirmer la réservation' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSupabaseClient } from '#imports'
import { useAuth } from '~/composables/useAuth'

const props = defineProps<{
  type: 'tourist_site' | 'hotel' | 'restaurant' | 'guide'
  itemId: string
  price: number
  onSuccess: () => void
  onCancel: () => void
}>()

const { user } = useAuth()
const supabase = useSupabaseClient()
const startDate = ref('')
const endDate = ref('')
const loading = ref(false)
const error = ref('')

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const handleSubmit = async () => {
  if (!user.value) {
    error.value = 'Vous devez être connecté pour effectuer une réservation'
    return
  }

  loading.value = true
  error.value = ''

  const days = computed(() => {
    if (!startDate.value) return 1
    if (!endDate.value || props.type === 'restaurant' || props.type === 'tourist_site') return 1
    return Math.ceil(
      (new Date(endDate.value).getTime() - new Date(startDate.value).getTime()) / (1000 * 60 * 60 * 24)
    )
  })

  const totalPrice = computed(() => props.price * days.value)

  const bookingData = {
    user_id: user.value.id,
    start_date: startDate.value,
    end_date: endDate.value || startDate.value,
    total_price: totalPrice.value,
    [`${props.type}_id`]: props.itemId
  }

  try {
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert([bookingData])

    if (bookingError) {
      console.error('Booking error:', bookingError)
      error.value = 'Erreur lors de la réservation. Veuillez réessayer.'
    } else {
      props.onSuccess()
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = 'Une erreur inattendue est survenue'
  } finally {
    loading.value = false
  }
}
</script>