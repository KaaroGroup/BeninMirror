<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Navbar />
    <div class="flex-grow">
      <slot />
    </div>
    <Footer />
  </div>
</template>
