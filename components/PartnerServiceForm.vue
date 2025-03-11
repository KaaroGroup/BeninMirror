<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
      <h2 class="text-2xl font-bold mb-6">Ajouter un nouveau service</h2>

      <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            type="text"
            v-model="formData.name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            v-model="formData.description"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            required
          ></textarea>
        </div>

        <div v-if="partnerType !== 'transport'">
          <label class="block text-sm font-medium text-gray-700">
            Localisation
          </label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
              <MapPin class="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              v-model="formData.location"
              class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <div v-if="partnerType !== 'restaurant'">
          <label class="block text-sm font-medium text-gray-700">
            {{ getPriceLabel() }}
          </label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
              <DollarSign class="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              v-model="formData.price"
              min="0"
              step="100"
              class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <!-- Champs spécifiques pour les restaurants -->
        <template v-if="partnerType === 'restaurant'">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Type de cuisine
            </label>
            <select
              v-model="formData.cuisineType"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            >
              <option value="">Sélectionnez un type</option>
              <option value="Béninoise">Béninoise</option>
              <option value="Africaine">Africaine</option>
              <option value="Internationale">Internationale</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Gamme de prix
            </label>
            <select
              v-model="formData.priceRange"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            >
              <option value="">Sélectionnez une gamme</option>
              <option value="€">€ - Économique</option>
              <option value="€€">€€ - Intermédiaire</option>
              <option value="€€€">€€€ - Haut de gamme</option>
            </select>
          </div>
        </template>

        <!-- Champs spécifiques pour les guides -->
        <div v-if="partnerType === 'transport'">
          <label class="block text-sm font-medium text-gray-700">
            Langues parlées
          </label>
          <div class="mt-2 space-y-2">
            <label v-for="lang in ['Français', 'Anglais', 'Fon', 'Yoruba']" :key="lang" class="inline-flex items-center mr-4">
              <input
                type="checkbox"
                :checked="formData.languages.includes(lang)"
                @change="toggleLanguage(lang)"
                class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span class="ml-2">{{ lang }}</span>
            </label>
          </div>
          <p v-if="formData.languages.length === 0" class="mt-1 text-sm text-red-600">
            Sélectionnez au moins une langue
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            URL de l'image
          </label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Image class="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              v-model="formData.imageUrl"
              placeholder="https://example.com/image.jpg"
              class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>
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
            class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
            :disabled="loading || (partnerType === 'transport' && formData.languages.length === 0)"
          >
            {{ loading ? 'Ajout en cours...' : 'Ajouter le service' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useSupabaseClient } from '#imports'
import { MapPin, DollarSign, Image } from 'lucide-vue-next'

const props = defineProps<{
  partnerType: string
  partnerId: string
  onSuccess: () => void
  onCancel: () => void
}>()

const supabase = useSupabaseClient()
const loading = ref(false)
const error = ref('')

const formData = reactive({
  name: '',
  description: '',
  location: '',
  price: '',
  imageUrl: '',
  cuisineType: '', // Pour les restaurants
  priceRange: '', // Pour les restaurants
  languages: [] as string[], // Pour les guides
})

const getPriceLabel = () => {
  switch (props.partnerType) {
    case 'cultural_site':
      return 'Prix d\'entrée (FCFA)'
    case 'accommodation':
      return 'Prix par nuit (FCFA)'
    case 'transport':
      return 'Prix par jour (FCFA)'
    default:
      return 'Prix (FCFA)'
  }
}

const toggleLanguage = (lang: string) => {
  const index = formData.languages.indexOf(lang)
  if (index === -1) {
    formData.languages.push(lang)
  } else {
    formData.languages.splice(index, 1)
  }
}

const validateForm = () => {
  if (!formData.name.trim()) {
    error.value = 'Le nom est requis'
    return false
  }
  if (!formData.description.trim()) {
    error.value = 'La description est requise'
    return false
  }
  if (props.partnerType !== 'transport' && !formData.location.trim()) {
    error.value = 'La localisation est requise'
    return false
  }
  if (props.partnerType === 'transport' && formData.languages.length === 0) {
    error.value = 'Sélectionnez au moins une langue'
    return false
  }
  if (!formData.imageUrl.trim()) {
    error.value = 'L\'URL de l\'image est requise'
    return false
  }
  if (!formData.imageUrl.match(/^https?:\/\/.+\/.+$/)) {
    error.value = 'L\'URL de l\'image doit être une URL valide (commençant par http:// ou https://)'
    return false
  }
  if (props.partnerType === 'restaurant') {
    if (!formData.cuisineType) {
      error.value = 'Le type de cuisine est requis'
      return false
    }
    if (!formData.priceRange) {
      error.value = 'La gamme de prix est requise'
      return false
    }
  } else if (!formData.price || parseFloat(formData.price) <= 0) {
    error.value = 'Le prix doit être supérieur à 0'
    return false
  }
  return true
}

const getTableName = (partnerType: string) => {
  switch (partnerType) {
    case 'cultural_site':
      return 'tourist_sites'
    case 'accommodation':
      return 'hotels'
    case 'restaurant':
      return 'restaurants'
    case 'transport':
      return 'guides'
    default:
      throw new Error('Type de partenaire non valide')
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    if (!validateForm()) {
      loading.value = false
      return
    }

    const tableName = getTableName(props.partnerType)

    let data: Record<string, any> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      image_url: formData.imageUrl.trim(),
      partner_id: props.partnerId
    }

    // Ajouter les champs spécifiques selon le type
    if (props.partnerType === 'restaurant') {
      Object.assign(data, {
        location: formData.location.trim(),
        cuisine_type: formData.cuisineType,
        price_range: formData.priceRange
      })
    } else if (props.partnerType === 'transport') {
      Object.assign(data, {
        languages: formData.languages,
        price_per_day: parseFloat(formData.price)
      })
    } else {
      Object.assign(data, {
        location: formData.location.trim(),
        price: parseFloat(formData.price)
      })
      
      // Ajuster le nom du champ de prix pour les hôtels
      if (props.partnerType === 'accommodation') {
        data.price_per_night = data.price
        delete data.price
      }
    }

    const { error: insertError } = await supabase
      .from(tableName)
      .insert([data])

    if (insertError) {
      console.error('Error details:', insertError)
      
      if (insertError.code === '23505') { // Code pour violation de contrainte unique
        error.value = 'Un service avec ce nom existe déjà'
      } else if (insertError.code === '23503') { // Code pour violation de clé étrangère
        error.value = 'Erreur de référence : le partenaire n\'existe pas'
      } else if (insertError.code === '23502') { // Code pour violation de contrainte NOT NULL
        error.value = 'Tous les champs requis doivent être remplis'
      } else {
        error.value = `Erreur lors de l'ajout du service : ${insertError.message}`
      }
      return
    }

    props.onSuccess()
  } catch (err) {
    console.error('Error adding service:', err)
    error.value = err instanceof Error ? err.message : 'Une erreur inattendue est survenue'
  } finally {
    loading.value = false
  }
}
</script>