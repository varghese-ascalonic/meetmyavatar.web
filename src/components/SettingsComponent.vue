<template>
    <div class="settings-container h-full bg-gray-800 text-white">
        <!-- Header -->
        <header class="header flex items-center p-4 bg-gray-900 border-b border-gray-700">
            <button class="mr-2 focus:outline-none" @click="goBack">
                <img src="https://meetmyavatarstatic.blob.core.windows.net/staticfiles/back-arrow.svg" alt="Back"
                    class="h-6 w-6 filter invert" />
            </button>
            <h1 class="text-xl font-semibold">Settings</h1>
        </header>

        <!-- Main Content -->
        <main class="p-6">
            <!-- Profile Picture -->
            <div class="flex justify-center mb-6">
                <img :src="user.profilePictureUrl || defaultProfilePicture" alt="Profile Picture"
                    class="h-24 w-24 rounded-full border-4 border-gray-700" />
            </div>

            <!-- User Details Form -->
            <div class="space-y-4">
                <div>
                    <label for="displayName" class="block text-sm font-medium mb-1">Display Name</label>
                    <input id="displayName" type="text" v-model="displayName"
                        class="w-full p-2 bg-gray-700 text-white rounded focus:outline-none" />
                </div>
                <div>
                    <label for="username" class="block text-sm font-medium mb-1">Username</label>
                    <input id="username" type="text" v-model="username"
                        class="w-full p-2 bg-gray-700 text-white rounded focus:outline-none" />
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium mb-1">Email</label>
                    <input id="email" type="email" :value="user.email" disabled
                        class="w-full p-2 bg-gray-600 text-gray-300 rounded cursor-not-allowed" />
                </div>
            </div>

            <!-- Buttons -->
            <div class="mt-6 space-y-3">
                <button @click="saveSettings"
                    class="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium">
                    Save
                </button>
                <button @click="logout" class="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium">
                    Logout
                </button>
                <button @click="deleteAccount"
                    class="w-full py-2 bg-gray-600 hover:bg-gray-700 rounded text-white font-medium">
                    Delete Account
                </button>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    name: 'SettingsComponent',
    data() {
        return {
            displayName: '',
            username: '',
            // Fallback profile picture if none exists in user data
            defaultProfilePicture: 'https://meetmyavatarstatic.blob.core.windows.net/staticfiles/default-avatar.png'
        };
    },
    computed: {
        // Assume user data is stored in the 'auth' module of Vuex
        user() {
            return this.$store.getters['auth/user'] || {};
        }
    },
    created() {
        // Initialize form fields with current user details
        if (this.user) {
            this.displayName = this.user.displayName || '';
            this.username = this.user.username || '';
        }
    },
    methods: {
        goBack() {
            this.$router.push({ name: 'MessengerList' });
        },
        saveSettings() {
            // Implement saving logic (e.g., dispatch a Vuex action)
            console.log('Saving settings:', this.displayName, this.username);
            // Example: this.$store.dispatch('auth/updateUserSettings', { displayName: this.displayName, username: this.username });
        },
        logout() {
            // Dispatch logout action and navigate to authentication
            this.$store.dispatch('auth/logout');
            this.$router.push('/authenticate');
        },
        deleteAccount() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // Implement account deletion logic here (e.g., dispatch a Vuex action)
                console.log('Account deleted');
            }
        }
    }
};
</script>

<style scoped>
.settings-container {
    min-height: 100vh;
    max-width: 600px;
    margin: 0 auto;
    /* Centers the container horizontally */
}

/* Additional header styling can be added here if needed */
.header {}

/* Make the whole page background match the container's background */
:global(body) {
    background-color: #2d3748;
    /* Tailwind's bg-gray-800 color */
}
</style>