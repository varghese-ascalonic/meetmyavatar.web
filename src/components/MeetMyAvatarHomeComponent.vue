<template>
    <div class="bg-gray-50 overflow-x-hidden">
        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <!-- Superhero Cat Image Above the Title -->
                <img src="https://meetmyavatarstatic.blob.core.windows.net/staticfiles/cat-superhero.png"
                    alt="Superhero Cat" class="mx-auto mb-6 w-32 h-32 object-contain" />
                <h1 class="text-5xl font-extrabold mb-4">MeetMyAvatar</h1>
                <p class="text-2xl mb-8">Gives your chat superpowers!</p>
                <a href="#/authenticate"
                    class="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300">
                    Create Your Avatar
                </a>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-20">
            <div class="max-w-6xl mx-auto px-4 sm:px-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <img src="https://source.unsplash.com/featured/?avatar" alt="Avatar Illustration"
                            class="w-full rounded-xl shadow-2xl" />
                    </div>
                    <div>
                        <h2 class="text-4xl font-bold text-gray-800 mb-6">Your 24/7 Messaging Clone</h2>
                        <p class="text-lg text-gray-600 mb-6">
                            Create an avatar that handles your messages while you rest—replying automatically and
                            alerting you only when it matters.
                        </p>
                        <ul class="space-y-4">
                            <li class="flex items-center">
                                <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor"
                                    stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span class="text-gray-700 text-lg">Instant avatar creation</span>
                            </li>
                            <li class="flex items-center">
                                <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor"
                                    stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span class="text-gray-700 text-lg">Smart auto-replies</span>
                            </li>
                            <li class="flex items-center">
                                <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor"
                                    stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span class="text-gray-700 text-lg">Never miss an important message</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Video Showcase Section -->
        <section class="py-20 bg-gray-100">
            <div class="max-w-6xl mx-auto px-4 sm:px-6">
                <h2 class="text-4xl font-bold text-gray-800 text-center mb-12">See It in Action</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div v-for="(video, index) in videos" :key="index" class="relative">
                        <video :src="video.url" autoplay muted loop playsinline
                            class="w-full rounded-xl shadow-2xl aspect-[9/16]" @play="handleVideoPlay(index)"></video>
                        <transition name="fade">
                            <div v-if="video.showCaption" class="absolute inset-0 flex items-center justify-center">
                                <h3 class="text-3xl font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded">
                                    {{ video.caption }}
                                </h3>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </section>

        <!-- Call-to-Action Section -->
        <section class="bg-gradient-to-r from-indigo-700 to-blue-600 py-16">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <h2 class="text-4xl font-bold text-white mb-4">Ready to Get Superpowered?</h2>
                <p class="text-xl text-white mb-8">
                    Let your avatar do the talking – even when you're asleep.
                </p>
                <a href="/authenticate"
                    class="inline-block bg-white text-indigo-700 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300">
                    Get Started Now
                </a>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-800 text-gray-300 py-8">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <p>&copy; 2025 MeetMyAvatar. All rights reserved.</p>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: "MeetMyAvatarHomeComponent",
    data() {
        return {
            videos: [
                {
                    url: "https://meetmyavatarstatic.blob.core.windows.net/staticfiles/videos/eat.mp4",
                    caption: "You eat, I talk",
                    showCaption: false,
                },
                {
                    url: "https://meetmyavatarstatic.blob.core.windows.net/staticfiles/videos/sleep.mp4",
                    caption: "You sleep, I talk",
                    showCaption: false,
                },
                {
                    url: "https://meetmyavatarstatic.blob.core.windows.net/staticfiles/videos/play.mp4",
                    caption: "You play, I talk",
                    showCaption: false,
                },
            ],
        };
    },
    methods: {
        handleVideoPlay(index) {
            setTimeout(() => {
                this.videos[index].showCaption = true;
            }, 3000);
        },
    },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>