<template>
  <div class="min-h-screen pt-16 px-4 bg-gray-50">
    <div class="max-w-2xl mx-auto py-12">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-2xl font-bold text-center mb-8">
          Inscription Partenaire
        </h1>

        <div v-if="!user" class="text-center">
          <p class="text-center text-gray-600 mb-8">
            Pour devenir partenaire, vous devez d'abord créer un compte ou vous connecter.
          </p>
          <div class="space-y-4">
            <NuxtLink
              to="/auth"
              class="block w-full bg-emerald-600 text-white text-center py-2 px-4 rounded-md hover:bg-emerald-700"
            >
              Se connecter
            </NuxtLink>
            <div class="text-center">
              <span class="text-gray-600">Pas encore de compte ?</span>
              <NuxtLink
                to="/auth"
                class="ml-2 text-emerald-600 hover:text-emerald-700"
              >
                S'inscrire
              </NuxtLink>
            </div>
          </div>
        </div>

        <template v-else>
          <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-600">{{ error }}</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Type de partenaire
              </label>
              <select
                v-model="formData.typeId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
                @change="error = ''"
              >
                <option value="">Sélectionnez un type</option>
                <option v-for="type in partnerTypes" :key="type.id" :value="type.id">
                  {{ type.description }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Nom de l'entreprise
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Building2 class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  v-model="formData.businessName"
                  class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  @input="error = ''"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Personne de contact
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Briefcase class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  v-model="formData.contactPerson"
                  class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  @input="error = ''"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Phone class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  v-model="formData.phone"
                  class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  @input="error = ''"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MapPin class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  v-model="formData.address"
                  class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  @input="error = ''"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Numéro d'enregistrement (optionnel)
              </label>
              <input
                type="text"
                v-model="formData.registrationNumber"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                @input="error = ''"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {{ loading ? 'Inscription en cours...' : 'S\'inscrire en tant que partenaire' }}
            </button>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSupabaseClient, useRouter } from '#imports'
import { Building2, Phone, MapPin, Briefcase } from 'lucide-vue-next'

interface PartnerType {
  id: string
  name: string
  description: string
}

const { user } = useAuth()
const router = useRouter()
const supabase = useSupabaseClient()
const partnerTypes = ref<PartnerType[]>([])
const loading = ref(false)
const error = ref('')

const formData = reactive({
  typeId: '',
  businessName: '',
  contactPerson: '',
  phone: '',
  address: '',
  registrationNumber: ''
})

const validateForm = () => {
  if (!formData.typeId) {
    error.value = 'Veuillez sélectionner un type de partenaire'
    return false
  }
  if (!formData.businessName.trim()) {
    error.value = 'Le nom de l\'entreprise est requis'
    return false
  }
  if (!formData.contactPerson.trim()) {
    error.value = 'Le nom de la personne de contact est requis'
    return false
  }
  if (!formData.phone.trim()) {
    error.value = 'Le numéro de téléphone est requis'
    return false
  }
  if (!formData.address.trim()) {
    error.value = 'L\'adresse est requise'
    return false
  }
  return true
}

const checkExistingPartner = async () => {
  if (!user.value) return false

  const { data, error: checkError } = await supabase
    .from('partners')
    .select('id')
    .eq('user_id', user.value.id)
    .maybeSingle()

  if (checkError) throw checkError
  return !!data
}

const handleSubmit = async () => {
  if (!user.value) return

  error.value = ''
  if (!validateForm()) return

  loading.value = true

  try {
    // Vérifier si l'utilisateur est déjà partenaire
    const isExistingPartner = await checkExistingPartner()

    if (isExistingPartner) {
      error.value = 'Vous êtes déjà inscrit en tant que partenaire'
      return
    }

    // Créer le nouveau partenaire
    const { data: newPartner, error: insertError } = await supabase
      .from('partners')
      .insert([{
        user_id: user.value.id,
        type_id: formData.typeId,
        business_name: formData.businessName,
        contact_person: formData.contactPerson,
        phone: formData.phone,
        address: formData.address,
        registration_number: formData.registrationNumber || null
      }])
      .select()
      .single()

    if (insertError) throw insertError

    // Créer les statistiques initiales du partenaire
    if (newPartner) {
      await supabase
        .from('partner_stats')
        .insert([{
          partner_id: newPartner.id,
          total_bookings: 0,
          total_revenue: 0
        }])
    }

    router.push('/partner/dashboard')
  } catch (err) {
    console.error('Error during partner registration:', err)
    error.value = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const { data, error: fetchError } = await supabase
    .from('partner_types')
    .select('*')
  
  if (fetchError) {
    console.error('Error fetching partner types:', fetchError)
    error.value = 'Erreur lors du chargement des types de partenaires'
  } else {
    partnerTypes.value = data || []
  }
})
</script>