<template>
  <div class="relative pt-16">
    <div class="absolute inset-0">
      <img
        class="w-full h-[600px] object-cover"
        src="https://journals.openedition.org/com/docannexe/image/10733/img-9-small580.png"
        alt="Paysage du Bénin"
      />
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    </div>
    <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
        Découvrez la magie du Bénin
      </h1>
      <p class="mt-6 text-xl text-white max-w-3xl">
        Explorez les merveilles culturelles, historiques et naturelles du Bénin. 
        Réservez vos visites guidées, hôtels et restaurants en quelques clics.
      </p>
      <div class="mt-10">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Destination</label>
              <select v-model="destination" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                <option value="">Choisir une destination</option>
                <option value="ouidah">Ouidah</option>
                <option value="ganvie">Ganvié</option>
                <option value="abomey">Abomey</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input
                v-model="date"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div class="flex items-end">
              <button 
                @click="search"
                class="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const destination = ref('')
const date = ref('')

const search = () => {
  // Implémentation de la recherche
  console.log('Recherche:', { destination: destination.value, date: date.value })
}
</script>