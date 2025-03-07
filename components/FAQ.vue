<template>
  <div class="bg-white py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Questions fréquentes
        </h2>
        <p class="mt-4 text-lg text-gray-600">
          Tout ce que vous devez savoir pour préparer votre voyage
        </p>
      </div>

      <div class="mt-12 max-w-3xl mx-auto">
        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              class="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 focus:outline-none"
              @click="openIndex = openIndex === index ? null : index"
            >
              <span class="text-lg font-medium text-gray-900">{{ faq.question }}</span>
              <ChevronUp v-if="openIndex === index" class="h-5 w-5 text-gray-500" />
              <ChevronDown v-else class="h-5 w-5 text-gray-500" />
            </button>
            <div v-if="openIndex === index" class="px-6 py-4 bg-gray-50">
              <p class="text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

const openIndex = ref<number | null>(null)

const faqs = [
  {
    question: 'Quelles sont les options de paiement acceptées ?',
    answer: 'Nous acceptons les paiements par mobile money. Pour votre sécurité, tous les paiements sont traités via des plateformes sécurisées.'
  },
  {
    question: 'Comment puis-je réserver un guide touristique ?',
    answer: 'Vous pouvez réserver un guide directement sur notre site dans la section "Guides". Choisissez votre guide en fonction de ses spécialités et des langues parlées, puis sélectionnez vos dates.'
  },
  {
    question: 'Quelle est votre politique d\'annulation ?',
    answer: 'Nous offrons un remboursement complet pour les annulations effectuées au moins 7 jours avant la date prévue. Pour les annulations plus tardives, des frais peuvent s\'appliquer.'
  }
]
</script>