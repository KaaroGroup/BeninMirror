<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-start space-x-4">
      <div class="flex-shrink-0">
        <img
          :src="userImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'"
          :alt="author"
          class="h-12 w-12 rounded-full object-cover"
        />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-gray-900">{{ author }}</p>
          <p class="text-sm text-gray-500">
            {{ formatDate }}
          </p>
        </div>
        <RatingStars :rating="rating" size="sm" />
        <p class="mt-2 text-sm text-gray-600">{{ comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  author: string
  date: string
  rating: number
  comment: string
  userImage?: string
}

const props = defineProps<Props>()

const formatDate = computed(() => 
  formatDistanceToNow(new Date(props.date), { addSuffix: true, locale: fr })
)
</script>