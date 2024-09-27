<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-6">Coming Soon</h1>
      <p class="text-lg text-gray-600 mb-8">We're working hard to bring something awesome. Stay tuned!</p>
      <div class="flex justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          class="px-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button class="ml-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
          Notify Me
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComingSoon",
};
</script>

<style scoped>
</style>
