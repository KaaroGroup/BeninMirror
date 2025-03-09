<template>
  <div class="min-h-screen pt-16 px-4 bg-gray-50">
    <div class="max-w-7xl mx-auto py-12">
      <div v-if="loading" class="text-center py-12">
        <p>Chargement...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <template v-else-if="partnerData">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">
            Tableau de bord - {{ partnerData.business_name }}
          </h1>
          <p class="mt-2 text-gray-600">
            {{ partnerData.type?.description }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-emerald-100">
                <Users class="h-6 w-6 text-emerald-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Réservations totales</p>
                <p class="text-lg font-semibold text-gray-900">{{ stats?.total_bookings || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-emerald-100">
                <DollarSign class="h-6 w-6 text-emerald-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Revenu total</p>
                <p class="text-lg font-semibold text-gray-900">
                  {{ formatPrice(stats?.total_revenue || 0) }} FCFA
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-emerald-100">
                <Calendar class="h-6 w-6 text-emerald-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Dernière réservation</p>
                <p class="text-lg font-semibold text-gray-900">
                  {{ stats?.last_booking_date 
                    ? formatDate(stats.last_booking_date)
                    : 'Aucune' }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-emerald-100">
                <BarChart class="h-6 w-6 text-emerald-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Taux de conversion</p>
                <p class="text-lg font-semibold text-gray-900">--</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Liste des services -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold">Mes services</h2>
            <button
              @click="showServiceForm = true"
              class="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
            >
              <Plus class="h-5 w-5 mr-2" />
              Ajouter un service
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="service in services"
              :key="service.id"
              class="border rounded-lg overflow-hidden"
            >
              <img
                :src="service.image_url"
                :alt="service.name"
                class="w-full h-48 object-cover"
              />
              <div class="p-4">
                <h3 class="font-semibold text-lg mb-2">{{ service.name }}</h3>
                <p class="text-gray-600 text-sm mb-4">{{ service.description }}</p>
                <div class="flex justify-between items-center">
                  <div class="text-emerald-600 font-medium">
                    <template v-if="service.price_per_night">
                      {{ formatPrice(service.price_per_night) }} FCFA/nuit
                    </template>
                    <template v-else-if="service.price_per_day">
                      {{ formatPrice(service.price_per_day) }} FCFA/jour
                    </template>
                    <template v-else-if="service.price">
                      {{ formatPrice(service.price) }} FCFA
                    </template>
                    <template v-else-if="service.price_range">
                      {{ service.price_range }}
                    </template>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="handleDeleteService(service.id)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulaire d'ajout de service -->
        <PartnerServiceForm
          v-if="showServiceForm"
          :partnerType="partnerData.type?.name"
          :partnerId="partnerData.id"
          :onSuccess="handleServiceFormSuccess"
          :onCancel="() => showServiceForm = false"
        />
      </template>

      <div v-else class="text-center py-12">
        <p>Vous n'êtes pas encore inscrit en tant que partenaire.</p>
        <NuxtLink
          to="/partner/register"
          class="inline-block mt-4 bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700"
        >
          Devenir partenaire
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSupabaseClient } from '#imports'
import { Users, DollarSign, Calendar, BarChart, Plus, Trash2 } from 'lucide-vue-next'

interface PartnerData {
  id: string
  business_name: string
  type?: {
    name: string
    description: string
  }
}

interface Stats {
  total_bookings: number
  total_revenue: number
  last_booking_date: string | null
}

interface Service {
  id: string
  name: string
  description: string
  image_url: string
  price?: number
  price_per_night?: number
  price_per_day?: number
  location?: string
  cuisine_type?: string
  price_range?: string
  languages?: string[]
}

const { user } = useAuth()
const supabase = useSupabaseClient()
const partnerData = ref<PartnerData | null>(null)
const stats = ref<Stats | null>(null)
const services = ref<Service[]>([])
const loading = ref(true)
const error = ref('')
const showServiceForm = ref(false)

const formatPrice = (price: number) => {
  return price.toLocaleString('fr-FR')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
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
      return ''
  }
}

const handleDeleteService = async (serviceId: string) => {
  if (!partnerData.value?.type?.name) return

  const tableName = getTableName(partnerData.value.type.name)
  const { error: deleteError } = await supabase
    .from(tableName)
    .delete()
    .eq('id', serviceId)

  if (deleteError) {
    console.error('Error deleting service:', deleteError)
    alert('Une erreur est survenue lors de la suppression')
  } else {
    services.value = services.value.filter(s => s.id !== serviceId)
  }
}

const handleServiceFormSuccess = () => {
  showServiceForm.value = false
  fetchPartnerData()
}

const fetchPartnerData = async () => {
  if (!user.value) {
    loading.value = false
    return
  }

  try {
    // Récupérer les données du partenaire avec le type
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select(`
        id,
        business_name,
        type:type_id (
          name,
          description
        )
      `)
      .eq('user_id', user.value.id)
      .maybeSingle()

    if (partnerError) throw partnerError

    if (partner) {
      partnerData.value = partner

      // Récupérer les statistiques
      const { data: statsData } = await supabase
        .from('partner_stats')
        .select('*')
        .eq('partner_id', partner.id)
        .maybeSingle()

      stats.value = statsData || { total_bookings: 0, total_revenue: 0, last_booking_date: null }

      // Récupérer les services
      if (partner.type?.name) {
        const tableName = getTableName(partner.type.name)
        if (tableName) {
          const { data: servicesData } = await supabase
            .from(tableName)
            .select('*')
            .eq('partner_id', partner.id)

          services.value = servicesData || []
        }
      }
    } else {
      partnerData.value = null
    }
  } catch (err) {
    console.error('Error fetching partner data:', err)
    error.value = 'Une erreur est survenue lors du chargement des données'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPartnerData()
})
</script>