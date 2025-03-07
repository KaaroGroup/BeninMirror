<template>
  <div class="bg-gray-50 py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Ce que disent nos clients
        </h2>
        <p class="mt-4 text-lg text-gray-600">
          Découvrez les expériences de nos voyageurs
        </p>
      </div>

      <div class="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
        >
          <div class="p-8">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <img
                  :src="testimonial.image"
                  :alt="testimonial.name"
                  class="h-12 w-12 rounded-full object-cover"
                />
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">{{ testimonial.name }}</h3>
                  <p class="text-sm text-gray-500">{{ testimonial.location }}</p>
                </div>
              </div>
              <div class="flex">
                <Star
                  v-for="n in testimonial.rating"
                  :key="n"
                  class="h-5 w-5 text-yellow-400 fill-current"
                />
              </div>
            </div>
            <div class="relative">
              <Quote class="absolute -top-2 -left-2 h-8 w-8 text-emerald-100" />
              <p class="text-gray-600 relative z-10 pl-6">{{ testimonial.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Star, Quote } from 'lucide-vue-next'

const testimonials = [
  {
    name: 'Sophie Martin',
    location: 'France',
    text: 'Une expérience inoubliable au Bénin. Le guide était excellent et les sites touristiques magnifiques.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
  },
  {
    name: 'John Smith',
    location: 'États-Unis',
    text: 'La cuisine béninoise est extraordinaire. Les restaurants recommandés étaient tous excellents.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
  },
  {
    name: 'Aminata Diallo',
    location: 'Sénégal',
    text: 'Service impeccable et organisation parfaite. Je recommande vivement pour découvrir le Bénin.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80'
  }
]
</script>