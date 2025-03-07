<template>
  <div class="flex">
    <Star
      v-for="i in fullStars"
      :key="`full-${i}`"
      :class="[starSizes[size], 'text-yellow-400 fill-current']"
    />
    <StarHalf
      v-if="hasHalfStar"
      :class="[starSizes[size], 'text-yellow-400 fill-current']"
    />
    <Star
      v-for="i in emptyStars"
      :key="`empty-${i}`"
      :class="[starSizes[size], 'text-gray-300']"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Star, StarHalf } from 'lucide-vue-next'

interface Props {
  rating: number
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const starSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
}

const fullStars = computed(() => Math.floor(props.rating))
const hasHalfStar = computed(() => props.rating % 1 >= 0.5)
const emptyStars = computed(() => 5 - Math.ceil(props.rating))
</script>