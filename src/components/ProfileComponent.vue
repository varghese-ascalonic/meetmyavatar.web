<template>
    <div>
        <!-- Profile Card -->
        <div class="max-w-lg mx-auto bg-white shadow-xl overflow-hidden rounded-none lg:rounded-lg">
            <!-- Cover Photo -->
            <div class="h-36 bg-cover bg-center"
                style="background-image: url('https://meetmyavatarstatic.blob.core.windows.net/staticfiles/chatbackgrounds/art_in_heart_3.jpg');">
            </div>
            <!-- Profile Header -->
            <div class="flex items-center px-6 py-4 mt-0 lg:-mt-12">
                <img :src="profile.profilePictureUrl || defaultProfilePicture" alt="Profile Picture"
                    class="w-24 h-24 border-4 border-white rounded-full object-cover bg-gray-200" />
                <div class="ml-4">
                    <h1 class="text-2xl font-bold text-gray-800">{{ profile.avatarName }}</h1>
                    <p class="text-gray-600">@{{ profile.uniqueAvatarId }}</p>
                    <p class="text-sm text-gray-500">Joined on {{ profile.createdOn }}</p>
                </div>
            </div>
            <!-- Bio/Global Prompt (if any) -->
            <div class="px-6 py-4 border-t border-gray-200" v-if="profile.globalPrompt">
                <p class="text-gray-700">{{ profile.globalPrompt }}</p>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="max-w-lg mx-auto mt-6 space-y-4 px-4">
            <button @click="goToMessages"
                class="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                <!-- Chat Icon -->
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.96 9.96 0 01-4-.8L3 21l1.8-3.6A8.966 8.966 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                    </path>
                </svg>
                <span>Chat with this avatar</span>
            </button>
            <button @click="goToMessages"
                class="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg">
                <!-- Create Icon -->
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Create your avatar</span>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProfileComponent',
    data() {
        return {
            defaultProfilePicture:
                'https://meetmyavatarstatic.blob.core.windows.net/staticfiles/profile-default.svg'
        };
    },
    computed: {
        // Retrieve profile from profileStore.
        profile() {
            return this.$store.getters['profile/profile'] || {};
        }
    },
    created() {
        const avatarUniqueId = this.$route.params.avatarUniqueId;
        const token = localStorage.getItem('authToken');
        const isAuthenticated = !!token;
        if (isAuthenticated) {
            // Fetch detailed profile if logged in.
            this.$store
                .dispatch('profile/fetchPrivateProfile', avatarUniqueId)
                .catch((err) => console.error('Error fetching private profile:', err));
        } else {
            // Fetch public profile if not logged in.
            this.$store
                .dispatch('profile/fetchPublicProfile', avatarUniqueId)
                .catch((err) => console.error('Error fetching public profile:', err));
        }
    },
    methods: {
        goToMessages() {
            this.$router.push({ name: 'MessengerList' });
        }
    }
};
</script>