<template>
  <div class="bg-white py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">Contactez-nous</h2>
        <p class="mt-4 text-lg text-gray-600">
          Une question ? N'hésitez pas à nous contacter !
        </p>
      </div>

      <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div class="space-y-8">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Phone class="h-6 w-6 text-emerald-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-medium text-gray-900">Téléphone</h3>
                <p class="mt-1 text-gray-600">+229016732576 / +2290166672622</p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Mail class="h-6 w-6 text-emerald-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-medium text-gray-900">Email</h3>
                <p class="mt-1 text-gray-600">kaarogroupsarl@gmail.com</p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0">
                <MapPin class="h-6 w-6 text-emerald-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-medium text-gray-900">Adresse</h3>
                <p class="mt-1 text-gray-600">Akonaboè, Porto-Novo (Bénin)</p>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Nom et prénoms
            </label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700">
              Sujet
            </label>
            <input
              type="text"
              id="subject"
              v-model="formData.subject"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label for="message" class="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="4"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            class="w-full flex justify-center items-center bg-emerald-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Send class="h-5 w-5 mr-2" />
            Envoyer le message
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Phone, MapPin, Send } from 'lucide-vue-next'

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const handleSubmit = () => {
  // Ici, vous pouvez ajouter la logique pour envoyer le message
  console.log('Form submitted:', formData.value)
  alert('Message envoyé avec succès !')
  formData.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
}
</script>