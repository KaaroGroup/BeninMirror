<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Note
      </label>
      <div class="mt-1">
        <input
          type="range"
          min="1"
          max="5"
          step="0.5"
          v-model="rating"
          class="w-full"
        />
        <div class="mt-2">
          <RatingStars :rating="rating" />
        </div>
      </div>
    </div>

    <div>
      <label for="comment" class="block text-sm font-medium text-gray-700">
        Votre avis
      </label>
      <textarea
        id="comment"
        rows="4"
        v-model="comment"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        placeholder="Partagez votre expérience..."
        required
      />
    </div>

    <button
      type="submit"
      :disabled="isSubmitting"
      class="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50"
    >
      {{ isSubmitting ? 'Envoi en cours...' : 'Publier l\'avis' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  onSubmit: (review: { rating: number; comment: string }) => Promise<void>
}

const props = defineProps<Props>()

const rating = ref(5)
const comment = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await props.onSubmit({
      rating: rating.value,
      comment: comment.value
    })
    comment.value = ''
    rating.value = 5
  } catch (error) {
    console.error('Error submitting review:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>